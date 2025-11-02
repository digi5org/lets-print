# Database Setup Guide

## MySQL Database Setup

### Option 1: Local MySQL Installation

1. **Install MySQL** (if not already installed)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL

2. **Create Database**
   ```sql
   CREATE DATABASE lets_print_db;
   ```

3. **Create Database User** (optional but recommended)
   ```sql
   CREATE USER 'letsprintuser'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON lets_print_db.* TO 'letsprintuser'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Update .env file**
   ```env
   DATABASE_URL="mysql://letsprintuser:your_password@localhost:3306/lets_print_db"
   ```

### Option 2: Docker MySQL (Recommended for Development)

1. **Create docker-compose.yml in backend folder**
   ```yaml
   version: '3.8'
   services:
     mysql:
       image: mysql:8.0
       container_name: letsprints-mysql
       restart: always
       environment:
         MYSQL_ROOT_PASSWORD: root_password
         MYSQL_DATABASE: lets_print_db
         MYSQL_USER: letsprintuser
         MYSQL_PASSWORD: your_password
       ports:
         - "3306:3306"
       volumes:
         - mysql_data:/var/lib/mysql

   volumes:
     mysql_data:
   ```

2. **Start Docker container**
   ```bash
   docker-compose up -d
   ```

3. **Update .env file**
   ```env
   DATABASE_URL="mysql://letsprintuser:your_password@localhost:3306/lets_print_db"
   ```

### Option 3: Cloud Database (PlanetScale, Railway, etc.)

1. Create a MySQL database on your preferred cloud provider
2. Copy the connection string
3. Update .env file with the connection string

## Running Migrations

After setting up your database:

```bash
# Run migrations to create tables
npm run migrate

# This will create all tables based on the Prisma schema
```

## Seeding the Database

To add sample products:

```bash
npm run db:seed
```

This will create:
- 8 sample products in different categories
- You can modify `src/prisma/seed.js` to add more data

## Prisma Studio (Database GUI)

To view and edit your database using Prisma Studio:

```bash
npm run db:studio
```

This will open a browser window with a GUI for your database at `http://localhost:5555`

## Common Issues

### Error: Can't reach database server

**Solution**: Make sure MySQL is running
```bash
# Windows (if installed as service)
net start MySQL80

# Or check if Docker container is running
docker ps
```

### Error: Authentication failed

**Solution**: Check your DATABASE_URL in .env file
- Verify username and password
- Ensure user has proper privileges

### Error: Database doesn't exist

**Solution**: Create the database first
```sql
CREATE DATABASE lets_print_db;
```

## Migration Commands

```bash
# Create a new migration after schema changes
npm run migrate

# Deploy migrations to production
npm run migrate:deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

## Next Steps

After database setup:

1. ✅ Database is created
2. ✅ Tables are migrated
3. ✅ Sample data is seeded
4. 🚀 Start the development server: `npm run dev`
5. 🧪 Test the API endpoints using Postman or Thunder Client
