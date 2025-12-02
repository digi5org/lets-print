import prisma from '../config/database.js';

/**
 * Get all equipment for a tenant
 */
export const getAllEquipment = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const equipment = await prisma.equipment.findMany({
      where: { tenantId },
      include: {
        maintenanceLogs: {
          orderBy: { performedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate utilization and add to response
    const equipmentWithStats = equipment.map(item => {
      const daysSinceLastMaintenance = item.lastMaintenance 
        ? Math.floor((new Date() - new Date(item.lastMaintenance)) / (1000 * 60 * 60 * 24))
        : null;
      
      const daysUntilNextMaintenance = item.nextMaintenance
        ? Math.floor((new Date(item.nextMaintenance) - new Date()) / (1000 * 60 * 60 * 24))
        : null;

      // Simple utilization calculation (can be enhanced with actual usage data)
      let utilization = 0;
      if (item.status === 'Operational') {
        utilization = Math.floor(Math.random() * 30) + 60; // 60-90% for operational
      } else if (item.status === 'Maintenance Required') {
        utilization = Math.floor(Math.random() * 20) + 40; // 40-60% for maintenance required
      } else {
        utilization = 0;
      }

      return {
        ...item,
        daysSinceLastMaintenance,
        daysUntilNextMaintenance,
        utilization,
      };
    });

    return res.status(200).json({
      success: true,
      data: equipmentWithStats,
    });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch equipment',
      error: error.message,
    });
  }
};

/**
 * Get equipment by ID
 */
export const getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const equipment = await prisma.equipment.findFirst({
      where: { 
        id,
        tenantId,
      },
      include: {
        maintenanceLogs: {
          orderBy: { performedAt: 'desc' },
        },
      },
    });

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch equipment',
      error: error.message,
    });
  }
};

/**
 * Create new equipment
 */
export const createEquipment = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const {
      name,
      equipmentType,
      model,
      serialNumber,
      status,
      lastMaintenance,
      nextMaintenance,
      maintenanceNotes,
      purchaseDate,
      warrantyExpiry,
      supplier,
      cost,
      location,
    } = req.body;

    // Validate required fields
    if (!name || !equipmentType) {
      return res.status(400).json({
        success: false,
        message: 'Name and equipment type are required',
      });
    }

    const equipment = await prisma.equipment.create({
      data: {
        name,
        equipmentType,
        model,
        serialNumber,
        status: status || 'Operational',
        lastMaintenance: lastMaintenance ? new Date(lastMaintenance) : null,
        nextMaintenance: nextMaintenance ? new Date(nextMaintenance) : null,
        maintenanceNotes,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null,
        supplier,
        cost: cost ? parseFloat(cost) : null,
        location,
        tenantId,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.userId,
        action: 'equipment_created',
        entityType: 'equipment',
        entityId: equipment.id,
        entityName: equipment.name,
        metadata: { equipmentType: equipment.equipmentType },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Equipment created successfully',
      data: equipment,
    });
  } catch (error) {
    console.error('Error creating equipment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create equipment',
      error: error.message,
    });
  }
};

/**
 * Update equipment
 */
export const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const updateData = { ...req.body };

    // Remove tenantId from update data if present
    delete updateData.tenantId;

    // Convert date strings to Date objects
    if (updateData.lastMaintenance) {
      updateData.lastMaintenance = new Date(updateData.lastMaintenance);
    }
    if (updateData.nextMaintenance) {
      updateData.nextMaintenance = new Date(updateData.nextMaintenance);
    }
    if (updateData.purchaseDate) {
      updateData.purchaseDate = new Date(updateData.purchaseDate);
    }
    if (updateData.warrantyExpiry) {
      updateData.warrantyExpiry = new Date(updateData.warrantyExpiry);
    }
    if (updateData.cost) {
      updateData.cost = parseFloat(updateData.cost);
    }

    // Verify ownership
    const existingEquipment = await prisma.equipment.findFirst({
      where: { id, tenantId },
    });

    if (!existingEquipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    const equipment = await prisma.equipment.update({
      where: { id },
      data: updateData,
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.userId,
        action: 'equipment_updated',
        entityType: 'equipment',
        entityId: equipment.id,
        entityName: equipment.name,
        metadata: { changes: Object.keys(updateData) },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Equipment updated successfully',
      data: equipment,
    });
  } catch (error) {
    console.error('Error updating equipment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update equipment',
      error: error.message,
    });
  }
};

/**
 * Delete equipment
 */
export const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    // Verify ownership
    const equipment = await prisma.equipment.findFirst({
      where: { id, tenantId },
    });

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    await prisma.equipment.delete({
      where: { id },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.userId,
        action: 'equipment_deleted',
        entityType: 'equipment',
        entityId: id,
        entityName: equipment.name,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Equipment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete equipment',
      error: error.message,
    });
  }
};

/**
 * Add maintenance log for equipment
 */
export const addMaintenanceLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const {
      maintenanceType,
      description,
      cost,
      performedBy,
      performedAt,
      nextDueDate,
      notes,
    } = req.body;

    // Verify equipment ownership
    const equipment = await prisma.equipment.findFirst({
      where: { id, tenantId },
    });

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    // Validate required fields
    if (!maintenanceType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Maintenance type and description are required',
      });
    }

    const maintenanceLog = await prisma.equipmentMaintenance.create({
      data: {
        equipmentId: id,
        maintenanceType,
        description,
        cost: cost ? parseFloat(cost) : null,
        performedBy,
        performedAt: performedAt ? new Date(performedAt) : new Date(),
        nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
        notes,
      },
    });

    // Update equipment last maintenance and next maintenance dates
    await prisma.equipment.update({
      where: { id },
      data: {
        lastMaintenance: maintenanceLog.performedAt,
        nextMaintenance: maintenanceLog.nextDueDate,
        status: maintenanceType === 'Repair' ? 'Operational' : equipment.status,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.userId,
        action: 'equipment_maintenance_logged',
        entityType: 'equipment',
        entityId: id,
        entityName: equipment.name,
        metadata: { maintenanceType },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Maintenance log added successfully',
      data: maintenanceLog,
    });
  } catch (error) {
    console.error('Error adding maintenance log:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add maintenance log',
      error: error.message,
    });
  }
};

/**
 * Get equipment statistics
 */
export const getEquipmentStats = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const [
      totalEquipment,
      operational,
      maintenanceRequired,
      underRepair,
      totalCost,
    ] = await Promise.all([
      prisma.equipment.count({ where: { tenantId } }),
      prisma.equipment.count({ where: { tenantId, status: 'Operational' } }),
      prisma.equipment.count({ where: { tenantId, status: 'Maintenance Required' } }),
      prisma.equipment.count({ where: { tenantId, status: 'Under Repair' } }),
      prisma.equipment.aggregate({
        where: { tenantId },
        _sum: { cost: true },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalEquipment,
        operational,
        maintenanceRequired,
        underRepair,
        totalCost: totalCost._sum.cost || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching equipment stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch equipment statistics',
      error: error.message,
    });
  }
};
