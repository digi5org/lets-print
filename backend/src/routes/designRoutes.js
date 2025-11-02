import express from 'express';
import {
  getAllDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
} from '../controllers/designController.js';
import { authenticate, getCurrentUser } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createDesignValidation,
  updateDesignValidation,
  idParamValidation,
} from '../validators/validators.js';

const router = express.Router();

// All design routes require authentication
router.use(authenticate, getCurrentUser);

router.get('/', getAllDesigns);
router.get('/:id', idParamValidation, validate, getDesignById);
router.post('/', createDesignValidation, validate, createDesign);
router.put('/:id', updateDesignValidation, validate, updateDesign);
router.delete('/:id', idParamValidation, validate, deleteDesign);

export default router;
