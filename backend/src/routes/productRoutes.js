import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticate, requirePermission, requireSuperAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createProductValidation,
  updateProductValidation,
  idParamValidation,
} from '../validators/validators.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', idParamValidation, validate, getProductById);

// Admin routes - super_admin or users with products:create permission
router.post(
  '/',
  authenticate,
  requirePermission('products:create'),
  createProductValidation,
  validate,
  createProduct
);

router.put(
  '/:id',
  authenticate,
  requirePermission('products:update'),
  updateProductValidation,
  validate,
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  requirePermission('products:delete'),
  idParamValidation,
  validate,
  deleteProduct
);

export default router;
