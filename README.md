# Let's Print

A modern SaaS print business management application built with a monorepo architecture.

## Project Overview

"Let's Print" is a cloud-based SaaS platform for print business startups. It lets users subscribe, get their own CRM and storefront, manage client orders, forward jobs to production, and handle all workflows from marketing to delivery—no need for their own print machinery.

### User Roles

The platform supports four distinct user roles with customized dashboards:

1. **Client** - Place orders, track deliveries, manage printing needs
2. **Business Owner** - Manage orders, coordinate with production, oversee clients
3. **Production Owner** - Handle production workflows, manage equipment and jobs
4. **SuperAdmin** - Complete system administration and oversight

## Architecture

This project uses a monorepo structure with the following components:

- **Frontend**: Next.js application (React-based)
- **Backend**: Node.js/Express REST API

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Git

## Project Structure

```
lets-print/
├── frontend/          # Next.js frontend application
│   ├── src/
│   ├── public/
│   ├── .env.example   # Environment variables template
│   ├── .env.local     # Local environment variables (create from .env.example)
│   └── package.json
├── backend/           # Node.js/Express backend API
│   ├── src/
│   ├── .env.example   # Environment variables template
│   ├── .env           # Local environment variables (create from .env.example)
│   └── package.json
├── package.json       # Root package.json for monorepo
└── README.md
```

## Getting Started

### Quick Start (All at Once)

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend in development mode
npm run dev
```

### Individual Setup

#### 1. Clone the repository

```bash
git clone https://github.com/digi5org/lets-print.git
cd lets-print
```

#### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

The frontend will be available at `http://localhost:3000`

#### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

The backend API will be available at `http://localhost:5000`

## Environment Variables

### Frontend (.env.local)

See `frontend/.env.example` for required environment variables.

### Backend (.env)

See `backend/.env.example` for required environment variables.

## Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

#### Frontend Features
- 🔐 Role-based authentication (Client, Business Owner, Production Owner, SuperAdmin)
- 📱 Fully responsive design with mobile-first approach
- 🎨 Modern UI with Tailwind CSS
- 🚀 Optimized performance with Next.js App Router
- 📄 Pages: Landing, Login, Signup, Dashboard, Error, 404
- 🎭 Dynamic navigation based on user roles

### Backend Development

```bash
cd backend
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
```

## Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend concurrently
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build both frontend and backend
- `npm run install:all` - Install dependencies in all workspaces
- `npm run clean` - Remove all node_modules and build artifacts

Each workspace has its own set of scripts. Refer to the individual `package.json` files for details.

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- JavaScript (ES6+)
- Tailwind CSS
- Role-based authentication system

### Backend
- Node.js
- Express
- TypeScript
- MySQL (Database)
- Prisma (ORM)
- JWT (Authentication)

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Contact

For questions or support, please contact the development team.

