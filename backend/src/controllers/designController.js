import prisma from '../config/database.js';

// Get all designs (User: own designs, Admin: all designs)
export const getAllDesigns = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';

    const where = {};
    
    if (!isAdmin) {
      where.userId = req.user.id;
    }

    const designs = await prisma.design.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: designs,
    });
  } catch (error) {
    next(error);
  }
};

// Get single design
export const getDesignById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === 'ADMIN';

    const design = await prisma.design.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    // Check if user owns the design or is admin
    if (!isAdmin && design.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: design,
    });
  } catch (error) {
    next(error);
  }
};

// Create design
export const createDesign = async (req, res, next) => {
  try {
    const { name, fileUrl, fileType, fileSize, thumbnailUrl } = req.body;
    const userId = req.user.id;

    const design = await prisma.design.create({
      data: {
        userId,
        name,
        fileUrl,
        fileType,
        fileSize: parseInt(fileSize),
        thumbnailUrl,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Design created successfully',
      data: design,
    });
  } catch (error) {
    next(error);
  }
};

// Update design
export const updateDesign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, thumbnailUrl } = req.body;
    const isAdmin = req.user.role === 'ADMIN';

    const existingDesign = await prisma.design.findUnique({
      where: { id },
    });

    if (!existingDesign) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    // Check if user owns the design or is admin
    if (!isAdmin && existingDesign.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const design = await prisma.design.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
      },
    });

    res.json({
      success: true,
      message: 'Design updated successfully',
      data: design,
    });
  } catch (error) {
    next(error);
  }
};

// Delete design
export const deleteDesign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === 'ADMIN';

    const design = await prisma.design.findUnique({
      where: { id },
    });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    // Check if user owns the design or is admin
    if (!isAdmin && design.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await prisma.design.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Design deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
