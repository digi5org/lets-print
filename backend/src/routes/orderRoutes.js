import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { authenticate, requirePermission } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createOrderValidation,
  updateOrderStatusValidation,
  idParamValidation,
} from '../validators/validators.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// User and Admin routes
router.get('/', getAllOrders);
router.get('/:id', idParamValidation, validate, getOrderById);
router.post('/', requirePermission('create_order'), createOrderValidation, validate, createOrder);
router.post('/:id/cancel', idParamValidation, validate, cancelOrder);

// Admin/Production owner routes - can update order status
router.patch(
  '/:id/status',
  requirePermission('update_order'),
  updateOrderStatusValidation,
  validate,
  updateOrderStatus
);

export default router;
