/**
 * Role-Based Access Control (RBAC) Middleware
 * Checks if the authenticated user has the required role to access a resource
 */

export const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Get user's role name - the auth middleware sets it as req.user.roleName
        const userRole = req.user.roleName;

        if (!userRole) {
            return res.status(403).json({
                success: false,
                message: 'User role not found'
            });
        }

        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.',
                requiredRoles: allowedRoles,
                userRole: userRole
            });
        }

        // User is authorized
        next();
    };
};

/**
 * Check if user belongs to a specific tenant
 */
export const checkTenantAccess = (req, res, next) => {
    const { tenantId } = req.params;
    const userTenantId = req.user.tenantId;
    const userRole = req.user.roleName;

    // SuperAdmin can access any tenant
    if (userRole === 'super_admin') {
        return next();
    }

    // Check if user belongs to the requested tenant
    if (userTenantId !== tenantId) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. You do not have access to this tenant.'
        });
    }

    next();
};

/**
 * Check if user can manage a specific resource
 */
export const checkResourceOwnership = (resourceField = 'userId') => {
    return (req, res, next) => {
        const resourceOwnerId = req.resource?.[resourceField];
        const userId = req.user.id;
        const userRole = req.user.roleName;

        // SuperAdmin can manage any resource
        if (userRole === 'super_admin') {
            return next();
        }

        // Check if user owns the resource
        if (resourceOwnerId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only manage your own resources.'
            });
        }

        next();
    };
};
