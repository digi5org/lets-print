# Let's Print - Backend

Node.js/Express REST API for the Let's Print application.

## Tech Stack

- Node.js (v20+)
- Express.js (REST API)
- JavaScript (ES6+)
- MySQL (Database)
- Prisma ORM (Database toolkit)
- JWT Authentication
- bcrypt (Password hashing)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your MySQL database credentials and other settings
```

3. Set up MySQL database:
```bash
# Create a database in MySQL
# Update DATABASE_URL in .env file
# Example: DATABASE_URL="mysql://user:password@localhost:3306/lets_print"
```

4. Run database migrations (Prisma):
```bash
npx prisma migrate dev
```

5. Start development server:
```bash
npm run dev
```

## API Documentation

API will be available at `http://localhost:5000/api`

### Available Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration with role selection
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

#### Health Check
- `GET /api/health` - API health check endpoint

### User Roles

The system supports four user roles:
- **Client** - End users who place orders
- **Business Owner** - Manages business operations and orders
- **Production Owner** - Manages production and fulfillment
- **SuperAdmin** - Full system access and management

More endpoints to be documented as development progresses...

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── routes/         # API routes
│   ├── models/         # Prisma schema and models
│   ├── middleware/     # Custom middleware (auth, validation, error handling)
│   ├── services/       # Business logic layer
│   ├── utils/          # Helper functions
│   ├── config/         # Configuration files
│   └── server.js       # Application entry point
├── prisma/
│   └── schema.prisma   # Prisma schema definition
├── .env.example        # Environment variables template
├── .env                # Environment variables (not in git)
└── package.json
```

## Scripts

- `npm run dev` - Start development server with hot reload (nodemon)
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="mysql://user:password@localhost:3306/lets_print"

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

See `.env.example` for all required environment variables.
