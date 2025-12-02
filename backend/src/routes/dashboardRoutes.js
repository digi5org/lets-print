import express from 'express';
import {
  getProductionStats,
  getRecentJobs,
  getRevenueChart,
  getActiveJob,
} from '../controllers/dashboardController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

// Production owner dashboard routes
router.get(
  '/production/stats',
  requireRole(['production_owner', 'production_manager']),
  getProductionStats
);

router.get(
  '/production/recent-jobs',
  requireRole(['production_owner', 'production_manager', 'production_staff']),
  getRecentJobs
);

router.get(
  '/production/revenue-chart',
  requireRole(['production_owner', 'production_manager']),
  getRevenueChart
);

router.get(
  '/production/active-job',
  requireRole(['production_owner', 'production_manager', 'production_staff']),
  getActiveJob
);

export default router;
