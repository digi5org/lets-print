# Let's Print - Frontend

Next.js frontend application for the Let's Print SaaS platform.

## Features

- Modern UI with Tailwind CSS
- Role-based routing and dashboards
- User authentication with JWT
- Responsive design
- TypeScript for type safety

## User Roles & Dashboards

### 1. Client Dashboard (`/dashboard/client`)
- View all orders
- Browse available products
- Track order status
- Place new orders

### 2. Startup Owner Dashboard (`/dashboard/startup`)
- Manage products
- View and manage client orders
- View client list
- Track revenue and statistics
- Forward jobs to production

### 3. Production Owner Dashboard (`/dashboard/production`)
- View assigned production jobs
- Update order status
- Track completed jobs
- Manage production workflow

### 4. Super Admin Dashboard (`/dashboard/admin`)
- Complete system overview
- View all users, orders, and products
- System-wide statistics
- Platform management

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update the API URL if needed (default is `http://localhost:5000/api`).

3. **Ensure backend is running**
   
   The frontend requires the backend API to be running. See the backend README for setup instructions.

## Running the Application

### Development mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production build
```bash
npm run build
npm start
```

## Demo Accounts

Use these credentials to test different roles:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@letsprint.com | admin123 |
| Startup Owner | startup@letsprint.com | startup123 |
| Production Owner | production@letsprint.com | production123 |
| Client | client@example.com | client123 |

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Authentication**: JWT tokens

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

