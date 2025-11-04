import express from 'express';
import {
  getAllDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
} from '../controllers/designController.js';
import { authenticate, requirePermission } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createDesignValidation,
  updateDesignValidation,
  idParamValidation,
} from '../validators/validators.js';

const router = express.Router();

// All design routes require authentication
router.use(authenticate);

router.get('/', getAllDesigns);
router.get('/:id', idParamValidation, validate, getDesignById);
router.post('/', requirePermission('designs:create'), createDesignValidation, validate, createDesign);
router.put('/:id', requirePermission('designs:update'), updateDesignValidation, validate, updateDesign);
router.delete('/:id', requirePermission('designs:delete'), idParamValidation, validate, deleteDesign);

export default router;
