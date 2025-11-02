# API Testing Examples

Use these examples with Thunder Client, Postman, or curl to test the API endpoints.

## Base URL
```
http://localhost:5000
```

## 1. Authentication

### Sign Up (Register)
```http
POST /auth/signup
Content-Type: application/json

{
  "formFields": [
    {
      "id": "email",
      "value": "user@example.com"
    },
    {
      "id": "password",
      "value": "password123"
    },
    {
      "id": "name",
      "value": "John Doe"
    }
  ]
}
```

### Sign In (Login)
```http
POST /auth/signin
Content-Type: application/json

{
  "formFields": [
    {
      "id": "email",
      "value": "user@example.com"
    },
    {
      "id": "password",
      "value": "password123"
    }
  ]
}
```

**Note**: After login, save the cookies/tokens for authenticated requests.

### Sign Out
```http
POST /auth/signout
```

## 2. Products (Public - No Auth Required)

### Get All Products
```http
GET /api/products
```

### Get Products by Category
```http
GET /api/products?category=Business
```

### Search Products
```http
GET /api/products?search=card
```

### Get Single Product
```http
GET /api/products/{productId}
```

## 3. Products (Admin Only - Requires Auth)

### Create Product
```http
POST /api/products
Content-Type: application/json
Cookie: [auth cookies from login]

{
  "name": "Custom Mug",
  "description": "Personalized ceramic mug with your design",
  "category": "Promotional",
  "price": 14.99,
  "imageUrl": "https://example.com/mug.jpg",
  "isActive": true
}
```

### Update Product
```http
PUT /api/products/{productId}
Content-Type: application/json
Cookie: [auth cookies from login]

{
  "name": "Custom Mug - Updated",
  "price": 16.99
}
```

### Delete Product
```http
DELETE /api/products/{productId}
Cookie: [auth cookies from login]
```

## 4. Orders (Requires Authentication)

### Create Order
```http
POST /api/orders
Content-Type: application/json
Cookie: [auth cookies from login]

{
  "items": [
    {
      "productId": "uuid-of-product",
      "quantity": 2
    },
    {
      "productId": "uuid-of-another-product",
      "quantity": 1,
      "designId": "uuid-of-design"
    }
  ],
  "notes": "Please rush this order"
}
```

### Get My Orders
```http
GET /api/orders
Cookie: [auth cookies from login]
```

### Get Orders by Status
```http
GET /api/orders?status=PENDING
Cookie: [auth cookies from login]
```

### Get Single Order
```http
GET /api/orders/{orderId}
Cookie: [auth cookies from login]
```

### Cancel Order
```http
POST /api/orders/{orderId}/cancel
Cookie: [auth cookies from login]
```

### Update Order Status (Admin Only)
```http
PATCH /api/orders/{orderId}/status
Content-Type: application/json
Cookie: [auth cookies from login]

{
  "status": "PROCESSING"
}
```

**Order Status Options**: 
- PENDING
- PROCESSING
- PRINTING
- COMPLETED
- CANCELLED

## 5. Designs (Requires Authentication)

### Upload Design
```http
POST /api/designs
Content-Type: application/json
Cookie: [auth cookies from login]

{
  "name": "My Logo Design",
  "fileUrl": "https://example.com/uploads/logo.png",
  "fileType": "image/png",
  "fileSize": 102400,
  "thumbnailUrl": "https://example.com/uploads/logo-thumb.png"
}
```

### Get My Designs
```http
GET /api/designs
Cookie: [auth cookies from login]
```

### Get Single Design
```http
GET /api/designs/{designId}
Cookie: [auth cookies from login]
```

### Update Design
```http
PUT /api/designs/{designId}
Content-Type: application/json
Cookie: [auth cookies from login]

{
  "name": "Updated Logo Design"
}
```

### Delete Design
```http
DELETE /api/designs/{designId}
Cookie: [auth cookies from login]
```

## 6. User Profile (Requires Authentication)

### Get My Profile
```http
GET /api/users/profile
Cookie: [auth cookies from login]
```

### Update My Profile
```http
PUT /api/users/profile
Content-Type: application/json
Cookie: [auth cookies from login]

{
  "name": "Jane Smith"
}
```

## 7. User Management (Admin Only)

### Get All Users
```http
GET /api/users
Cookie: [auth cookies from login]
```

### Search Users
```http
GET /api/users?search=john
Cookie: [auth cookies from login]
```

### Filter Users by Role
```http
GET /api/users?role=ADMIN
Cookie: [auth cookies from login]
```

### Get User by ID
```http
GET /api/users/{userId}
Cookie: [auth cookies from login]
```

### Update User Role
```http
PATCH /api/users/{userId}/role
Content-Type: application/json
Cookie: [auth cookies from login]

{
  "role": "ADMIN"
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Testing Workflow

1. **Sign Up** a new user
2. **Sign In** to get authentication cookies
3. **Get Products** (test public endpoints)
4. **Create Order** with some products
5. **Get My Orders** to see the created order
6. **Upload Design** for custom prints
7. **Get My Profile** to verify user data

### To Test Admin Features:

1. Manually update user role in database to 'ADMIN':
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```
2. Sign in again
3. Test admin endpoints (create products, update order status, manage users)

## Using Thunder Client in VS Code

1. Install Thunder Client extension
2. Create a new request
3. Set the method (GET, POST, etc.)
4. Enter the URL
5. Add headers/body as needed
6. Click "Send"

**Pro Tip**: Thunder Client automatically handles cookies from SuperTokens!
