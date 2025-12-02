import express from 'express';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  addMaintenanceLog,
  getEquipmentStats,
} from '../controllers/equipmentController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Stats route
router.get(
  '/stats',
  requireRole(['production_owner', 'production_manager']),
  getEquipmentStats
);

// CRUD routes
router.get(
  '/',
  requireRole(['production_owner', 'production_manager', 'production_staff']),
  getAllEquipment
);

router.get(
  '/:id',
  requireRole(['production_owner', 'production_manager', 'production_staff']),
  getEquipmentById
);

router.post(
  '/',
  requireRole(['production_owner', 'production_manager']),
  createEquipment
);

router.put(
  '/:id',
  requireRole(['production_owner', 'production_manager']),
  updateEquipment
);

router.delete(
  '/:id',
  requireRole(['production_owner', 'production_manager']),
  deleteEquipment
);

// Maintenance log
router.post(
  '/:id/maintenance',
  requireRole(['production_owner', 'production_manager', 'production_staff']),
  addMaintenanceLog
);

export default router;
