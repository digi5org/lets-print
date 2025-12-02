import prisma from '../config/database.js';

// Get all orders (Admin: all orders, User: own orders)
export const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const isAdmin = req.user.roleName === 'super_admin';
    const { userId, tenantId } = req.user;

    const where = {};
    
    if (!isAdmin) {
      // For non-admin users, show orders from their tenant or their own orders
      if (tenantId) {
        where.tenantId = tenantId;
      } else {
        where.userId = userId;
      }
    }
    
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: true,
            design: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get single order
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.roleName === 'super_admin';
    const { userId } = req.user;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: true,
            design: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order or is admin
    if (!isAdmin && order.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Create order
export const createOrder = async (req, res, next) => {
  try {
    const { items, notes, priority, dueDate } = req.body;
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    // Calculate total and validate products
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product is not available: ${product.name}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        designId: item.designId || null,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        tenantId,
        totalAmount,
        notes,
        priority: priority || 'Medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
            design: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PROCESSING', 'PRINTING', 'COMPLETED', 'CANCELLED'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: true,
            design: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order (User can cancel own pending orders)
export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.roleName === 'super_admin';
    const { userId } = req.user;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order or is admin
    if (!isAdmin && order.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Only pending or processing orders can be cancelled
    if (!['PENDING', 'PROCESSING'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage',
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        orderItems: {
          include: {
            product: true,
            design: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
