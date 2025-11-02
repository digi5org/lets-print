# Let's Print - Quick Start Guide

This guide will help you get the Let's Print SaaS platform running on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** or **yarn** - Comes with Node.js

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/digi5org/lets-print.git
cd lets-print
```

### 2. Setup MySQL Database

Open your MySQL client and create a new database:

```sql
CREATE DATABASE lets_print;
```

Or from the command line:

```bash
mysql -u root -p -e "CREATE DATABASE lets_print;"
```

### 3. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# Use your favorite text editor (nano, vim, code, etc.)
nano .env
```

Update the following values in `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=lets_print
```

```bash
# Initialize database with demo data
npm run setup

# Start the backend server
npm run dev
```

The backend will be running on `http://localhost:5000`.

### 4. Setup Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# The default API URL (http://localhost:5000/api) should work
# No need to edit unless backend is on a different port

# Start the frontend
npm run dev
```

The frontend will be running on `http://localhost:3000`.

### 5. Access the Application

Open your browser and go to: **http://localhost:3000**

## Demo Login Credentials

Use these credentials to test different user roles:

### Super Admin
- **Email:** admin@letsprint.com
- **Password:** admin123
- **Access:** Complete system overview, manage all users, products, and orders

### Startup Owner
- **Email:** startup@letsprint.com
- **Password:** startup123
- **Access:** Manage products, view clients, handle orders, forward to production

### Production Owner
- **Email:** production@letsprint.com
- **Password:** production123
- **Access:** View and manage production jobs, update order status

### Client
- **Email:** client@example.com
- **Password:** client123
- **Access:** Browse products, place orders, track order status

## What to Explore

1. **Landing Page** - Overview of the platform and features
2. **Login Page** - Test different user roles with demo credentials
3. **Client Dashboard** - View orders and available products
4. **Startup Owner Dashboard** - Manage products, clients, and orders
5. **Production Owner Dashboard** - Handle production jobs
6. **Admin Dashboard** - System-wide overview and management

## Troubleshooting

### Backend won't start
- Verify MySQL is running: `mysql -u root -p`
- Check database credentials in `backend/.env`
- Ensure port 5000 is not in use

### Frontend won't start
- Ensure backend is running first
- Check port 3000 is not in use
- Verify `frontend/.env.local` has correct API URL

### Database connection issues
- Check MySQL service is running
- Verify database `lets_print` exists
- Confirm credentials in `.env` are correct

### Port conflicts
- Backend: Change `PORT` in `backend/.env`
- Frontend: Use `npm run dev -- -p 3001` to run on different port

## Next Steps

- Try logging in with different roles
- Create new products (as Startup Owner)
- Place orders (as Client)
- Manage production (as Production Owner)
- View system statistics (as Admin)

## Support

For issues or questions:
- Check the main [README.md](../README.md)
- Check backend [README.md](../backend/README.md)
- Check frontend [README.md](../frontend/README.md)
- Open an issue on GitHub

Enjoy using Let's Print! 🖨️
