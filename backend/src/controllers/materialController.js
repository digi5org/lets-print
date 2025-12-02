import prisma from '../config/database.js';
import { logActivity } from '../services/activityService.js';

// Get all materials
export const getAllMaterials = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { category, status } = req.query;

    const where = { tenantId };

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    const materials = await prisma.material.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Calculate status based on quantity and reorderLevel
    const materialsWithStatus = materials.map(material => {
      let calculatedStatus = 'In Stock';
      if (material.quantity <= 0) {
        calculatedStatus = 'Out of Stock';
      } else if (material.quantity <= material.reorderLevel) {
        calculatedStatus = 'Low Stock';
      } else if (material.quantity <= material.reorderLevel * 1.5) {
        calculatedStatus = 'Reorder Soon';
      }

      return {
        ...material,
        status: calculatedStatus,
      };
    });

    res.json({
      success: true,
      data: materialsWithStatus,
    });
  } catch (error) {
    next(error);
  }
};

// Get single material
export const getMaterialById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    const material = await prisma.material.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    res.json({
      success: true,
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

// Create material
export const createMaterial = async (req, res, next) => {
  try {
    const { tenantId, userId } = req.user;
    const {
      name,
      category,
      quantity,
      unit,
      reorderLevel,
      costPerUnit,
      supplier,
      description,
    } = req.body;

    const material = await prisma.material.create({
      data: {
        name,
        category,
        quantity: parseFloat(quantity),
        unit,
        reorderLevel: parseFloat(reorderLevel),
        costPerUnit: parseFloat(costPerUnit),
        supplier,
        description,
        tenantId,
      },
    });

    // Log activity
    await logActivity({
      userId,
      tenantId,
      action: 'material_created',
      entityType: 'material',
      entityId: material.id,
      entityName: material.name,
    });

    res.status(201).json({
      success: true,
      message: 'Material created successfully',
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

// Update material
export const updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tenantId, userId } = req.user;
    const {
      name,
      category,
      quantity,
      unit,
      reorderLevel,
      costPerUnit,
      supplier,
      description,
    } = req.body;

    const existingMaterial = await prisma.material.findFirst({
      where: { id, tenantId },
    });

    if (!existingMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    const material = await prisma.material.update({
      where: { id },
      data: {
        name,
        category,
        quantity: quantity !== undefined ? parseFloat(quantity) : undefined,
        unit,
        reorderLevel: reorderLevel !== undefined ? parseFloat(reorderLevel) : undefined,
        costPerUnit: costPerUnit !== undefined ? parseFloat(costPerUnit) : undefined,
        supplier,
        description,
      },
    });

    // Log activity
    await logActivity({
      userId,
      tenantId,
      action: 'material_updated',
      entityType: 'material',
      entityId: material.id,
      entityName: material.name,
    });

    res.json({
      success: true,
      message: 'Material updated successfully',
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

// Delete material
export const deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tenantId, userId } = req.user;

    const material = await prisma.material.findFirst({
      where: { id, tenantId },
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    await prisma.material.delete({
      where: { id },
    });

    // Log activity
    await logActivity({
      userId,
      tenantId,
      action: 'material_deleted',
      entityType: 'material',
      entityId: id,
      entityName: material.name,
    });

    res.json({
      success: true,
      message: 'Material deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Adjust material quantity (for inventory adjustments)
export const adjustMaterialQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tenantId, userId } = req.user;
    const { adjustment, reason } = req.body;

    const material = await prisma.material.findFirst({
      where: { id, tenantId },
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    const newQuantity = material.quantity + parseFloat(adjustment);

    if (newQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Adjustment would result in negative quantity',
      });
    }

    const updatedMaterial = await prisma.material.update({
      where: { id },
      data: {
        quantity: newQuantity,
      },
    });

    // Log activity
    await logActivity({
      userId,
      tenantId,
      action: 'material_quantity_adjusted',
      entityType: 'material',
      entityId: id,
      entityName: material.name,
      metadata: {
        previousQuantity: material.quantity,
        adjustment: parseFloat(adjustment),
        newQuantity,
        reason,
      },
    });

    res.json({
      success: true,
      message: 'Material quantity adjusted successfully',
      data: updatedMaterial,
    });
  } catch (error) {
    next(error);
  }
};

// Get material statistics
export const getMaterialStats = async (req, res, next) => {
  try {
    const { tenantId } = req.user;

    const [
      totalMaterials,
      lowStockCount,
      outOfStockCount,
      totalValue,
    ] = await Promise.all([
      prisma.material.count({ where: { tenantId } }),
      prisma.material.count({
        where: {
          tenantId,
          quantity: {
            lte: prisma.material.fields.reorderLevel,
            gt: 0,
          },
        },
      }),
      prisma.material.count({
        where: {
          tenantId,
          quantity: 0,
        },
      }),
      prisma.material.aggregate({
        where: { tenantId },
        _sum: {
          quantity: true,
        },
      }),
    ]);

    // Calculate total cost
    const materials = await prisma.material.findMany({
      where: { tenantId },
      select: {
        quantity: true,
        costPerUnit: true,
      },
    });

    const totalCost = materials.reduce(
      (sum, mat) => sum + mat.quantity * mat.costPerUnit,
      0
    );

    res.json({
      success: true,
      data: {
        totalMaterials,
        lowStockCount,
        outOfStockCount,
        totalValue: totalValue._sum.quantity || 0,
        totalCost,
      },
    });
  } catch (error) {
    next(error);
  }
};
