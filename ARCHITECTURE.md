# Let's Print - Application Architecture

## Overview

Let's Print is a full-stack SaaS application for print business startups, built with modern web technologies. The application follows a traditional client-server architecture with a React-based frontend and Node.js backend.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                      (Next.js 15)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  App Router Pages                                    │  │
│  │  - Landing Page                                      │  │
│  │  - Login / Signup                                    │  │
│  │  - Client Dashboard                                  │  │
│  │  - Startup Owner Dashboard                           │  │
│  │  - Production Owner Dashboard                        │  │
│  │  - Super Admin Dashboard                             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Components                                    │  │
│  │  - Navbar, DashboardLayout, etc.                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Context API (AuthContext)                           │  │
│  │  - User authentication state                         │  │
│  │  - JWT token management                              │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/REST API
                        │ (Axios)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                         BACKEND                             │
│                   (Express.js + TypeScript)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  REST API Routes                                     │  │
│  │  - /api/auth (register, login, profile)             │  │
│  │  - /api/products (CRUD operations)                   │  │
│  │  - /api/orders (order management)                    │  │
│  │  - /api/clients (client management)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware                                          │  │
│  │  - JWT Authentication                                │  │
│  │  - Role-Based Authorization                          │  │
│  │  - CORS                                              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers                                         │  │
│  │  - Business Logic                                    │  │
│  │  - Request/Response Handling                         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Sequelize ORM                                       │  │
│  │  - Models (User, Product, Order, OrderItem)         │  │
│  │  - Database Operations                               │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ SQL Queries
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      DATABASE                               │
│                      (MySQL)                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables:                                             │  │
│  │  - users (authentication & profiles)                 │  │
│  │  - products (print products/services)                │  │
│  │  - orders (customer orders)                          │  │
│  │  - order_items (order line items)                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Authentication:** JWT tokens in localStorage

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **CORS:** cors middleware

### Database
- **RDBMS:** MySQL 8+
- **Schema Management:** Sequelize models and migrations

## Key Features

### 1. Role-Based Access Control (RBAC)

Four distinct user roles with specific permissions:

#### Client
- View available products
- Place orders
- Track order status
- View order history

#### Startup Owner
- All Client permissions
- Create/manage products
- View all client orders
- Manage clients
- Forward orders to production
- View revenue statistics

#### Production Owner
- View assigned production jobs
- Update order status
- Track production progress
- Manage workflow

#### Super Admin
- Complete system access
- View all users, products, orders
- System-wide statistics
- Platform management

### 2. Authentication Flow

```
1. User submits credentials (email/password)
2. Backend validates credentials
3. Backend generates JWT token
4. Token sent to frontend
5. Frontend stores token in localStorage
6. Token included in subsequent API requests
7. Backend validates token on protected routes
8. User redirected to role-appropriate dashboard
```

### 3. Data Models

#### User
- Authentication credentials
- Personal information
- Role assignment
- Company details

#### Product
- Product information
- Pricing
- Category
- Owner reference

#### Order
- Client reference
- Startup owner reference
- Production owner reference (optional)
- Status tracking
- Total amount

#### OrderItem
- Product reference
- Quantity
- Unit price
- Subtotal

## API Architecture

### RESTful Endpoints

All API endpoints follow REST conventions:

- **GET** - Retrieve resources
- **POST** - Create resources
- **PUT** - Update entire resources
- **PATCH** - Partial updates
- **DELETE** - Remove resources

### Authentication

Protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### Response Format

Consistent JSON response structure:
```json
{
  "message": "Success message",
  "data": { /* response data */ }
}
```

Error responses:
```json
{
  "message": "Error description"
}
```

## Security Features

1. **Password Security**
   - Passwords hashed with bcrypt (10 salt rounds)
   - Never stored or transmitted in plain text

2. **Authentication**
   - JWT tokens with expiration
   - Secure token validation

3. **Authorization**
   - Role-based middleware
   - Endpoint-level permission checks
   - Resource ownership validation

4. **Input Validation**
   - Required field validation
   - Email format validation
   - Duplicate prevention

5. **CORS**
   - Configured CORS policy
   - Origin validation

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  role ENUM('client', 'startup_owner', 'production_owner', 'super_admin'),
  companyName VARCHAR(255),
  phone VARCHAR(50),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) DEFAULT 'piece',
  isActive BOOLEAN DEFAULT true,
  ownerId INT NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (ownerId) REFERENCES users(id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clientId INT NOT NULL,
  startupOwnerId INT NOT NULL,
  productionOwnerId INT,
  status ENUM('pending', 'confirmed', 'in_production', 'completed', 'cancelled'),
  totalAmount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES users(id),
  FOREIGN KEY (startupOwnerId) REFERENCES users(id),
  FOREIGN KEY (productionOwnerId) REFERENCES users(id)
);
```

### OrderItems Table
```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  unitPrice DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);
```

## Deployment Considerations

### Backend Deployment
- Set environment variables
- Configure production database
- Use process manager (PM2)
- Enable HTTPS
- Set up logging
- Configure CORS for production frontend URL

### Frontend Deployment
- Build optimized production bundle
- Set `NEXT_PUBLIC_API_URL` to production API
- Deploy to Vercel, Netlify, or similar
- Configure custom domain
- Enable CDN

### Database
- Use managed MySQL service (AWS RDS, Google Cloud SQL)
- Set up automated backups
- Configure connection pooling
- Implement proper indexes
- Monitor performance

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless backend design
   - JWT tokens (no server-side sessions)
   - Load balancer ready

2. **Database Optimization**
   - Indexed foreign keys
   - Connection pooling
   - Query optimization

3. **Caching**
   - Frontend: React Query or SWR
   - Backend: Redis for session/cache
   - Database: Query result caching

4. **CDN**
   - Static assets served via CDN
   - Frontend deployment with edge caching

## Future Enhancements

Potential areas for expansion:

1. **File Uploads**
   - Product images
   - Order attachments
   - User avatars

2. **Real-time Updates**
   - WebSocket integration
   - Live order status updates
   - Chat functionality

3. **Payment Integration**
   - Stripe/PayPal integration
   - Invoice generation
   - Payment tracking

4. **Notifications**
   - Email notifications
   - SMS alerts
   - In-app notifications

5. **Analytics**
   - Dashboard analytics
   - Sales reports
   - User activity tracking

6. **Advanced Features**
   - Multi-tenancy
   - API rate limiting
   - Advanced search/filtering
   - Batch operations
   - Export functionality (CSV, PDF)

## Conclusion

Let's Print provides a solid foundation for a print business SaaS platform with:
- Clean separation of concerns
- Type-safe codebase
- Secure authentication and authorization
- Scalable architecture
- Comprehensive documentation

The modular design allows for easy extension and customization based on specific business needs.
