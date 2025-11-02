# LetsPrint Backend API

Backend API for LetsPrint - A custom printing service platform built with Express.js, Prisma, MySQL, and SuperTokens.

## Features

- 🔐 **Authentication & Authorization** using SuperTokens
- 👥 **User Management** with role-based access control (Admin/User)
- 📦 **Product Management** for printing services
- 🛒 **Order Management** with status tracking
- 🎨 **Design Management** for custom designs
- 🗄️ **MySQL Database** with Prisma ORM
- ✅ **Input Validation** using express-validator
- 🔒 **Security** with Helmet and CORS
- 📊 **Rate Limiting** to prevent abuse

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: SuperTokens
- **Validation**: express-validator

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/lets_print_db"

# Server
PORT=5000
NODE_ENV=development

# SuperTokens Configuration
SUPERTOKENS_CONNECTION_URI=https://try.supertokens.com
SUPERTOKENS_API_KEY=

# Application
APP_NAME=LetsPrint
API_DOMAIN=http://localhost:5000
WEBSITE_DOMAIN=http://localhost:3000

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run migrate

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication (SuperTokens)
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login user
- `POST /auth/signout` - Logout user
- `POST /auth/session/refresh` - Refresh session

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get product by ID (public)
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `GET /api/orders` - Get all orders (User: own orders, Admin: all orders)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `POST /api/orders/:id/cancel` - Cancel order
- `PATCH /api/orders/:id/status` - Update order status (Admin only)

### Designs
- `GET /api/designs` - Get all designs (User: own designs, Admin: all)
- `GET /api/designs/:id` - Get design by ID
- `POST /api/designs` - Upload new design
- `PUT /api/designs/:id` - Update design
- `DELETE /api/designs/:id` - Delete design

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update current user profile
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PATCH /api/users/:id/role` - Update user role (Admin only)

## Database Schema

### Models

- **User**: User accounts with role-based access
- **Product**: Printing products/services
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items in an order
- **Design**: Custom design files uploaded by users

### Enums

- **Role**: ADMIN, USER
- **OrderStatus**: PENDING, PROCESSING, PRINTING, COMPLETED, CANCELLED

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:deploy` - Deploy migrations to production
- `npm run db:generate` - Generate Prisma Client
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **SuperTokens**: Secure authentication
- **Input Validation**: Request validation
- **Session Management**: Secure session handling

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

## Development

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js
│   │   └── supertokens.js
│   ├── controllers/     # Request handlers
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── designController.js
│   │   └── userController.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── routes/          # API routes
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── designRoutes.js
│   │   └── userRoutes.js
│   ├── validators/      # Input validation
│   │   └── validators.js
│   ├── prisma/          # Database seed
│   │   └── seed.js
│   └── server.js        # Application entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── .env                 # Environment variables
└── package.json
```

## License

MIT
