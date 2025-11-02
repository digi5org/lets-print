import express from 'express';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
} from '../controllers/userController.js';
import { authenticate, getCurrentUser, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  updateProfileValidation,
  updateUserRoleValidation,
  idParamValidation,
} from '../validators/validators.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate, getCurrentUser);

// Current user routes
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, validate, updateProfile);

// Admin only routes
router.get('/', requireAdmin, getAllUsers);
router.get('/:id', requireAdmin, idParamValidation, validate, getUserById);
router.patch('/:id/role', requireAdmin, updateUserRoleValidation, validate, updateUserRole);

export default router;
