/**
 * Seed Activity Logs
 * Creates sample activity logs for testing
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedActivities() {
  console.log('🌱 Seeding activity logs...');

  try {
    // Get super admin user
    const superAdmin = await prisma.user.findFirst({
      where: { email: 'admin@letsprint.com' },
    });

    if (!superAdmin) {
      console.log('⚠️ Super admin not found. Run main seed first.');
      return;
    }

    // Get a tenant if exists
    const tenant = await prisma.tenant.findFirst();

    // Create sample activities
    const activities = [
      {
        action: 'user_login',
        userId: superAdmin.id,
        entityType: 'user',
        entityId: superAdmin.id,
        entityName: superAdmin.name,
        metadata: { role: 'super_admin' },
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
      {
        action: 'system_backup',
        userId: superAdmin.id,
        entityType: 'system',
        entityName: 'System',
        metadata: { status: 'completed', size: '2.3 GB' },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    ];

    if (tenant) {
      activities.push({
        action: 'business_created',
        userId: superAdmin.id,
        entityType: 'business',
        entityId: tenant.id,
        entityName: tenant.name,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      });
    }

    // Create activities
    for (const activity of activities) {
      await prisma.activityLog.create({ data: activity });
      console.log(`  ✓ ${activity.action}`);
    }

    console.log('✅ Activity logs seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding activities:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedActivities();
