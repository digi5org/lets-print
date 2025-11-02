import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample products
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

  console.log('Creating products...');
  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: product,
      create: product,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📦 Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
