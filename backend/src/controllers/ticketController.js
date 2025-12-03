import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Generate unique ticket number
const generateTicketNumber = async () => {
  const count = await prisma.ticket.count();
  return `TKT-${String(count + 1).padStart(3, "0")}`;
};

// Get all tickets with filters
export const getAllTickets = async (req, res) => {
  try {
    const { status, priority, category, assignedTo, search } = req.query;
    const { tenantId, roleName } = req.user;
    const isSuperAdmin = roleName === 'super_admin';

    const where = {};
    
    // Super admin can see all tickets, others only see their tenant's tickets
    if (!isSuperAdmin && tenantId) {
      where.tenantId = tenantId;
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (assignedTo) where.assignedTo = assignedTo;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { ticketNumber: { contains: search } },
        { customerName: { contains: search } },
      ];
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

// Get single ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, roleName } = req.user;
    const isSuperAdmin = roleName === 'super_admin';

    const where = { id };
    if (!isSuperAdmin && tenantId) {
      where.tenantId = tenantId;
    }

    const ticket = await prisma.ticket.findFirst({
      where,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

// Create new ticket
export const createTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      category,
      customerName,
      assignedTo,
    } = req.body;
    const { userId, tenantId } = req.user;

    if (!title || !category) {
      return res
        .status(400)
        .json({ message: "Title and category are required" });
    }

    const ticketNumber = await generateTicketNumber();

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        title,
        description,
        priority: priority || "Medium",
        status: "Open",
        category,
        customerName,
        assignedTo: assignedTo || null,
        tenantId,
        createdBy: userId,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: "ticket_created",
        entityType: "ticket",
        entityId: ticket.id,
        entityName: ticket.ticketNumber,
        metadata: {
          title: ticket.title,
          priority: ticket.priority,
          category: ticket.category,
        },
      },
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

// Update ticket
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, userId } = req.user;
    const updateData = req.body;

    // Check if ticket exists and belongs to tenant
    const existingTicket = await prisma.ticket.findFirst({
      where: { id, tenantId },
    });

    if (!existingTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Handle status changes
    if (updateData.status) {
      if (updateData.status === "Resolved" && !existingTicket.resolvedAt) {
        updateData.resolvedAt = new Date();
      }
      if (updateData.status === "Closed" && !existingTicket.closedAt) {
        updateData.closedAt = new Date();
      }
    }

    // Handle assignedTo - set to null if empty string
    if (updateData.assignedTo === "") {
      updateData.assignedTo = null;
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: "ticket_updated",
        entityType: "ticket",
        entityId: ticket.id,
        entityName: ticket.ticketNumber,
        metadata: updateData,
      },
    });

    res.json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, userId } = req.user;

    const ticket = await prisma.ticket.findFirst({
      where: { id, tenantId },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await prisma.ticket.delete({ where: { id } });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: "ticket_deleted",
        entityType: "ticket",
        entityId: id,
        entityName: ticket.ticketNumber,
        metadata: {
          title: ticket.title,
        },
      },
    });

    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};

// Add comment to ticket
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, isInternal } = req.body;
    const { tenantId, userId } = req.user;

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    // Check if ticket exists and belongs to tenant
    const ticket = await prisma.ticket.findFirst({
      where: { id, tenantId },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const ticketComment = await prisma.ticketComment.create({
      data: {
        ticketId: id,
        userId,
        comment,
        isInternal: isInternal || false,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: "ticket_comment_added",
        entityType: "ticket",
        entityId: id,
        entityName: ticket.ticketNumber,
        metadata: {
          commentId: ticketComment.id,
          isInternal,
        },
      },
    });

    res.status(201).json(ticketComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Get ticket statistics
export const getTicketStats = async (req, res) => {
  try {
    const { tenantId, roleName } = req.user;
    const isSuperAdmin = roleName === 'super_admin';

    const where = {};
    if (!isSuperAdmin && tenantId) {
      where.tenantId = tenantId;
    }

    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      highPriorityTickets,
      resolvedToday,
    ] = await Promise.all([
      prisma.ticket.count({ where }),
      prisma.ticket.count({ where: { ...where, status: "Open" } }),
      prisma.ticket.count({ where: { ...where, status: "In Progress" } }),
      prisma.ticket.count({ where: { ...where, status: "Resolved" } }),
      prisma.ticket.count({ where: { ...where, status: "Closed" } }),
      prisma.ticket.count({
        where: { ...where, priority: "High", status: { not: "Closed" } },
      }),
      prisma.ticket.count({
        where: {
          ...where,
          status: "Resolved",
          resolvedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    // Calculate average response time (simplified)
    const tickets = await prisma.ticket.findMany({
      where: {
        ...where,
        resolvedAt: { not: null },
      },
      select: {
        createdAt: true,
        resolvedAt: true,
      },
      take: 100,
      orderBy: { resolvedAt: "desc" },
    });

    let avgResponseTime = "N/A";
    if (tickets.length > 0) {
      const totalMinutes = tickets.reduce((sum, ticket) => {
        const diff = ticket.resolvedAt - ticket.createdAt;
        return sum + diff / (1000 * 60); // Convert to minutes
      }, 0);
      const avgMinutes = totalMinutes / tickets.length;
      const hours = Math.floor(avgMinutes / 60);
      const minutes = Math.round(avgMinutes % 60);
      avgResponseTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }

    // Get category breakdown
    const categoryBreakdown = await prisma.ticket.groupBy({
      by: ["category"],
      where: { tenantId },
      _count: { category: true },
    });

    res.json({
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      highPriorityTickets,
      resolvedToday,
      avgResponseTime,
      categoryBreakdown: categoryBreakdown.map((item) => ({
        category: item.category,
        count: item._count.category,
      })),
    });
  } catch (error) {
    console.error("Error fetching ticket stats:", error);
    res.status(500).json({ message: "Failed to fetch ticket statistics" });
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { tenantId, userId } = req.user;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const ticket = await prisma.ticket.findFirst({
      where: { id, tenantId },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const updateData = { status };

    if (status === "Resolved" && !ticket.resolvedAt) {
      updateData.resolvedAt = new Date();
    }
    if (status === "Closed" && !ticket.closedAt) {
      updateData.closedAt = new Date();
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: "ticket_status_updated",
        entityType: "ticket",
        entityId: id,
        entityName: ticket.ticketNumber,
        metadata: {
          oldStatus: ticket.status,
          newStatus: status,
        },
      },
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Failed to update ticket status" });
  }
};
