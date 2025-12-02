import express from 'express';
import {
  getAllDeliveries,
  getDeliveryById,
  getDeliveryByTracking,
  createDelivery,
  updateDelivery,
  updateDeliveryStatus,
  deleteDelivery,
  getDeliveryStats,
} from '../controllers/deliveryController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public tracking route (no auth required)
router.get('/track/:trackingNumber', getDeliveryByTracking);

// All other routes require authentication
router.use(authenticate);

// Stats route
router.get(
  '/stats',
  requireRole(['production_owner', 'production_manager']),
  getDeliveryStats
);

// CRUD routes
router.get(
  '/',
  requireRole(['production_owner', 'production_manager', 'production_staff']),
  getAllDeliveries
);

router.get(
  '/:id',
  requireRole(['production_owner', 'production_manager', 'production_staff']),
  getDeliveryById
);

router.post(
  '/',
  requireRole(['production_owner', 'production_manager']),
  createDelivery
);

router.put(
  '/:id',
  requireRole(['production_owner', 'production_manager']),
  updateDelivery
);

router.patch(
  '/:id/status',
  requireRole(['production_owner', 'production_manager', 'production_staff']),
  updateDeliveryStatus
);

router.delete(
  '/:id',
  requireRole(['production_owner', 'production_manager']),
  deleteDelivery
);

export default router;
