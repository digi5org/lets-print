import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticate, getCurrentUser, requireAdmin } from '../middleware/auth.js';
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

// Admin only routes
router.post(
  '/',
  authenticate,
  getCurrentUser,
  requireAdmin,
  createProductValidation,
  validate,
  createProduct
);

router.put(
  '/:id',
  authenticate,
  getCurrentUser,
  requireAdmin,
  updateProductValidation,
  validate,
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  getCurrentUser,
  requireAdmin,
  idParamValidation,
  validate,
  deleteProduct
);

export default router;
