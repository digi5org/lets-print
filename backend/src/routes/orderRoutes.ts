import express from 'express';
import { getOrders, getOrder, createOrder, updateOrderStatus } from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrder);
router.post('/', authenticate, createOrder);
router.patch('/:id/status', authenticate, authorize(UserRole.STARTUP_OWNER, UserRole.PRODUCTION_OWNER, UserRole.SUPER_ADMIN), updateOrderStatus);

export default router;
