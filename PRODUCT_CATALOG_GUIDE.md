# Master Product Catalog System - Implementation Guide

## Overview
This system implements a multi-tenant product management solution where:
- **SuperAdmin & Production Owner**: Manage the master product catalog
- **Business Owner**: Select products from the catalog to display in their store
- **Client**: View and order from products enabled by their business owner

## Database Schema Changes

### 1. Product Model (Master Catalog)
```prisma
model Product {
  id              String   @id @default(uuid())
  name            String
  description     String?
  category        String
  price           Float
  imageUrl        String?
  specifications  Json?
  isActive        Boolean  @default(true)
  createdBy       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  orderItems      OrderItem[]
  tenantProducts  TenantProduct[]
}
```

### 2. TenantProduct Model (Junction Table)
```prisma
model TenantProduct {
  id          String   @id @default(uuid())
  tenantId    String
  productId   String
  isActive    Boolean  @default(true)
  customPrice Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  tenant      Tenant
  product     Product
}
```

## Backend API Endpoints

### SuperAdmin/Production Owner Endpoints
- `GET /api/products` - Get all products from master catalog
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product (SuperAdmin only)
- `GET /api/products/categories` - Get all categories

### Business Owner Endpoints
- `GET /api/products/tenant/:tenantId` - Get products with tenant-specific status
- `POST /api/products/tenant/:tenantId/product/:productId/toggle` - Enable/disable product for tenant

### Client Endpoints
- `GET /api/products/client/:tenantId` - Get active products for a tenant

## Frontend Components

### 1. SuperAdmin Product Management
**Location**: `/components/superadmin/ProductManagement.jsx`

**Features**:
- View all products in master catalog
- Create new products
- Edit existing products
- Delete products
- Toggle product active/inactive status
- View how many businesses are using each product

**Usage**:
```jsx
import ProductManagement from "@/components/superadmin/ProductManagement";

// In SuperAdmin Dashboard
<ProductManagement />
```

### 2. Business Owner Product Selection (To be created)
**Location**: `/components/businessowner/ProductSelection.jsx`

**Features**:
- View all available products from master catalog
- Enable/disable products for their store
- Set custom pricing (optional)
- See which products are currently active

### 3. Client Product Catalog (To be created)
**Location**: `/components/client/ProductCatalog.jsx`

**Features**:
- View only active products from their business owner
- See product details
- Add to cart
- Place orders

## How It Works

### Product Flow:
1. **SuperAdmin/Production Owner** creates products in the master catalog
2. **Business Owner** browses the master catalog and enables products they want to sell
3. **Client** sees only the products that their business owner has enabled
4. When a client orders, the order references the master product

### Data Relationships:
```
Product (Master Catalog)
  ↓
TenantProduct (Business Owner Selection)
  ↓
OrderItem (Client Order)
```

## Next Steps

### For Business Owner Dashboard:
1. Create ProductSelection component
2. Add to navigation
3. Implement product toggle functionality
4. Add custom pricing feature

### For Client Dashboard:
1. Create ProductCatalog component
2. Filter products by tenant
3. Implement cart functionality
4. Connect to order system

### Additional Features:
1. Product image upload
2. Bulk product import
3. Product analytics
4. Inventory management
5. Product variants (sizes, colors, etc.)

## Migration Notes

The database has been migrated with the following changes:
- Removed `tenantId` from Product model
- Added `specifications` and `createdBy` fields to Product
- Created new `TenantProduct` junction table
- Migrated existing tenant-specific products to junction table

## Testing

### Test SuperAdmin Product Management:
1. Login as SuperAdmin
2. Navigate to Product Management
3. Create a new product
4. Edit the product
5. Toggle active/inactive status
6. Delete the product

### Test Business Owner Product Selection:
1. Login as Business Owner
2. View available products
3. Enable products for your store
4. Set custom pricing
5. Disable products

### Test Client Product View:
1. Login as Client
2. View products from your business
3. Verify only active products are shown
4. Test ordering functionality

## API Client Usage

```javascript
import { ApiClient } from "@/lib/apiClient";

const api = new ApiClient(session.accessToken);

// Get all products (SuperAdmin)
const products = await api.get("/api/products");

// Create product
const newProduct = await api.post("/api/products", {
  name: "Business Cards",
  category: "Cards",
  price: 29.99,
  description: "Premium business cards"
});

// Toggle product for tenant
await api.post(`/api/products/tenant/${tenantId}/product/${productId}/toggle`, {
  isActive: true,
  customPrice: 24.99
});

// Get client products
const clientProducts = await api.get(`/api/products/client/${tenantId}`);
```

## Security

- All endpoints require authentication
- Role-based access control (RBAC) enforced
- Business owners can only manage their own tenant's products
- Clients can only view products from their tenant
- SuperAdmin has full access to all operations

## Performance Considerations

- Products are indexed by category and active status
- TenantProducts are indexed by tenantId, productId, and isActive
- Use pagination for large product catalogs
- Consider caching frequently accessed products

## Future Enhancements

1. **Product Variants**: Different sizes, colors, materials
2. **Bulk Operations**: Import/export products via CSV
3. **Product Templates**: Quick product creation from templates
4. **Analytics**: Track product popularity and sales
5. **Reviews**: Allow clients to review products
6. **Inventory**: Track stock levels
7. **Discounts**: Tenant-specific pricing and promotions
