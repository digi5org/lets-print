import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// JWT secret key - should be in .env
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Register a new user (client only)
 * Public signup is restricted to 'client' role only
 */
export const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

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

    // Get the 'client' role
    const clientRole = await prisma.role.findUnique({
      where: { name: 'client' },
    });

    if (!clientRole) {
      return res.status(500).json({
        success: false,
        message: 'System error: client role not found',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with client role
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: clientRole.id,
        isActive: true,
        emailVerified: false, // Can implement email verification later
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user with email and password
 * Returns JWT token with user info
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with role and permissions
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        tenant: true,
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Extract permissions
    const permissions = user.role.permissions.map(rp => ({
      name: rp.permission.name,
      resource: rp.permission.resource,
      action: rp.permission.action,
    }));

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
        roleName: user.role.name,
        tenantId: user.tenantId,
        permissions: permissions.map(p => p.name),
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove sensitive data from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          ...userWithoutPassword,
          permissions,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * Requires authentication
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        tenant: true,
      },
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
        role: true,
        tenant: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Extract permissions
    const permissions = user.role.permissions.map(rp => ({
      name: rp.permission.name,
      resource: rp.permission.resource,
      action: rp.permission.action,
    }));

    res.json({
      success: true,
      data: {
        ...user,
        permissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify JWT token
 * Used to validate tokens on subsequent requests
 */
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        isActive: true,
        roleId: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    res.json({
      success: true,
      data: decoded,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
    next(error);
  }
};

/**
 * Change user password
 * Requires authentication
 */
export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email and set password for new user
 * Used when admin creates a user account
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required',
      });
    }

    // Find user by verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
      include: { role: true },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Check if token is expired (48 hours)
    if (new Date() > user.verificationTokenExp) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired. Please contact admin for a new invitation.',
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain uppercase, lowercase, and number',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user: set password, mark email as verified, activate account, clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        emailVerified: true,
        isActive: true,
        verificationToken: null,
        verificationTokenExp: null,
      },
    });

    res.json({
      success: true,
      message: 'Email verified successfully. You can now login with your credentials.',
    });
  } catch (error) {
    next(error);
  }
};
