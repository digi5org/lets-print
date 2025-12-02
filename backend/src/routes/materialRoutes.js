import express from 'express';
import {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  adjustMaterialQuantity,
  getMaterialStats,
} from '../controllers/materialController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Stats route
router.get(
  '/stats',
  requireRole(['production_owner', 'production_manager']),
  getMaterialStats
);

// CRUD routes
router.get(
  '/',
  requireRole(['production_owner', 'production_manager', 'production_staff']),
  getAllMaterials
);

router.get(
  '/:id',
  requireRole(['production_owner', 'production_manager', 'production_staff']),
  getMaterialById
);

router.post(
  '/',
  requireRole(['production_owner', 'production_manager']),
  createMaterial
);

router.put(
  '/:id',
  requireRole(['production_owner', 'production_manager']),
  updateMaterial
);

router.delete(
  '/:id',
  requireRole(['production_owner', 'production_manager']),
  deleteMaterial
);

// Inventory adjustment
router.post(
  '/:id/adjust',
  requireRole(['production_owner', 'production_manager', 'production_staff']),
  adjustMaterialQuantity
);

export default router;
