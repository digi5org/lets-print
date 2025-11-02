import User, { UserRole } from '../models/User';
import Product from '../models/Product';
import { Order, OrderItem } from '../models/Order';
import { OrderStatus } from '../models/Order';

export const seedDemoData = async () => {
  try {
    console.log('Seeding demo data...');

    // Create demo users
    const superAdmin = await User.findOrCreate({
      where: { email: 'admin@letsprint.com' },
      defaults: {
        email: 'admin@letsprint.com',
        password: 'admin123',
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.SUPER_ADMIN,
        isActive: true
      }
    });

    const startupOwner = await User.findOrCreate({
      where: { email: 'startup@letsprint.com' },
      defaults: {
        email: 'startup@letsprint.com',
        password: 'startup123',
        firstName: 'John',
        lastName: 'Startup',
        role: UserRole.STARTUP_OWNER,
        companyName: 'Print Startup Co.',
        phone: '+1234567890',
        isActive: true
      }
    });

    const productionOwner = await User.findOrCreate({
      where: { email: 'production@letsprint.com' },
      defaults: {
        email: 'production@letsprint.com',
        password: 'production123',
        firstName: 'Jane',
        lastName: 'Production',
        role: UserRole.PRODUCTION_OWNER,
        companyName: 'Print Factory Inc.',
        phone: '+1234567891',
        isActive: true
      }
    });

    const client = await User.findOrCreate({
      where: { email: 'client@example.com' },
      defaults: {
        email: 'client@example.com',
        password: 'client123',
        firstName: 'Mike',
        lastName: 'Client',
        role: UserRole.CLIENT,
        companyName: 'Client Business LLC',
        phone: '+1234567892',
        isActive: true
      }
    });

    // Create demo products
    const products = [
      {
        name: 'Business Cards',
        description: 'Professional business cards, 3.5" x 2"',
        category: 'Cards',
        price: 50.00,
        unit: 'per 100',
        ownerId: startupOwner[0].id
      },
      {
        name: 'Flyers A4',
        description: 'Full color flyers, A4 size',
        category: 'Marketing',
        price: 100.00,
        unit: 'per 100',
        ownerId: startupOwner[0].id
      },
      {
        name: 'Posters A2',
        description: 'Large format posters',
        category: 'Marketing',
        price: 200.00,
        unit: 'per 10',
        ownerId: productionOwner[0].id
      },
      {
        name: 'Brochures',
        description: 'Tri-fold brochures',
        category: 'Marketing',
        price: 150.00,
        unit: 'per 100',
        ownerId: startupOwner[0].id
      }
    ];

    const createdProducts = [];
    for (const productData of products) {
      const [product] = await Product.findOrCreate({
        where: { name: productData.name, ownerId: productData.ownerId },
        defaults: { ...productData, isActive: true }
      });
      createdProducts.push(product);
    }

    // Create demo orders
    if (createdProducts.length >= 2) {
      const order1 = await Order.findOrCreate({
        where: { clientId: client[0].id, startupOwnerId: startupOwner[0].id },
        defaults: {
          clientId: client[0].id,
          startupOwnerId: startupOwner[0].id,
          productionOwnerId: productionOwner[0].id,
          status: OrderStatus.IN_PRODUCTION,
          totalAmount: 250.00,
          notes: 'Rush order - needed by end of week'
        }
      });

      if (order1[1]) {
        await OrderItem.create({
          orderId: order1[0].id,
          productId: createdProducts[0].id,
          quantity: 2,
          unitPrice: 50.00,
          subtotal: 100.00
        });

        await OrderItem.create({
          orderId: order1[0].id,
          productId: createdProducts[1].id,
          quantity: 1,
          unitPrice: 100.00,
          subtotal: 100.00
        });
      }
    }

    console.log('✓ Demo data seeded successfully');
    console.log('\nDemo Login Credentials:');
    console.log('------------------------');
    console.log('Super Admin: admin@letsprint.com / admin123');
    console.log('Startup Owner: startup@letsprint.com / startup123');
    console.log('Production Owner: production@letsprint.com / production123');
    console.log('Client: client@example.com / client123');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
};
