import { verifySession } from 'supertokens-node/recipe/session/framework/express/index.js';

// Middleware to verify session
export const authenticate = verifySession();

// Middleware to check if user is admin
export const requireAdmin = async (req, res, next) => {
  try {
    const session = req.session;
    const role = session.getAccessTokenPayload().role;

    if (role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
};

// Middleware to get current user from session
export const getCurrentUser = async (req, res, next) => {
  try {
    const session = req.session;
    const payload = session.getAccessTokenPayload();
    
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
      supertokensId: payload.sub,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
};

// Optional authentication - doesn't fail if not authenticated
export const optionalAuth = async (req, res, next) => {
  try {
    const session = await verifySession({ sessionRequired: false })(req, res, () => {});
    if (req.session) {
      const payload = req.session.getAccessTokenPayload();
      req.user = {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        name: payload.name,
        supertokensId: payload.sub,
      };
    }
  } catch (error) {
    // Ignore error for optional auth
  }
  next();
};
