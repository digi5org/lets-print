import express from 'express';
import { getClients, getClient, updateClientStatus } from '../controllers/clientController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

router.get('/', authenticate, authorize(UserRole.STARTUP_OWNER, UserRole.SUPER_ADMIN), getClients);
router.get('/:id', authenticate, authorize(UserRole.STARTUP_OWNER, UserRole.SUPER_ADMIN), getClient);
router.patch('/:id/status', authenticate, authorize(UserRole.STARTUP_OWNER, UserRole.SUPER_ADMIN), updateClientStatus);

export default router;
