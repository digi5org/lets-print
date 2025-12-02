import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware to verify JWT token and authenticate user
 * Attaches user info to req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        isActive: true,
        roleId: true,
        tenantId: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Attach user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roleId: decoded.roleId,
      roleName: decoded.roleName,
      tenantId: decoded.tenantId,
      permissions: decoded.permissions || [],
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

/**
 * Middleware to check if user has a specific role
 * Usage: requireRole('super_admin')
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Flatten array if passed as single array argument
    const roles = allowedRoles.length === 1 && Array.isArray(allowedRoles[0]) 
      ? allowedRoles[0] 
      : allowedRoles;

    console.log('RequireRole check:', { userRole: req.user.roleName, allowedRoles: roles });

    if (!roles.includes(req.user.roleName)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}, but user has: ${req.user.roleName}`,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is super_admin
 */
export const requireSuperAdmin = requireRole('super_admin');

/**
 * Middleware to check if user has a specific permission
 * Usage: requirePermission('create_product')
 */
export const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const userPermissions = req.user.permissions || [];
    
    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${requiredPermissions.join(' or ')}`,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user owns the resource (tenant-based)
 * Checks if the resource's tenantId matches the user's tenantId
 * Super admins bypass this check
 */
export const requireOwnership = (resourceTenantIdField = 'tenantId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Super admin can access everything
    if (req.user.roleName === 'super_admin') {
      return next();
    }

    // Get tenantId from resource (could be in params, body, or query)
    const resourceTenantId = req.params[resourceTenantIdField] || 
                            req.body[resourceTenantIdField] || 
                            req.query[resourceTenantIdField];

    // Check if user's tenantId matches resource's tenantId
    if (req.user.tenantId !== resourceTenantId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own tenant resources.',
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if not authenticated
 * Useful for routes that work for both authenticated and guest users
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, JWT_SECRET);

      // Check if user exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          isActive: true,
          roleId: true,
          tenantId: true,
        },
      });

      if (user && user.isActive) {
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          roleId: decoded.roleId,
          roleName: decoded.roleName,
          tenantId: decoded.tenantId,
          permissions: decoded.permissions || [],
        };
      }
    }
  } catch (error) {
    // Ignore errors for optional auth
  }
  
  next();
};
