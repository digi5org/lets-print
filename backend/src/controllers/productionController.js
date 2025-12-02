import prisma from '../config/database.js';
import { logActivity } from '../services/activityService.js';
import bcrypt from 'bcryptjs';

// Get all team members for production owner
export const getTeamMembers = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const teamMembers = await prisma.user.findMany({
      where: {
        tenantId: tenantId,
        isActive: true, // Only fetch active members
        role: {
          name: {
            in: ['production_owner', 'production_manager', 'production_staff', 'machine_operator', 'quality_inspector']
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        role: {
          select: {
            name: true,
            description: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match frontend format
    const members = teamMembers.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: 'Production Staff',
      department: member.department || 'Not Assigned',
      status: member.isActive ? 'Active' : 'Offline',
      avatar: getAvatar(member.name),
      joinedDate: formatDate(member.createdAt),
      lastActive: member.lastLoginAt ? formatRelativeTime(member.lastLoginAt) : 'Never'
    }));

    res.json({
      success: true,
      members
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
      error: error.message
    });
  }
};

// Add new team member
export const addTeamMember = async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const { tenantId, userId } = req.user;

    // Debug logging
    console.log('📝 Add Team Member Request:', { name, email, department, userId, tenantId });

    // Validate required fields
    if (!name || !email) {
      console.log('❌ Validation failed:', { name: !!name, email: !!email });
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Get the production_staff role
    const roleRecord = await prisma.role.findFirst({
      where: { name: 'production_staff' }
    });

    console.log('🔍 Role lookup result:', { roleRecord });

    if (!roleRecord) {
      console.log('❌ production_staff role not found');
      return res.status(400).json({
        success: false,
        message: 'Production staff role not found in system'
      });
    }

    // Create new team member
    const newMember = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword('ChangeMe123!'), // Temporary password
        roleId: roleRecord.id,
        tenantId,
        department: department || null,
        isActive: true,
        emailVerified: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        isActive: true,
        createdAt: true,
        role: {
          select: {
            name: true,
            description: true
          }
        }
      }
    });

    // Log activity
    await logActivity({
      userId,
      action: 'team_member_added',
      entityType: 'User',
      entityId: newMember.id,
      entityName: newMember.name,
      metadata: { email: newMember.email, department: newMember.department },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    const member = {
      id: newMember.id,
      name: newMember.name,
      email: newMember.email,
      role: 'Production Staff',
      department: newMember.department || 'Not Assigned',
      status: 'Active',
      avatar: getAvatar(newMember.name),
      joinedDate: formatDate(newMember.createdAt),
      lastActive: 'Just now'
    };

    res.status(201).json({
      success: true,
      message: 'Team member added successfully',
      member
    });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add team member',
      error: error.message
    });
  }
};

// Update team member
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department } = req.body;
    const { tenantId, userId } = req.user;

    // Check if member exists and belongs to the same tenant
    const existingMember = await prisma.user.findFirst({
      where: {
        id,
        tenantId
      }
    });

    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Update the member
    const updatedMember = await prisma.user.update({
      where: { id },
      data: {
        name: name || existingMember.name,
        email: email || existingMember.email,
        department: department !== undefined ? department : existingMember.department
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        role: {
          select: {
            name: true,
            description: true
          }
        }
      }
    });

    // Log activity
    await logActivity({
      userId,
      action: 'team_member_updated',
      entityType: 'User',
      entityId: updatedMember.id,
      entityName: updatedMember.name,
      metadata: { changes: { name, email, department } },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    const member = {
      id: updatedMember.id,
      name: updatedMember.name,
      email: updatedMember.email,
      role: 'Production Staff',
      department: updatedMember.department || 'Not Assigned',
      status: updatedMember.isActive ? 'Active' : 'Offline',
      avatar: getAvatar(updatedMember.name),
      joinedDate: formatDate(updatedMember.createdAt),
      lastActive: updatedMember.lastLoginAt ? formatRelativeTime(updatedMember.lastLoginAt) : 'Never'
    };

    res.json({
      success: true,
      message: 'Team member updated successfully',
      member
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update team member',
      error: error.message
    });
  }
};

// Delete team member
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, userId } = req.user;

    // Check if member exists and belongs to the same tenant
    const existingMember = await prisma.user.findFirst({
      where: {
        id,
        tenantId
      }
    });

    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Prevent deleting self
    if (id === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Soft delete by deactivating the user
    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    // Log activity
    await logActivity({
      userId,
      action: 'team_member_removed',
      entityType: 'User',
      entityId: id,
      entityName: existingMember.name,
      metadata: { email: existingMember.email },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Team member removed successfully'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove team member',
      error: error.message
    });
  }
};

// Helper functions
const getAvatar = (name) => {
  const emojis = ['👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔬', '👨‍🏭', '👩‍💻'];
  const index = name ? name.charCodeAt(0) % emojis.length : 0;
  return emojis[index];
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return formatDate(date);
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
