# Let's Print - Backend

Node.js/Express REST API for the Let's Print application.

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations (when using Prisma):
```bash
npm run migrate
```

4. Start development server:
```bash
npm run dev
```

## API Documentation

API will be available at `http://localhost:5000/api`

### Available Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- More endpoints to be documented...

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── routes/         # API routes
│   ├── models/         # Data models
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   ├── config/         # Configuration files
│   └── server.ts       # Application entry point
├── .env.example        # Environment variables template
└── package.json
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.example` for all required environment variables.
