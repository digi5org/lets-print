# Let's Print - Frontend

Next.js frontend application for the Let's Print SaaS platform.

## Tech Stack

- Next.js 14
- React 18
- JavaScript (ES6+)
- Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── src/
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── services/       # API service layer
│   ├── types/          # TypeScript types
│   └── styles/         # Global styles
├── public/             # Static assets
├── .env.local          # Environment variables
└── package.json
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features

- 🔐 Role-based authentication (Client, Business Owner, Production Owner, SuperAdmin)
- 📱 Responsive design with mobile-first approach
- 🎨 Tailwind CSS styling
- 🚀 Server-side rendering (SSR)
- 📄 Static site generation (SSG)
- 🖼️ Optimized images and fonts
- 📝 TypeScript for type safety

## Pages

- `/` - Landing page
- `/login` - User authentication
- `/signup` - User registration with role selection
- `/dashboard` - Main dashboard (role-based navigation)
- `/error` - Custom error page
- `/404` - Custom not found page

## Role-Based Navigation

The dashboard navigation adapts based on user role:

- **Client**: Dashboard, My Orders, Settings
- **Business Owner**: Dashboard, Orders, Clients, Analytics, Settings
- **Production Owner**: Dashboard, Orders, Businesses, Production, Analytics, Settings
- **SuperAdmin**: Dashboard, All Users, Businesses, Analytics, Settings

## Testing Different Roles

To test different user roles, modify the `MOCK_USER` in `/src/app/dashboard/page.jsx`:

```javascript
const MOCK_USER = {
  name: "John Doe",
  role: "client", // Change to: "business_owner", "production_owner", "superadmin"
};
```

## Environment Variables

See `.env.example` for all required environment variables.
