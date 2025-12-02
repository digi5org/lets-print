import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Step 1: Create Roles
  console.log('\n📋 Creating roles...');

  const roles = [
    {
      name: 'super_admin',
      description: 'SaaS platform owner with full access to all features and data',
    },
    {
      name: 'business_owner',
      description: 'Business owner who manages their own products, orders, and clients',
    },
    {
      name: 'production_owner',
      description: 'Production facility owner who fulfills print orders',
    },
    {
      name: 'client',
      description: 'End customer who places print orders',
    },
  ];

  const createdRoles = {};
  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: roleData,
      create: roleData,
    });
    createdRoles[roleData.name] = role;
    console.log(`  ✓ ${roleData.name}`);
  }

  // Step 2: Create Permissions
  console.log('\n🔐 Creating permissions...');

  const permissions = [
    // User management permissions
    { name: 'create_user', description: 'Create new users', resource: 'users', action: 'create' },
    { name: 'read_user', description: 'View user details', resource: 'users', action: 'read' },
    { name: 'update_user', description: 'Update user information', resource: 'users', action: 'update' },
    { name: 'delete_user', description: 'Delete users', resource: 'users', action: 'delete' },
    { name: 'manage_roles', description: 'Manage user roles', resource: 'users', action: 'manage_roles' },

    // Product management permissions
    { name: 'create_product', description: 'Create new products', resource: 'products', action: 'create' },
    { name: 'read_product', description: 'View products', resource: 'products', action: 'read' },
    { name: 'update_product', description: 'Update products', resource: 'products', action: 'update' },
    { name: 'delete_product', description: 'Delete products', resource: 'products', action: 'delete' },

    // Order management permissions
    { name: 'create_order', description: 'Create new orders', resource: 'orders', action: 'create' },
    { name: 'read_order', description: 'View orders', resource: 'orders', action: 'read' },
    { name: 'update_order', description: 'Update order status', resource: 'orders', action: 'update' },
    { name: 'delete_order', description: 'Cancel orders', resource: 'orders', action: 'delete' },
    { name: 'manage_all_orders', description: 'Manage all orders across tenants', resource: 'orders', action: 'manage_all' },

    // Design management permissions
    { name: 'create_design', description: 'Upload designs', resource: 'designs', action: 'create' },
    { name: 'read_design', description: 'View designs', resource: 'designs', action: 'read' },
    { name: 'update_design', description: 'Update designs', resource: 'designs', action: 'update' },
    { name: 'delete_design', description: 'Delete designs', resource: 'designs', action: 'delete' },

    // Tenant management permissions
    { name: 'create_tenant', description: 'Create new tenants', resource: 'tenants', action: 'create' },
    { name: 'read_tenant', description: 'View tenant information', resource: 'tenants', action: 'read' },
    { name: 'update_tenant', description: 'Update tenant settings', resource: 'tenants', action: 'update' },
    { name: 'delete_tenant', description: 'Delete tenants', resource: 'tenants', action: 'delete' },

    // System permissions
    { name: 'view_analytics', description: 'View analytics and reports', resource: 'system', action: 'view_analytics' },
    { name: 'manage_settings', description: 'Manage system settings', resource: 'system', action: 'manage_settings' },
  ];

  const createdPermissions = {};
  for (const permData of permissions) {
    const permission = await prisma.permission.upsert({
      where: { name: permData.name },
      update: permData,
      create: permData,
    });
    createdPermissions[permData.name] = permission;
    console.log(`  ✓ ${permData.name}`);
  }

  // Step 3: Assign Permissions to Roles
  console.log('\n🔗 Assigning permissions to roles...');

  const rolePermissions = {
    super_admin: [
      // Super admin has ALL permissions
      ...Object.keys(createdPermissions),
    ],
    business_owner: [
      // Business owner can manage their own business
      'read_user', 'create_user', 'update_user', // Can manage clients in their tenant
      'create_product', 'read_product', 'update_product', 'delete_product',
      'create_order', 'read_order', 'update_order',
      'read_design', 'create_design', 'update_design', 'delete_design',
      'read_tenant', 'update_tenant',
      'view_analytics',
    ],
    production_owner: [
      // Production owner manages orders, products, and production
      'create_product', 'read_product', 'update_product', 'delete_product', // Full product management
      'read_order', 'update_order', // Can update order status for production
      'read_design',
      'view_analytics',
    ],
    client: [
      // Clients can only manage their own orders and designs
      'create_order', 'read_order', // Own orders only
      'create_design', 'read_design', 'update_design', 'delete_design', // Own designs only
      'read_product', // Can view products
    ],
  };

  for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
    const role = createdRoles[roleName];
    console.log(`\n  Assigning permissions to ${roleName}:`);

    for (const permName of permissionNames) {
      const permission = createdPermissions[permName];
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
        console.log(`    ✓ ${permName}`);
      }
    }
  }

  // Step 4: Create Initial Super Admin User
  console.log('\n👤 Creating initial super admin user...');

  const hashedPassword = await bcrypt.hash('SuperAdmin@123', 10);

  const superAdminUser = await prisma.user.upsert({
    where: { email: 'admin@letsprint.com' },
    update: {},
    create: {
      email: 'admin@letsprint.com',
      password: hashedPassword,
      name: 'Super Administrator',
      roleId: createdRoles.super_admin.id,
      isActive: true,
      emailVerified: true,
    },
  });

  console.log(`  ✓ Super Admin created: ${superAdminUser.email}`);
  console.log(`  ✓ Default password: SuperAdmin@123`);
  console.log(`  ⚠️  IMPORTANT: Change this password immediately after first login!`);

  // Step 5: Create Sample Products
  console.log('\n📦 Creating sample products...');

  const products = [
    {
      name: 'Business Cards (100 pcs)',
      description: 'High-quality business cards with your custom design. Premium cardstock, full color printing.',
      category: 'Business',
      price: 29.99,
      imageUrl: 'https://via.placeholder.com/400x300?text=Business+Cards',
      isActive: true,
    },
    {
      name: 'Flyers (50 pcs)',
      description: 'Eye-catching flyers for your marketing needs. A4 size, glossy finish.',
      category: 'Marketing',
      price: 39.99,
      imageUrl: 'https://via.placeholder.com/400x300?text=Flyers',
      isActive: true,
    },
    {
      name: 'Posters (A3)',
      description: 'Large format posters perfect for events and promotions.',
      category: 'Marketing',
      price: 19.99,
      imageUrl: 'https://via.placeholder.com/400x300?text=Posters',
      isActive: true,
    },
    {
      name: 'Brochures (25 pcs)',
      description: 'Professional tri-fold brochures. Full color, high-quality paper.',
      category: 'Business',
      price: 49.99,
      imageUrl: 'https://via.placeholder.com/400x300?text=Brochures',
      isActive: true,
    },
    {
      name: 'Custom T-Shirt',
      description: 'High-quality cotton t-shirt with your custom design printed.',
      category: 'Apparel',
      price: 24.99,
      imageUrl: 'https://via.placeholder.com/400x300?text=T-Shirt',
      isActive: true,
    },
    {
      name: 'Banners (3x6 ft)',
      description: 'Durable vinyl banners for indoor or outdoor use.',
      category: 'Marketing',
      price: 79.99,
      imageUrl: 'https://via.placeholder.com/400x300?text=Banner',
      isActive: true,
    },
    {
      name: 'Stickers (100 pcs)',
      description: 'Custom die-cut stickers. Waterproof and weather-resistant.',
      category: 'Promotional',
      price: 34.99,
      imageUrl: 'https://via.placeholder.com/400x300?text=Stickers',
      isActive: true,
    },
    {
      name: 'Letterhead (100 sheets)',
      description: 'Professional letterhead for your business correspondence.',
      category: 'Business',
      price: 44.99,
      imageUrl: 'https://via.placeholder.com/400x300?text=Letterhead',
      isActive: true,
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (!existing) {
      await prisma.product.create({
        data: product,
      });
      console.log(`  ✓ ${product.name}`);
    } else {
      console.log(`  - ${product.name} (already exists)`);
    }
  }

  console.log('\n✅ Database seeded successfully!');
  console.log(`\n� Summary:`);
  console.log(`  • ${roles.length} Roles created`);
  console.log(`  • ${permissions.length} Permissions created`);
  console.log(`  • 1 Super Admin user created`);
  console.log(`  • ${products.length} Products created`);
  console.log(`\n🔐 Login Credentials:`);
  console.log(`  Email: admin@letsprint.com`);
  console.log(`  Password: SuperAdmin@123`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
