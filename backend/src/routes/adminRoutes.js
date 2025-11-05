import express from 'express';
import { body, param } from 'express-validator';
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  resetUserPassword,
  getRoles,
  createTenant,
  getAllTenants,
  updateTenant,
} from '../controllers/adminController.js';
import { authenticate, requireSuperAdmin, requirePermission } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// All admin routes require authentication and super_admin role
router.use(authenticate);
router.use(requireSuperAdmin);

/**
 * User Management Routes
 */

/**
 * @route   POST /api/admin/users
 * @desc    Create a new user (business_owner, production_owner)
 * @access  Super Admin only
 */
router.post(
  '/users',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .trim(),
    body('roleName')
      .isIn(['business_owner', 'production_owner', 'client'])
      .withMessage('Invalid role. Allowed: business_owner, production_owner, client'),
    body('tenantId')
      .optional()
      .isUUID()
      .withMessage('Invalid tenant ID'),
  ],
  validate,
  createUser
);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with optional filtering
 * @access  Super Admin only
 */
router.get('/users', getAllUsers);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user details
 * @access  Super Admin only
 */
router.put(
  '/users/:id',
  [
    param('id').isUUID().withMessage('Invalid user ID'),
    body('name').optional().trim(),
    body('roleName')
      .optional()
      .isIn(['super_admin', 'business_owner', 'production_owner', 'client'])
      .withMessage('Invalid role'),
    body('tenantId')
      .optional(),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
  ],
  validate,
  updateUser
);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Super Admin only
 */
router.delete(
  '/users/:id',
  [param('id').isUUID().withMessage('Invalid user ID')],
  validate,
  deleteUser
);

/**
 * @route   POST /api/admin/users/:id/reset-password
 * @desc    Reset user password
 * @access  Super Admin only
 */
router.post(
  '/users/:id/reset-password',
  [
    param('id').isUUID().withMessage('Invalid user ID'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  validate,
  resetUserPassword
);

/**
 * Role Management Routes
 */

/**
 * @route   GET /api/admin/roles
 * @desc    Get all roles and their permissions
 * @access  Super Admin only
 */
router.get('/roles', getRoles);

/**
 * Tenant Management Routes
 */

/**
 * @route   POST /api/admin/tenants
 * @desc    Create a new tenant
 * @access  Super Admin only
 */
router.post(
  '/tenants',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Tenant name is required'),
    body('slug')
      .trim()
      .notEmpty()
      .withMessage('Tenant slug is required')
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
    body('domain')
      .optional()
      .trim(),
  ],
  validate,
  createTenant
);

/**
 * @route   GET /api/admin/tenants
 * @desc    Get all tenants
 * @access  Super Admin only
 */
router.get('/tenants', getAllTenants);

/**
 * @route   PUT /api/admin/tenants/:id
 * @desc    Update tenant details
 * @access  Super Admin only
 */
router.put(
  '/tenants/:id',
  [
    param('id').isUUID().withMessage('Invalid tenant ID'),
    body('name').optional().trim(),
    body('slug')
      .optional()
      .trim()
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
    body('domain').optional().trim(),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
  ],
  validate,
  updateTenant
);

export default router;
