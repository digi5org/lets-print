import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import * as productionController from '../controllers/productionController.js';

const router = express.Router();

// Team management routes
// All production roles can view team
router.get('/team', authenticate, requireRole('production_owner', 'production_manager', 'production_staff', 'machine_operator', 'quality_inspector', 'superadmin'), productionController.getTeamMembers);
// Only production_owner and production_manager can add/edit/delete
router.post('/team', authenticate, requireRole('production_owner', 'production_manager', 'superadmin'), productionController.addTeamMember);
router.put('/team/:id', authenticate, requireRole('production_owner', 'production_manager', 'superadmin'), productionController.updateTeamMember);
router.delete('/team/:id', authenticate, requireRole('production_owner', 'production_manager', 'superadmin'), productionController.deleteTeamMember);

export default router;

