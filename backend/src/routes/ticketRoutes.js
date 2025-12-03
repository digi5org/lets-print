import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  getTicketStats,
  updateTicketStatus,
} from "../controllers/ticketController.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all tickets (all production roles and super_admin can view)
router.get(
  "/",
  requireRole(["super_admin", "production_owner", "production_manager", "production_staff"]),
  getAllTickets
);

// Get ticket statistics
router.get(
  "/stats",
  requireRole(["super_admin", "production_owner", "production_manager"]),
  getTicketStats
);

// Get single ticket
router.get(
  "/:id",
  requireRole(["super_admin", "production_owner", "production_manager", "production_staff"]),
  getTicketById
);

// Create new ticket (all production roles and super_admin)
router.post(
  "/",
  requireRole(["super_admin", "production_owner", "production_manager", "production_staff"]),
  createTicket
);

// Update ticket (owner, manager, and super_admin)
router.put(
  "/:id",
  requireRole(["super_admin", "production_owner", "production_manager"]),
  updateTicket
);

// Update ticket status (all production roles and super_admin)
router.patch(
  "/:id/status",
  requireRole(["super_admin", "production_owner", "production_manager", "production_staff"]),
  updateTicketStatus
);

// Add comment to ticket (all production roles and super_admin)
router.post(
  "/:id/comments",
  requireRole(["super_admin", "production_owner", "production_manager", "production_staff"]),
  addComment
);

// Delete ticket (owner and super_admin)
router.delete(
  "/:id",
  requireRole(["super_admin", "production_owner"]),
  deleteTicket
);

export default router;
