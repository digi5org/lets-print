import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
    try {
        console.log('🔄 Starting manual migration...');

        // Step 1: Check if tenant_products table exists
        console.log('📋 Checking existing schema...');

        // Step 2: Create tenant_products table
        console.log('📦 Creating tenant_products table...');
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`tenant_products\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`tenantId\` VARCHAR(191) NOT NULL,
        \`productId\` VARCHAR(191) NOT NULL,
        \`isActive\` BOOLEAN NOT NULL DEFAULT true,
        \`customPrice\` DOUBLE NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`tenant_products_tenantId_productId_key\`(\`tenantId\`, \`productId\`),
        INDEX \`tenant_products_tenantId_idx\`(\`tenantId\`),
        INDEX \`tenant_products_productId_idx\`(\`productId\`),
        INDEX \`tenant_products_isActive_idx\`(\`isActive\`),
        CONSTRAINT \`tenant_products_tenantId_fkey\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenants\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`tenant_products_productId_fkey\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
        console.log('✅ tenant_products table created');

        // Step 3: Migrate existing products with tenantId to tenant_products
        console.log('🔄 Migrating existing tenant-specific products...');
        const existingProducts = await prisma.$queryRawUnsafe(`
      SELECT id, tenantId FROM products WHERE tenantId IS NOT NULL
    `);

        if (existingProducts && existingProducts.length > 0) {
            console.log(`Found ${existingProducts.length} products to migrate`);
            for (const product of existingProducts) {
                await prisma.$executeRawUnsafe(`
          INSERT INTO tenant_products (id, tenantId, productId, isActive, createdAt, updatedAt)
          VALUES (UUID(), ?, ?, true, NOW(), NOW())
          ON DUPLICATE KEY UPDATE updatedAt = NOW()
        `, product.tenantId, product.id);
            }
            console.log('✅ Products migrated to tenant_products');
        } else {
            console.log('ℹ️  No existing tenant-specific products to migrate');
        }

        // Step 4: Add new columns to products table
        console.log('📝 Adding new columns to products table...');

        try {
            await prisma.$executeRawUnsafe(`
        ALTER TABLE \`products\` 
        ADD COLUMN IF NOT EXISTS \`specifications\` JSON NULL
      `);
        } catch (e) {
            if (!e.message.includes('Duplicate column')) {
                console.log('ℹ️  specifications column may already exist');
            }
        }

        try {
            await prisma.$executeRawUnsafe(`
        ALTER TABLE \`products\` 
        ADD COLUMN IF NOT EXISTS \`createdBy\` VARCHAR(191) NULL
      `);
        } catch (e) {
            if (!e.message.includes('Duplicate column')) {
                console.log('ℹ️  createdBy column may already exist');
            }
        }

        console.log('✅ New columns added');

        // Step 5: Remove tenantId column and foreign key
        console.log('🗑️  Removing old tenantId column...');
        try {
            // First drop the foreign key
            await prisma.$executeRawUnsafe(`
        ALTER TABLE \`products\` DROP FOREIGN KEY IF EXISTS \`products_tenantId_fkey\`
      `);
        } catch (e) {
            console.log('ℹ️  Foreign key may not exist');
        }

        try {
            // Then drop the column
            await prisma.$executeRawUnsafe(`
        ALTER TABLE \`products\` DROP COLUMN IF EXISTS \`tenantId\`
      `);
        } catch (e) {
            console.log('ℹ️  tenantId column may not exist');
        }

        console.log('✅ Old tenantId column removed');

        // Step 6: Create indexes
        console.log('📇 Creating indexes...');
        try {
            await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS \`products_category_idx\` ON \`products\`(\`category\`)
      `);
            await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS \`products_isActive_idx\` ON \`products\`(\`isActive\`)
      `);
        } catch (e) {
            console.log('ℹ️  Indexes may already exist');
        }

        console.log('✅ Indexes created');

        console.log('🎉 Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

migrate()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
