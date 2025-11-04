# Next.js Route Structure

## Current Route Organization

### App Directory Structure
```
frontend/src/app/
├── (auth)/                          # Route group for authentication pages
│   ├── layout.jsx                   # Auth-specific layout with gradient background
│   ├── login/
│   │   └── page.jsx                 # Login page (/login)
│   └── signup/
│       └── page.jsx                 # Signup page (/signup)
│
├── api/                             # API routes
│   └── auth/
│       └── [...nextauth]/
│           └── route.js             # Auth.js API handlers
│
├── dashboard/                       # Protected dashboard routes
│   ├── layout.jsx                   # Dashboard layout with auth check
│   ├── page.jsx                     # Main dashboard (/dashboard)
│   │
│   ├── admin/                       # Super admin only routes
│   │   ├── layout.jsx               # Admin layout with role check
│   │   └── page.jsx                 # Admin panel (/dashboard/admin)
│   │
│   ├── products/
│   │   └── page.jsx                 # Products list (/dashboard/products)
│   │
│   └── orders/
│       └── page.jsx                 # Orders list (/dashboard/orders)
│
├── layout.jsx                       # Root layout with SessionProvider
├── page.jsx                         # Home page (/)
├── error.jsx                        # Error boundary
└── not-found.jsx                    # 404 page
```

## Route Features

### 1. Route Groups - `(auth)`
- **Purpose**: Groups related routes without affecting URL structure
- **Benefit**: Shared layout for login/signup pages
- **URL**: Still accessible at `/login` and `/signup`, not `/auth/login`

### 2. Nested Layouts
- **Root Layout** (`app/layout.jsx`): SessionProvider + AuthProvider
- **Auth Layout** (`app/(auth)/layout.jsx`): Gradient background
- **Dashboard Layout** (`app/dashboard/layout.jsx`): Authentication check
- **Admin Layout** (`app/dashboard/admin/layout.jsx`): Super admin role check

### 3. Protected Routes
All routes under `/dashboard/**` are automatically protected by:
- Dashboard layout: Checks `isAuthenticated`
- Admin layout: Checks `role === 'super_admin'`

### 4. API Routes
- `/api/auth/*` - Auth.js handles all authentication endpoints
- Backend API calls made via `ApiClient` class to `http://localhost:5000`

## Page Routes

| URL | Component | Access | Description |
|-----|-----------|--------|-------------|
| `/` | `app/page.jsx` | Public | Landing page |
| `/login` | `app/(auth)/login/page.jsx` | Public | Login form |
| `/signup` | `app/(auth)/signup/page.jsx` | Public | Signup form (client role only) |
| `/dashboard` | `app/dashboard/page.jsx` | Authenticated | User dashboard |
| `/dashboard/products` | `app/dashboard/products/page.jsx` | Authenticated | Products catalog |
| `/dashboard/orders` | `app/dashboard/orders/page.jsx` | Authenticated | User orders |
| `/dashboard/admin` | `app/dashboard/admin/page.jsx` | Super Admin | Admin panel |

## Layout Hierarchy

```
Root Layout (SessionProvider, AuthProvider)
│
├── (auth) Layout (Gradient background)
│   ├── Login Page
│   └── Signup Page
│
├── Dashboard Layout (Auth required)
│   ├── Dashboard Page
│   ├── Products Page
│   ├── Orders Page
│   │
│   └── Admin Layout (Super admin required)
│       └── Admin Page
```

## Next.js Conventions Used

### 1. **File-based Routing**
- `page.jsx` = Route page
- `layout.jsx` = Shared layout
- `error.jsx` = Error boundary
- `not-found.jsx` = 404 handler

### 2. **Route Groups**
- `(auth)` = Group without URL segment
- Allows shared layout without changing URLs

### 3. **Dynamic Segments** (Future)
- `[id]/page.jsx` = Dynamic route parameter
- Example: `orders/[id]/page.jsx` for `/orders/123`

### 4. **Client/Server Components**
- `"use client"` = Client component (interactive)
- No directive = Server component (default)

## Benefits of This Structure

✅ **Clear Separation**: Auth pages grouped separately
✅ **Nested Protection**: Layouts handle authentication at each level
✅ **Role-based Access**: Admin section automatically checks super_admin role
✅ **Scalable**: Easy to add more dashboard sections
✅ **Type-safe**: Can add TypeScript later without restructuring
✅ **SEO-friendly**: Server components by default
✅ **Performance**: Automatic code splitting per route

## Future Enhancements

### Suggested Additional Routes:
```
dashboard/
├── profile/
│   └── page.jsx                     # User profile
├── settings/
│   └── page.jsx                     # User settings
├── products/
│   └── [id]/
│       └── page.jsx                 # Product details
├── orders/
│   └── [id]/
│       └── page.jsx                 # Order details
└── admin/
    ├── users/
    │   ├── page.jsx                 # User list
    │   └── [id]/
    │       └── page.jsx             # Edit user
    ├── tenants/
    │   └── page.jsx                 # Tenant management
    └── settings/
        └── page.jsx                 # System settings
```

## Route Protection Flow

### Client Authentication:
1. User visits `/dashboard/*`
2. Dashboard layout runs `useAuth()` hook
3. Checks `isAuthenticated` status
4. If not authenticated → redirect to `/login`
5. If authenticated → render page

### Role-Based Access:
1. User visits `/dashboard/admin`
2. Admin layout runs role check
3. Verifies `user.role === 'super_admin'`
4. If not super admin → redirect to `/dashboard`
5. If super admin → render admin page

### Middleware Protection (Server-side):
- Defined in `middleware.js`
- Runs before page renders
- Checks Auth.js session
- Redirects unauthenticated users early

## Development Guidelines

### Creating New Routes:

1. **Public Page**:
   ```bash
   /app/about/page.jsx
   ```

2. **Protected Page**:
   ```bash
   /app/dashboard/feature/page.jsx
   ```

3. **Role-Specific Page**:
   ```bash
   /app/dashboard/admin/feature/page.jsx
   ```

### Adding Layouts:
- Add `layout.jsx` in the route directory
- Wraps all child pages automatically
- Can nest multiple layouts

### API Routes:
```bash
/app/api/route-name/route.js
```
- Export `GET`, `POST`, `PUT`, `DELETE` functions
- Server-side only
- Can call backend API securely

## Summary

The frontend is now properly structured following Next.js 14 App Router conventions:
- ✅ Route groups for logical organization
- ✅ Nested layouts for progressive protection
- ✅ Role-based access control
- ✅ Clean, scalable architecture
- ✅ Following Next.js best practices
