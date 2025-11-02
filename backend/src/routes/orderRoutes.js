import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { authenticate, getCurrentUser, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createOrderValidation,
  updateOrderStatusValidation,
  idParamValidation,
} from '../validators/validators.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticate, getCurrentUser);

// User and Admin routes
router.get('/', getAllOrders);
router.get('/:id', idParamValidation, validate, getOrderById);
router.post('/', createOrderValidation, validate, createOrder);
router.post('/:id/cancel', idParamValidation, validate, cancelOrder);

// Admin only routes
router.patch(
  '/:id/status',
  requireAdmin,
  updateOrderStatusValidation,
  validate,
  updateOrderStatus
);

export default router;
