import prisma from '../config/database.js';

/**
 * Generate unique tracking number
 */
const generateTrackingNumber = () => {
  const prefix = 'TRK';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
};

/**
 * Get all deliveries for a tenant
 */
export const getAllDeliveries = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { status, fromDate, toDate } = req.query;

    const where = { tenantId };

    if (status) {
      where.status = status;
    }

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    const deliveries = await prisma.delivery.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: deliveries,
    });
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch deliveries',
      error: error.message,
    });
  }
};

/**
 * Get delivery by ID
 */
export const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const delivery = await prisma.delivery.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        order: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    console.error('Error fetching delivery:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch delivery',
      error: error.message,
    });
  }
};

/**
 * Get delivery by tracking number (public)
 */
export const getDeliveryByTracking = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const delivery = await prisma.delivery.findUnique({
      where: { trackingNumber },
      select: {
        id: true,
        trackingNumber: true,
        status: true,
        customerName: true,
        deliveryAddress: true,
        estimatedDelivery: true,
        actualDelivery: true,
        driverName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    console.error('Error fetching delivery by tracking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch delivery',
      error: error.message,
    });
  }
};

/**
 * Create new delivery
 */
export const createDelivery = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const {
      orderId,
      customerName,
      customerPhone,
      deliveryAddress,
      driverName,
      driverPhone,
      vehicleNumber,
      estimatedDelivery,
      notes,
    } = req.body;

    // Validate required fields
    if (!orderId || !customerName || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, customer name, and delivery address are required',
      });
    }

    // Verify order exists and belongs to tenant
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        tenantId,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Generate tracking number
    const trackingNumber = generateTrackingNumber();

    const delivery = await prisma.delivery.create({
      data: {
        orderId,
        tenantId,
        customerName,
        customerPhone,
        deliveryAddress,
        driverName,
        driverPhone,
        vehicleNumber,
        trackingNumber,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
        notes,
        status: 'Scheduled',
      },
      include: {
        order: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.userId,
        action: 'delivery_created',
        entityType: 'delivery',
        entityId: delivery.id,
        entityName: `Delivery ${delivery.trackingNumber}`,
        metadata: { orderId, trackingNumber },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Delivery created successfully',
      data: delivery,
    });
  } catch (error) {
    console.error('Error creating delivery:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create delivery',
      error: error.message,
    });
  }
};

/**
 * Update delivery
 */
export const updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.tenantId;
    delete updateData.orderId;
    delete updateData.trackingNumber;

    // Convert date strings
    if (updateData.estimatedDelivery) {
      updateData.estimatedDelivery = new Date(updateData.estimatedDelivery);
    }
    if (updateData.actualDelivery) {
      updateData.actualDelivery = new Date(updateData.actualDelivery);
    }

    // Verify ownership
    const existingDelivery = await prisma.delivery.findFirst({
      where: { id, tenantId },
    });

    if (!existingDelivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    const delivery = await prisma.delivery.update({
      where: { id },
      data: updateData,
      include: {
        order: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.userId,
        action: 'delivery_updated',
        entityType: 'delivery',
        entityId: delivery.id,
        entityName: `Delivery ${delivery.trackingNumber}`,
        metadata: { changes: Object.keys(updateData) },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Delivery updated successfully',
      data: delivery,
    });
  } catch (error) {
    console.error('Error updating delivery:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update delivery',
      error: error.message,
    });
  }
};

/**
 * Update delivery status
 */
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const validStatuses = ['Scheduled', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const existingDelivery = await prisma.delivery.findFirst({
      where: { id, tenantId },
    });

    if (!existingDelivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    const updateData = { status };
    
    // Set actual delivery date if status is Delivered
    if (status === 'Delivered' && !existingDelivery.actualDelivery) {
      updateData.actualDelivery = new Date();
    }

    if (notes) {
      updateData.notes = notes;
    }

    const delivery = await prisma.delivery.update({
      where: { id },
      data: updateData,
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.userId,
        action: 'delivery_status_updated',
        entityType: 'delivery',
        entityId: delivery.id,
        entityName: `Delivery ${delivery.trackingNumber}`,
        metadata: { oldStatus: existingDelivery.status, newStatus: status },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Delivery status updated successfully',
      data: delivery,
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update delivery status',
      error: error.message,
    });
  }
};

/**
 * Delete delivery
 */
export const deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const delivery = await prisma.delivery.findFirst({
      where: { id, tenantId },
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    await prisma.delivery.delete({
      where: { id },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.userId,
        action: 'delivery_deleted',
        entityType: 'delivery',
        entityId: id,
        entityName: `Delivery ${delivery.trackingNumber}`,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Delivery deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting delivery:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete delivery',
      error: error.message,
    });
  }
};

/**
 * Get delivery statistics
 */
export const getDeliveryStats = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalDeliveries,
      scheduled,
      inTransit,
      outForDelivery,
      delivered,
      failed,
      completedToday,
      onTimeDeliveries,
      totalDeliveriesWithEstimate,
    ] = await Promise.all([
      prisma.delivery.count({ where: { tenantId } }),
      prisma.delivery.count({ where: { tenantId, status: 'Scheduled' } }),
      prisma.delivery.count({ where: { tenantId, status: 'In Transit' } }),
      prisma.delivery.count({ where: { tenantId, status: 'Out for Delivery' } }),
      prisma.delivery.count({ where: { tenantId, status: 'Delivered' } }),
      prisma.delivery.count({ where: { tenantId, status: 'Failed' } }),
      prisma.delivery.count({
        where: {
          tenantId,
          status: 'Delivered',
          actualDelivery: { gte: today },
        },
      }),
      // Count deliveries delivered on or before estimated date
      prisma.delivery.count({
        where: {
          tenantId,
          status: 'Delivered',
          actualDelivery: { not: null },
          estimatedDelivery: { not: null },
          AND: {
            actualDelivery: {
              lte: prisma.delivery.fields.estimatedDelivery,
            },
          },
        },
      }),
      // Total deliveries with estimate for calculating on-time rate
      prisma.delivery.count({
        where: {
          tenantId,
          status: 'Delivered',
          actualDelivery: { not: null },
          estimatedDelivery: { not: null },
        },
      }),
    ]);

    const activeDeliveries = inTransit + outForDelivery;
    const onTimeRate = totalDeliveriesWithEstimate > 0
      ? ((onTimeDeliveries / totalDeliveriesWithEstimate) * 100).toFixed(1)
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalDeliveries,
        scheduled,
        activeDeliveries,
        inTransit,
        outForDelivery,
        delivered,
        failed,
        completedToday,
        onTimeRate: parseFloat(onTimeRate),
      },
    });
  } catch (error) {
    console.error('Error fetching delivery stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch delivery statistics',
      error: error.message,
    });
  }
};
