import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '../services/emailService.js';
import { getRecentActivities, logActivity, getRequestInfo } from '../services/activityService.js';

/**
 * Generate a secure random token
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Create a new user (super_admin only)
 * Can create business_owner, production_owner users
 * Super admin sets password directly - no email verification
 */
export const createUser = async (req, res, next) => {
  try {
    const { email, password, name, roleName, tenantId } = req.body;

    // Prevent creating super_admin through this route
    if (roleName === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot create super_admin users through this endpoint',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Get the specified role
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      return res.status(400).json({
        success: false,
        message: `Invalid role: ${roleName}`,
      });
    }

    // If tenantId is provided, verify it exists
    if (tenantId) {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      if (!tenant) {
        return res.status(404).json({
          success: false,
          message: 'Tenant not found',
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with password set by admin
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: role.id,
        tenantId: tenantId || null,
        isActive: true, // User active immediately
        emailVerified: true, // Mark as verified since admin created it
      },
      include: {
        role: true,
        tenant: true,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Log activity
    const requestInfo = getRequestInfo(req);
    await logActivity({
      action: 'user_created',
      userId: req.user.userId,
      entityType: 'user',
      entityId: user.id,
      entityName: user.name || user.email,
      metadata: { role: role.name, createdBy: 'admin' },
      ...requestInfo,
    });

    res.status(201).json({
      success: true,
      message: `User created successfully`,
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users (super_admin only)
 * Supports filtering by role and tenant
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { roleName, tenantId, isActive, search } = req.query;

    const where = {};

    // Filter by role
    if (roleName) {
      const role = await prisma.role.findUnique({
        where: { name: roleName },
      });
      if (role) {
        where.roleId = role.id;
      }
    }

    // Filter by tenant
    if (tenantId) {
      where.tenantId = tenantId;
    }

    // Filter by active status
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Search by name or email
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        tenantId: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            orders: true,
            designs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user details (super_admin only)
 * Can update role, tenant, and active status
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, roleName, tenantId, isActive } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (tenantId !== undefined) updateData.tenantId = tenantId;

    // Handle role update
    if (roleName) {
      const role = await prisma.role.findUnique({
        where: { name: roleName },
      });

      if (!role) {
        return res.status(400).json({
          success: false,
          message: `Invalid role: ${roleName}`,
        });
      }

      updateData.roleId = role.id;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        tenantId: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Log activity
    const requestInfo = getRequestInfo(req);
    const action = isActive === false ? 'user_suspended' : isActive === true ? 'user_activated' : 'user_updated';
    await logActivity({
      action,
      userId: req.user.userId,
      entityType: 'user',
      entityId: user.id,
      entityName: user.name || user.email,
      metadata: { updatedFields: Object.keys(updateData) },
      ...requestInfo,
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (super_admin only)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true },
    });

    await prisma.user.delete({
      where: { id },
    });

    // Log activity
    const requestInfo = getRequestInfo(req);
    await logActivity({
      action: 'user_deleted',
      userId: req.user.userId,
      entityType: 'user',
      entityId: id,
      entityName: user?.name || user?.email || 'Unknown user',
      ...requestInfo,
    });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset user password (super_admin only)
 */
export const resetUserPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all roles and their permissions
 */
export const getRoles = async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new tenant (super_admin only)
 */
export const createTenant = async (req, res, next) => {
  try {
    const { name, slug, domain } = req.body;

    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug,
        domain: domain || null,
        isActive: true,
      },
    });

    // Log activity
    const requestInfo = getRequestInfo(req);
    await logActivity({
      action: 'business_created',
      userId: req.user.userId,
      entityType: 'business',
      entityId: tenant.id,
      entityName: tenant.name,
      ...requestInfo,
    });

    res.status(201).json({
      success: true,
      message: 'Tenant created successfully',
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tenants
 */
export const getAllTenants = async (req, res, next) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            users: true,
            tenantProducts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: tenants,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update tenant
 */
export const updateTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, domain, isActive } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (domain !== undefined) updateData.domain = domain;
    if (isActive !== undefined) updateData.isActive = isActive;

    const tenant = await prisma.tenant.update({
      where: { id },
      data: updateData,
    });

    // Log activity
    const requestInfo = getRequestInfo(req);
    await logActivity({
      action: 'business_updated',
      userId: req.user.userId,
      entityType: 'tenant',
      entityId: tenant.id,
      entityName: tenant.name,
      metadata: { updatedFields: Object.keys(updateData) },
      ...requestInfo,
    });

    res.json({
      success: true,
      message: 'Tenant updated successfully',
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete tenant
 */
export const deleteTenant = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            tenantProducts: true,
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found',
      });
    }

    // Check if tenant has users or products
    if (tenant._count.users > 0 || tenant._count.tenantProducts > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete tenant. It has ${tenant._count.users} user(s) and ${tenant._count.tenantProducts} product(s). Please remove them first.`,
      });
    }

    // Delete tenant
    await prisma.tenant.delete({
      where: { id },
    });

    // Log activity
    const requestInfo = getRequestInfo(req);
    await logActivity({
      action: 'business_deleted',
      userId: req.user.userId,
      entityType: 'tenant',
      entityId: id,
      entityName: tenant.name,
      metadata: { deletedBy: 'admin' },
      ...requestInfo,
    });

    res.json({
      success: true,
      message: 'Tenant deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recent activity logs
 */
export const getActivities = async (req, res, next) => {
  try {
    const { limit = 20, userId, entityType } = req.query;

    const activities = await getRecentActivities({
      limit: parseInt(limit),
      userId,
      entityType,
    });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Impersonate a business owner (super_admin only)
 * Allows super admin to login as a business with read-only access
 */
export const impersonateBusiness = async (req, res, next) => {
  try {
    const { id: tenantId } = req.params;
    const { readOnly = true } = req.body;

    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        users: {
          include: {
            role: true,
          },
          where: {
            role: {
              name: 'business_owner',
            },
          },
          take: 1,
        },
      },
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    // Find or get a business_owner user for this tenant
    let businessOwner = tenant.users[0];

    if (!businessOwner) {
      return res.status(400).json({
        success: false,
        message: 'No business owner found for this tenant',
      });
    }

    // Import JWT for token generation
    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

    // Create impersonation token with special flags
    const token = jwt.default.sign(
      {
        userId: businessOwner.id,
        email: businessOwner.email,
        role: businessOwner.role.name,
        tenantId: tenant.id,
        impersonatedBy: req.user.userId,
        readOnly: readOnly,
        isImpersonation: true,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Log activity
    const requestInfo = getRequestInfo(req);
    await logActivity({
      action: 'admin_impersonation',
      userId: req.user.userId,
      entityType: 'tenant',
      entityId: tenant.id,
      entityName: tenant.name,
      metadata: {
        impersonatedUser: businessOwner.email,
        readOnly: readOnly,
      },
      ...requestInfo,
    });

    res.json({
      success: true,
      message: 'Impersonation token generated',
      data: {
        token,
        user: {
          id: businessOwner.id,
          email: businessOwner.email,
          name: businessOwner.name,
          role: businessOwner.role.name,
          tenantId: tenant.id,
          tenantName: tenant.name,
        },
        impersonation: {
          readOnly: readOnly,
          impersonatedBy: req.user.userId,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
