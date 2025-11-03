import express from 'express';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
} from '../controllers/userController.js';
import { authenticate, requirePermission, requireSuperAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  updateProfileValidation,
  updateUserRoleValidation,
  idParamValidation,
} from '../validators/validators.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Current user routes
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, validate, updateProfile);

// Admin only routes
router.get('/', requirePermission('users:read'), getAllUsers);
router.get('/:id', requirePermission('users:read'), idParamValidation, validate, getUserById);
router.patch('/:id/role', requireSuperAdmin, updateUserRoleValidation, validate, updateUserRole);

export default router;
