import express from 'express';
import {
  getAllProducts,
  getTenantProducts,
  getClientProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleTenantProduct,
  getCategories
} from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

// Public/Client routes
router.get('/client/:tenantId', getClientProducts);

// Authenticated routes
router.use(authenticate);

// Get all categories
router.get('/categories', getCategories);

// SuperAdmin and Production Owner routes
router.get(
  '/',
  authorize(['super_admin', 'production_owner']),
  getAllProducts
);

router.post(
  '/',
  authorize(['super_admin', 'production_owner']),
  createProduct
);

router.put(
  '/:id',
  authorize(['super_admin', 'production_owner']),
  updateProduct
);

router.delete(
  '/:id',
  authorize(['super_admin']),
  deleteProduct
);

// Business Owner routes
router.get(
  '/tenant/:tenantId',
  authorize(['super_admin', 'business_owner']),
  getTenantProducts
);

router.post(
  '/tenant/:tenantId/product/:productId/toggle',
  authorize(['super_admin', 'business_owner']),
  toggleTenantProduct
);

export default router;
