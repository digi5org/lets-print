import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding production team roles...');

  const roles = [
    {
      name: 'production_manager',
      description: 'Production manager with access to manage orders and inventory'
    },
    {
      name: 'production_staff',
      description: 'Production staff member with limited access to assigned tasks'
    },
    {
      name: 'machine_operator',
      description: 'Machine operator who updates job status'
    },
    {
      name: 'quality_inspector',
      description: 'Quality inspector who performs quality checks'
    }
  ];

  for (const role of roles) {
    const existingRole = await prisma.role.findFirst({
      where: { name: role.name }
    });

    if (existingRole) {
      console.log(`✓ Role already exists: ${role.name}`);
    } else {
      await prisma.role.create({
        data: role
      });
      console.log(`✅ Created role: ${role.name}`);
    }
  }

  console.log('\n✅ Production roles seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding roles:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
