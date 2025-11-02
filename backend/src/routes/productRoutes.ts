import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

router.get('/', authenticate, getProducts);
router.get('/:id', authenticate, getProduct);
router.post('/', authenticate, authorize(UserRole.STARTUP_OWNER, UserRole.PRODUCTION_OWNER, UserRole.SUPER_ADMIN), createProduct);
router.put('/:id', authenticate, authorize(UserRole.STARTUP_OWNER, UserRole.PRODUCTION_OWNER, UserRole.SUPER_ADMIN), updateProduct);
router.delete('/:id', authenticate, authorize(UserRole.STARTUP_OWNER, UserRole.PRODUCTION_OWNER, UserRole.SUPER_ADMIN), deleteProduct);

export default router;
