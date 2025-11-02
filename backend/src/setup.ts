import sequelize from './config/database';
import { seedDemoData } from './utils/seedData';

const setupDatabase = async () => {
  try {
    console.log('Setting up database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Sync models (create tables)
    await sequelize.sync({ force: true }); // WARNING: This drops all tables
    console.log('✓ Database tables created');

    // Seed demo data
    await seedDemoData();

    console.log('\n✓ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();
