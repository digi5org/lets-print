/**
 * Activity Logging Service
 * Centralized service for logging user and system activities
 */

import prisma from '../config/database.js';

/**
 * Log an activity
 * @param {Object} params - Activity parameters
 * @param {string} params.action - Action performed (e.g., 'user_created', 'login')
 * @param {string} params.userId - ID of user who performed action (optional)
 * @param {string} params.entityType - Type of entity affected (e.g., 'user', 'business')
 * @param {string} params.entityId - ID of affected entity (optional)
 * @param {string} params.entityName - Name/description of affected entity (optional)
 * @param {Object} params.metadata - Additional metadata (optional)
 * @param {string} params.ipAddress - IP address (optional)
 * @param {string} params.userAgent - User agent string (optional)
 */
export async function logActivity({
  action,
  userId = null,
  entityType = null,
  entityId = null,
  entityName = null,
  metadata = null,
  ipAddress = null,
  userAgent = null,
}) {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        userId,
        entityType,
        entityId,
        entityName,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw - logging failures shouldn't break the app
  }
}

/**
 * Get recent activities
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of activities to fetch
 * @param {string} options.userId - Filter by user ID (optional)
 * @param {string} options.entityType - Filter by entity type (optional)
 * @returns {Promise<Array>} Array of activity logs
 */
export async function getRecentActivities({ limit = 50, userId = null, entityType = null } = {}) {
  const where = {};
  
  if (userId) {
    where.userId = userId;
  }
  
  if (entityType) {
    where.entityType = entityType;
  }
  
  return prisma.activityLog.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}

/**
 * Helper function to extract IP and User Agent from request
 * @param {Object} req - Express request object
 * @returns {Object} Object with ipAddress and userAgent
 */
export function getRequestInfo(req) {
  return {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
  };
}
