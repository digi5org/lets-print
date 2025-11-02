# lets-print

"Let's Print" is a cloud-based SaaS platform for print business startups. It lets users subscribe, get their own CRM and storefront, manage client orders, forward jobs to production, and handle all workflows from marketing to delivery—no need for their own print machinery.

## 🚀 Features

### Multi-Role System
- **Client**: Browse products, place orders, track print jobs
- **Startup Owner**: Manage storefront, products, clients, and forward jobs to production
- **Production Owner**: Receive jobs, manage production, update order status
- **Super Admin**: Complete platform oversight and management

### Technical Features
- Role-based authentication and authorization
- RESTful API with JWT authentication
- MySQL database with Sequelize ORM
- Modern React/Next.js frontend with TypeScript
- Responsive UI with Tailwind CSS
- Demo data for immediate testing

## 📦 Project Structure

```
lets-print/
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── models/      # Sequelize models
│   │   ├── controllers/ # Route controllers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Authentication middleware
│   │   └── utils/       # Utilities and seed data
│   └── README.md
│
├── frontend/         # Next.js application
│   ├── src/
│   │   ├── app/         # Next.js pages
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   ├── lib/         # Utilities
│   │   └── types/       # TypeScript types
│   └── README.md
│
└── README.md         # This file
```

## 🛠️ Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/digi5org/lets-print.git
cd lets-print
```

### 2. Setup Backend

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Create MySQL database
mysql -u root -p
CREATE DATABASE lets_print;
exit

# Setup database and seed demo data
npm run setup

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local if needed (default API URL is http://localhost:5000/api)

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔐 Demo Credentials

After running the setup script, use these credentials to login:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@letsprint.com | admin123 |
| Startup Owner | startup@letsprint.com | startup123 |
| Production Owner | production@letsprint.com | production123 |
| Client | client@example.com | client123 |

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (startup/production owners, admin)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Order Endpoints
- `GET /api/orders` - Get orders (filtered by role)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status

### Client Endpoints
- `GET /api/clients` - Get all clients (startup owners, admin)
- `GET /api/clients/:id` - Get client by ID
- `PATCH /api/clients/:id/status` - Update client status

For detailed API documentation, see [backend/README.md](backend/README.md).

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API

## 🎨 Features by Role

### Client Dashboard
- View all orders and order history
- Browse available products
- Track order status in real-time
- View statistics

### Startup Owner Dashboard
- Manage product catalog
- View and manage all client orders
- View client list
- Track revenue and statistics
- Forward jobs to production partners

### Production Owner Dashboard
- View assigned production jobs
- Track jobs in production
- Update order status
- View completed jobs
- Production workflow management

### Super Admin Dashboard
- System-wide overview
- View all users, orders, and products
- Platform statistics
- Complete system management

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (RBAC)
- Protected API endpoints
- Input validation

## 📝 Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
npm run build  # Build TypeScript
npm start  # Run production build
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start development server
npm run build  # Create production build
npm start  # Run production server
```

## 🚢 Deployment

### Backend Deployment
1. Set up MySQL database on production server
2. Configure environment variables
3. Run database migrations/setup
4. Deploy using PM2, Docker, or cloud platform

### Frontend Deployment
1. Build the application
2. Deploy to Vercel, Netlify, or similar platform
3. Configure environment variables
4. Ensure backend API is accessible

## 📄 License

ISC

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the GitHub repository.
