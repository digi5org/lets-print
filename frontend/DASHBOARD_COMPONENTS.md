# Role-Specific Dashboard Components

This document explains the role-specific dashboard components created for the Let's Print application.

## Overview

The application now features four distinct dashboard experiences tailored to different user roles:

1. **Client Dashboard** - For end customers placing print orders
2. **Business Owner Dashboard** - For business owners managing products, orders, and clients
3. **Production Owner Dashboard** - For production facility managers handling job queues
4. **SuperAdmin Dashboard** - For system administrators managing the entire platform

## File Structure

```
frontend/src/
├── app/dashboard/
│   └── page.jsx                          # Main dashboard page with role routing
├── components/
│   ├── DashboardLayout.jsx               # Shared layout wrapper
│   └── dashboards/
│       ├── ClientDashboard.jsx           # Client role dashboard
│       ├── BusinessOwnerDashboard.jsx    # Business owner role dashboard
│       ├── ProductionOwnerDashboard.jsx  # Production owner role dashboard
│       └── SuperAdminDashboard.jsx       # SuperAdmin role dashboard
```

## Dashboard Features by Role

### 1. Client Dashboard (`ClientDashboard.jsx`)

**Purpose:** Allow clients to manage their print orders and track progress.

**Key Features:**
- **Order Statistics** - View total orders, pending, in progress, and completed orders
- **Order History Table** - See recent orders with details (ID, product, quantity, status, date, total)
- **Quick Actions:**
  - New Order button
  - Upload Design button (with modal)
  - View All Orders button
- **Order Tracking** - Live tracking of active orders through production stages
- **Design Upload Modal** - Upload design files for specific orders

**Mock Data:**
- 24 total orders
- 4 recent orders with various statuses
- Order tracking for business cards

### 2. Business Owner Dashboard (`BusinessOwnerDashboard.jsx`)

**Purpose:** Manage business operations, products, orders, and client relationships.

**Key Features:**
- **Business Statistics** - Total orders, active clients, products, revenue
- **Order Management Table** - Comprehensive order management with:
  - Bulk selection for production submission
  - Order status tracking
  - Filter and export options
- **Product Management Grid** - Quick view of products with:
  - Product pricing
  - Stock status
  - Monthly order count
- **CRM Table** - Client relationship management with:
  - Contact information
  - Order history
  - Total spend tracking
  - Client status
- **Quick Actions:**
  - Create new orders
  - Add products
  - Submit orders to production (batch submission)
  - View analytics
- **Modals:**
  - Add Product modal
  - Submit to Production modal (with order selection)

**Mock Data:**
- 156 total orders
- 42 active clients
- 28 products
- $12,450 revenue
- 4 recent orders ready for production
- 4 active clients in CRM

### 3. Production Owner Dashboard (`ProductionOwnerDashboard.jsx`)

**Purpose:** Manage production queue, update job statuses, and communicate with business owners.

**Key Features:**
- **Production Statistics** - Jobs in queue, in progress, completed today, revenue
- **Production Queue Table** - Comprehensive job management with:
  - Job priority indicators (High/Medium/Low)
  - Status dropdown for quick updates
  - Due date tracking with overdue alerts
  - Business and client information
- **Business Partners Table** - View and manage business relationships with:
  - Contact information
  - Active and total job counts
  - Quick messaging
- **Quick Actions:**
  - Start next job
  - Complete job
  - Message business
  - Generate production report
- **Messaging Modal** - Direct communication with business owners about specific jobs

**Mock Data:**
- 23 jobs in queue
- 12 jobs in progress
- 8 completed today
- $8,450 revenue
- 5 jobs in various stages
- 4 active business partners

### 4. SuperAdmin Dashboard (`SuperAdminDashboard.jsx`)

**Purpose:** System-wide management, user administration, and subscription control.

**Key Features:**
- **System Statistics** - Total users, active businesses, production facilities, monthly revenue
- **System Health Monitoring** - Real-time system metrics:
  - Server uptime
  - API response time
  - Storage usage
  - Active sessions
- **User Management Table** - Complete user administration with:
  - User role management
  - Subscription plan assignment
  - User status control (activate/suspend)
  - Last activity tracking
- **Subscription Plans Overview** - View and manage subscription tiers with:
  - Active subscriber counts
  - Plan features
  - Pricing information
- **Recent Activity Feed** - System-wide activity log with:
  - User registrations
  - Subscription changes
  - System events
  - Business registrations
- **Quick Actions:**
  - Add new users
  - Add new businesses
  - System backup
  - Generate reports
- **Modals:**
  - Add User modal
  - Change Subscription modal

**Mock Data:**
- 342 total users
- 45 active businesses
- 8 production facilities
- $45,230 monthly revenue
- System health metrics
- 5 users in management table
- 3 subscription plans
- Recent activity feed

## Testing Different Roles

To test different dashboard views, modify the `MOCK_USER` object in `/frontend/src/app/dashboard/page.jsx`:

```javascript
const MOCK_USER = {
  name: "John Doe",
  role: "client", // Change this value
};
```

**Available roles:**
- `"client"` - Shows ClientDashboard
- `"business_owner"` - Shows BusinessOwnerDashboard
- `"production_owner"` - Shows ProductionOwnerDashboard
- `"superadmin"` - Shows SuperAdminDashboard

## Styling

All dashboards use:
- **Tailwind CSS** for styling
- **Consistent design system** with:
  - White cards with shadows
  - Blue primary color (#3B82F6)
  - Status badges (green for success, yellow for pending, blue for in-progress, red for issues)
  - Hover effects on interactive elements
  - Responsive grid layouts

## Interactive Features

### Modals
All dashboards include modal dialogs for various actions:
- File upload (Client)
- Product management (Business Owner)
- Production submission (Business Owner)
- Messaging (Production Owner)
- User management (SuperAdmin)
- Subscription management (SuperAdmin)

### State Management
Each dashboard uses React's `useState` hook for:
- Modal visibility
- Form data
- Item selection
- Status updates

## Future Enhancements

### API Integration
Replace mock data with actual API calls:
```javascript
// Example
const fetchOrders = async () => {
  const response = await fetch('/api/orders');
  const data = await response.json();
  setOrders(data);
};
```

### Authentication
Replace `MOCK_USER` with actual authentication:
```javascript
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  // ...
}
```

### Real-time Updates
Add WebSocket connections for live updates:
- Order status changes
- New job assignments
- System notifications

### Advanced Features
- Export functionality (CSV, PDF)
- Advanced filtering and sorting
- Bulk actions
- Drag-and-drop file uploads
- Real-time chat/messaging
- Notification system
- Analytics dashboards with charts

## Navigation

Each role has a customized navigation menu defined in `/frontend/src/config/navigation.jsx`:

- **Client:** Dashboard, My Orders, Settings
- **Business Owner:** Dashboard, Orders, Clients, Analytics, Settings
- **Production Owner:** Dashboard, Orders, Businesses, Production, Analytics, Settings
- **SuperAdmin:** Dashboard, All Users, Businesses, Analytics, Settings

## Component Props

All dashboard components accept the same props:

```javascript
<DashboardComponent userName={string} />
```

- `userName` - The name of the logged-in user (used in welcome messages)

## Responsive Design

All dashboards are fully responsive:
- **Mobile (< 640px):** Single column layout, hamburger menu
- **Tablet (640px - 1024px):** 2 column grids where appropriate
- **Desktop (> 1024px):** Full multi-column layouts

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management in modals
- Color contrast compliance

## Development Tips

1. **Adding New Features:** Create separate component files for complex features
2. **Styling:** Use Tailwind's utility classes consistently
3. **Icons:** Use Heroicons (already integrated via inline SVGs)
4. **Forms:** Implement proper validation before submission
5. **Error Handling:** Add try-catch blocks when integrating with APIs
6. **Loading States:** Add skeleton loaders for better UX

## Support

For questions or issues with the dashboard components, please refer to:
- Main project README
- Component source code comments
- API documentation (when available)
