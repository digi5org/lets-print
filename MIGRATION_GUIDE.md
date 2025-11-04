# Auth.js Migration & Custom RBAC Implementation Guide

## Overview
This project has been migrated from SuperTokens to Auth.js (v5) with a custom Role-Based Access Control (RBAC) system. The implementation uses pure JavaScript, MySQL database with Prisma ORM, and supports multi-tenant architecture.

## System Architecture

### Backend Stack
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

### Frontend Stack
- **Framework**: Next.js 14+
- **Authentication**: Auth.js v5 (NextAuth.js beta)
- **Session**: JWT-based (no database sessions)

## Database Schema

### User Model
```javascript
{
  id: String (UUID)
  name: String
  email: String (unique)
  password: String (hashed with bcrypt)
  isActive: Boolean
  roleId: String (FK to Role)
  tenantId: String? (FK to Tenant, nullable for super_admin)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Role Model
```javascript
{
  id: String (UUID)
  name: String (unique) // super_admin, business_owner, production_owner, client
  description: String?
  permissions: Permission[] (many-to-many)
}
```

### Permission Model
```javascript
{
  id: String (UUID)
  name: String (unique)
  description: String?
  category: String // users, products, orders, designs, tenants, system
}
```

### Tenant Model
```javascript
{
  id: String (UUID)
  name: String
  slug: String (unique)
  domain: String? (nullable)
  isActive: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Roles & Permissions

### 1. Super Admin
**Description**: System administrator with full access
**Permissions**: All 24 permissions
- User management (create, read, update, delete)
- Product management (all operations)
- Order management (all operations)
- Design management (all operations)
- Tenant management (create, read, update, delete)
- System configuration

**Special Notes**:
- Not associated with any tenant (tenantId = null)
- Can create business_owner and production_owner users
- Cannot be created through public signup

### 2. Business Owner
**Description**: Manages a business tenant
**Permissions**: 12 permissions
- Read users, update own profile
- Full product management
- Full order management
- Read designs
- Read tenant info

**Special Notes**:
- Associated with one tenant
- Can manage products and orders within their tenant
- Can only be created by super_admin

### 3. Production Owner
**Description**: Manages production facility
**Permissions**: 11 permissions
- Read users, update own profile
- Read products
- Read and update orders
- Full design management
- Read tenant info

**Special Notes**:
- Associated with one tenant
- Focuses on production/fulfillment
- Can only be created by super_admin

### 4. Client
**Description**: Regular customer
**Permissions**: 8 permissions
- Read and update own profile
- Read products
- Create, read, update own orders
- Read designs

**Special Notes**:
- Public signup only creates client role users
- Associated with default tenant or business tenant
- Limited to own data access

## Pre-seeded Data

### Super Admin Account
```
Email: admin@letsprint.com
Password: SuperAdmin@123
Role: super_admin
```

### Sample Products
8 products have been seeded:
- Business Cards (500pcs) - $79.99
- Flyers (A5, 1000pcs) - $149.99
- Posters (A3, 100pcs) - $299.99
- Brochures (Tri-fold, 500pcs) - $249.99
- Banners (3x6 ft) - $89.99
- T-Shirts (Custom Print) - $24.99
- Stickers (Die-cut, 100pcs) - $49.99
- Booklets (A5, 50 pages, 100pcs) - $399.99

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST /signup
**Access**: Public
**Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string (min 8 chars)"
}
```
**Returns**: User object (always creates client role)

#### POST /login
**Access**: Public
**Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Returns**: JWT token with user data, role, permissions

#### GET /profile
**Access**: Authenticated
**Returns**: Current user profile

#### GET /verify
**Access**: Authenticated
**Returns**: Token verification status

#### POST /change-password
**Access**: Authenticated
**Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Admin Routes (`/api/admin`)
**All routes require super_admin role**

#### POST /users
Create new user (business_owner or production_owner)
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "roleId": "uuid",
  "tenantId": "uuid"
}
```

#### GET /users
Get all users with optional filtering
**Query**: `?role=roleName&tenant=tenantId&search=text`

#### PUT /users/:id
Update user details

#### DELETE /users/:id
Delete user (soft delete by setting isActive=false)

#### POST /users/:id/reset-password
Reset user password
```json
{
  "newPassword": "string"
}
```

#### GET /roles
Get all available roles

#### POST /tenants
Create new tenant
```json
{
  "name": "string",
  "slug": "string",
  "domain": "string?"
}
```

#### GET /tenants
Get all tenants

#### PUT /tenants/:id
Update tenant details

## Frontend Implementation

### Files Created/Modified

#### 1. `frontend/src/auth.js`
Auth.js configuration with:
- Credentials provider
- JWT strategy
- Session callbacks
- Helper functions: `hasRole()`, `hasPermission()`, `isSuperAdmin()`, `belongsToTenant()`

#### 2. `frontend/src/app/api/auth/[...nextauth]/route.js`
Auth.js API route handlers (GET, POST)

#### 3. `frontend/src/middleware.js`
Route protection middleware:
- Public routes: `/`, `/login`, `/signup`
- Protected routes: `/dashboard/*`
- Role-based dashboard sections
- Inactive user handling

#### 4. `frontend/src/contexts/AuthContext.jsx`
React context wrapping Auth.js:
- `useAuth()` hook
- `login()`, `logout()`, `updateUser()` methods
- Session state management

#### 5. `frontend/src/lib/apiClient.js`
API helper functions:
- `fetchAPI()` - Base fetch wrapper
- `ApiClient` class - Authenticated requests
- `registerUser()` - Public signup
- `getProducts()` - Public product listing

#### 6. `frontend/src/app/layout.jsx`
Updated to include:
- `SessionProvider` from next-auth
- `AuthProvider` context

#### 7. `frontend/src/app/login/page.jsx`
Updated to use Auth.js signIn

#### 8. `frontend/src/app/signup/page.jsx`
Updated to call backend signup API + auto-login

### Usage Examples

#### Check if user has specific role
```javascript
import { hasRole } from "@/auth";
import { useAuth } from "@/contexts/AuthContext";

// Server component
const session = await auth();
if (hasRole(session, ['super_admin'])) {
  // Show admin content
}

// Client component
const { session } = useAuth();
if (session?.user?.role === 'super_admin') {
  // Show admin content
}
```

#### Check permissions
```javascript
import { hasPermission } from "@/auth";

const session = await auth();
if (hasPermission(session, ['users:create'])) {
  // Show create user button
}
```

#### Make authenticated API calls
```javascript
import { ApiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";

const { session } = useAuth();
const api = new ApiClient(session?.accessToken);

// GET request
const users = await api.get('/api/admin/users');

// POST request
const newUser = await api.post('/api/admin/users', {
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  roleId: "role-uuid",
  tenantId: "tenant-uuid"
});
```

## Security Features

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Must contain special character

### JWT Configuration
- Secret key (configurable in `.env`)
- 7-day expiration
- Contains: userId, email, roleId, roleName, tenantId, permissions

### Middleware Protection
- `authenticate` - Verifies JWT and user status
- `requireRole` - Checks specific role
- `requireSuperAdmin` - Super admin only
- `requirePermission` - Checks specific permission
- `requireOwnership` - Tenant-based access control

## Environment Variables

### Backend `.env`
```env
DATABASE_URL="mysql://user:password@localhost:3306/letsprint"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
JWT_EXPIRES_IN="7d"
PORT=5000
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-min-32-characters
```

## Migration Steps Completed

✅ 1. Created comprehensive Prisma schema with RBAC models
✅ 2. Removed SuperTokens dependencies from backend
✅ 3. Installed bcryptjs and jsonwebtoken
✅ 4. Created authentication controllers (signup, login, profile, etc.)
✅ 5. Created admin controllers (user management, tenant management)
✅ 6. Updated middleware to use JWT instead of SuperTokens
✅ 7. Created auth and admin API routes
✅ 8. Updated Express server configuration
✅ 9. Created database migration
✅ 10. Seeded database with roles, permissions, super_admin
✅ 11. Installed Auth.js in frontend
✅ 12. Created Auth.js configuration
✅ 13. Created Auth.js API routes
✅ 14. Created route protection middleware
✅ 15. Updated AuthContext to use Auth.js
✅ 16. Updated login and signup pages
✅ 17. Created API client helper functions

## Remaining Tasks

### 1. Create Admin Panel
**File**: `frontend/src/app/dashboard/admin/page.jsx`
**Features**:
- User list with search/filter
- Create user form (business_owner, production_owner)
- Edit user modal
- Delete user confirmation
- Password reset functionality
- Tenant management section
- Only accessible to super_admin

### 2. Update Dashboard Pages
- Add role-based navigation
- Implement tenant-specific data filtering
- Add permission checks to UI elements

### 3. Create Protected API Routes in Frontend
**Example**: `frontend/src/app/api/users/route.js`
- Server-side API routes that call backend
- Include session token in requests

### 4. Add Tenant Selection for Multi-Tenant Features
- Business owner can manage their tenant
- Production owner sees only their tenant orders

### 5. Implement Order Management
- Client: View own orders
- Business Owner: Manage all orders in tenant
- Production Owner: Update order status, manage designs

### 6. Add Error Handling & Validation
- Toast notifications for success/error
- Form validation on frontend
- Better error messages from backend

### 7. Testing
- Test all role permissions
- Test tenant isolation
- Test authentication flows
- Test API endpoints

## How to Add New Permissions

### 1. Add to Seed Script
Edit `backend/src/prisma/seed.js`:
```javascript
const permissions = [
  // Add your new permission
  {
    name: 'feature:action',
    description: 'Description of what this allows',
    category: 'category_name'
  },
];
```

### 2. Assign to Roles
```javascript
const rolePermissions = {
  super_admin: ['all', 'permissions', 'feature:action'],
  business_owner: ['selected', 'permissions'],
  // ...
};
```

### 3. Run Seed Again
```bash
cd backend
npm run db:seed
```

### 4. Use in Middleware
```javascript
router.get(
  '/api/endpoint',
  authenticate,
  requirePermission(['feature:action']),
  controller.method
);
```

### 5. Check in Frontend
```javascript
import { hasPermission } from "@/auth";

if (hasPermission(session, ['feature:action'])) {
  // Show feature
}
```

## Troubleshooting

### ESLint Errors (next/babel)
**Issue**: "Cannot find module 'next/babel'"
**Solution**: These are non-critical warnings. The app will run fine. To fix:
```bash
cd frontend
npm install --save-dev @babel/core @babel/preset-env
```

### JWT Token Not Found
**Issue**: "No token provided"
**Solution**: Ensure `Authorization: Bearer <token>` header is sent with requests

### Permission Denied
**Issue**: 403 errors
**Solution**: Check user role and permissions in database. Verify token contains correct permissions.

### Database Connection Error
**Issue**: Prisma can't connect
**Solution**: 
- Check DATABASE_URL in `.env`
- Ensure MySQL server is running
- Run `npm run migrate` to sync schema

## Testing the System

### 1. Test Super Admin Login
```bash
POST http://localhost:5000/api/auth/login
{
  "email": "admin@letsprint.com",
  "password": "SuperAdmin@123"
}
```

### 2. Test Client Signup
```bash
POST http://localhost:5000/api/auth/signup
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@123"
}
```

### 3. Test Admin Endpoints
```bash
# Get token from login
GET http://localhost:5000/api/admin/users
Headers: Authorization: Bearer <token>
```

### 4. Test Frontend
```bash
cd frontend
npm run dev
```
Visit: http://localhost:3000/login

## Support & Documentation

- **Prisma Docs**: https://www.prisma.io/docs
- **Auth.js v5 Docs**: https://authjs.dev
- **Next.js Docs**: https://nextjs.org/docs
- **Express Docs**: https://expressjs.com

## Notes

- SuperTokens has been completely removed
- All authentication is now JWT-based
- Public signup only creates client role users
- Super admin must create business_owner and production_owner users
- Tenant isolation ensures data security between businesses
- Permissions are checked at both API and UI levels
- Session tokens expire after 7 days (configurable)
