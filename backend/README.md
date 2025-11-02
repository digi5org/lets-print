# Let's Print - Backend API

Node.js/Express.js REST API for the Let's Print SaaS platform.

## Features

- User authentication with JWT
- Role-based access control (Client, Startup Owner, Production Owner, Super Admin)
- Product/Item CRUD operations
- Order management
- Client onboarding
- MySQL database with Sequelize ORM

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials and other settings.

3. **Set up MySQL database**
   
   Create a MySQL database:
   ```sql
   CREATE DATABASE lets_print;
   ```

4. **Initialize database with demo data**
   ```bash
   npm run setup
   ```
   
   This will create all tables and seed demo data.

## Running the Application

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm run build
npm start
```

The API server will start on `http://localhost:5000` (or the port specified in `.env`).

## Demo Users

After running the setup script, you can login with these credentials:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@letsprint.com | admin123 |
| Startup Owner | startup@letsprint.com | startup123 |
| Production Owner | production@letsprint.com | production123 |
| Client | client@example.com | client123 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)

### Products
- `GET /api/products` - Get all products (authenticated)
- `GET /api/products/:id` - Get product by ID (authenticated)
- `POST /api/products` - Create product (startup/production owners, admin)
- `PUT /api/products/:id` - Update product (owner or admin)
- `DELETE /api/products/:id` - Delete product (owner or admin)

### Orders
- `GET /api/orders` - Get orders (filtered by role)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status (startup/production owners, admin)

### Clients
- `GET /api/clients` - Get all clients (startup owners, admin)
- `GET /api/clients/:id` - Get client by ID (startup owners, admin)
- `PATCH /api/clients/:id/status` - Update client status (startup owners, admin)

## API Documentation

### Register User

**POST** `/api/auth/register`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "client",
  "companyName": "Optional Company",
  "phone": "+1234567890"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "client"
  }
}
```

### Login

**POST** `/api/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "client"
  }
}
```

### Create Product

**POST** `/api/products`

Headers:
```
Authorization: Bearer <jwt-token>
```

Request body:
```json
{
  "name": "Business Cards",
  "description": "Professional business cards",
  "category": "Cards",
  "price": 50.00,
  "unit": "per 100"
}
```

### Create Order

**POST** `/api/orders`

Headers:
```
Authorization: Bearer <jwt-token>
```

Request body:
```json
{
  "clientId": 1,
  "startupOwnerId": 2,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "notes": "Rush order"
}
```

## Database Schema

### Users Table
- id (INT, PRIMARY KEY)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- firstName (VARCHAR)
- lastName (VARCHAR)
- role (ENUM: client, startup_owner, production_owner, super_admin)
- companyName (VARCHAR, nullable)
- phone (VARCHAR, nullable)
- isActive (BOOLEAN)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### Products Table
- id (INT, PRIMARY KEY)
- name (VARCHAR)
- description (TEXT, nullable)
- category (VARCHAR)
- price (DECIMAL)
- unit (VARCHAR)
- isActive (BOOLEAN)
- ownerId (INT, FOREIGN KEY -> users.id)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### Orders Table
- id (INT, PRIMARY KEY)
- clientId (INT, FOREIGN KEY -> users.id)
- startupOwnerId (INT, FOREIGN KEY -> users.id)
- productionOwnerId (INT, FOREIGN KEY -> users.id, nullable)
- status (ENUM: pending, confirmed, in_production, completed, cancelled)
- totalAmount (DECIMAL)
- notes (TEXT, nullable)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### OrderItems Table
- id (INT, PRIMARY KEY)
- orderId (INT, FOREIGN KEY -> orders.id)
- productId (INT, FOREIGN KEY -> products.id)
- quantity (INT)
- unitPrice (DECIMAL)
- subtotal (DECIMAL)

## Mock/Demo Mode

The application is configured with demo data that includes:
- Sample users for each role
- Sample products
- Sample orders

This allows immediate testing without requiring real data setup.

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control
- Input validation on all endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CORS**: cors middleware

## License

ISC
