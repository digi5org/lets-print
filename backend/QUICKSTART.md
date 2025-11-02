# 🚀 Quick Start Guide - LetsPrint Backend

## Prerequisites Checklist

- ✅ Node.js (v16+) installed
- ✅ MySQL (v8+) installed OR Docker installed
- ✅ npm installed

## Setup Steps

### Step 1: Install Dependencies ✅ (Already Done)

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

The `.env` file has been created. Update the `DATABASE_URL` based on your MySQL setup:

**Option A: Local MySQL**
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/lets_print_db"
```

**Option B: Docker MySQL (Recommended)**
```env
DATABASE_URL="mysql://letsprintuser:letsprintpass123@localhost:3306/lets_print_db"
```

### Step 3: Start MySQL Database

**If using Docker (Recommended):**
```bash
# Start MySQL container
docker-compose up -d

# Check if running
docker ps
```

**If using local MySQL:**
- Ensure MySQL service is running
- Create database:
  ```sql
  CREATE DATABASE lets_print_db;
  ```

### Step 4: Run Database Migrations

```bash
# Generate Prisma Client (Already done ✅)
npm run db:generate

# Run migrations to create tables
npm run migrate
```

When prompted, enter a name for the migration (e.g., "init" or "initial_schema").

### Step 5: Seed the Database (Optional)

```bash
# Add sample products
npm run db:seed
```

### Step 6: Start the Development Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server is running on port 5000
📝 Environment: development
🔗 API: http://localhost:5000
🔐 Auth: http://localhost:5000/auth
```

## Testing the API

### 1. Health Check

Open browser or use curl:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-02T..."
}
```

### 2. Test Authentication

**Sign Up:**
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "formFields": [
      {"id": "email", "value": "test@example.com"},
      {"id": "password", "value": "password123"},
      {"id": "name", "value": "Test User"}
    ]
  }'
```

**Sign In:**
```bash
curl -X POST http://localhost:5000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "formFields": [
      {"id": "email", "value": "test@example.com"},
      {"id": "password", "value": "password123"}
    ]
  }' \
  -c cookies.txt
```

### 3. Test Products API

```bash
# Get all products (no auth required)
curl http://localhost:5000/api/products
```

### 4. Test Authenticated Endpoints

```bash
# Get user profile (requires auth)
curl http://localhost:5000/api/users/profile \
  -b cookies.txt
```

## Using Thunder Client (Recommended)

1. Install **Thunder Client** extension in VS Code
2. Open Thunder Client
3. Import the examples from `API_TESTING.md`
4. Start making requests!

## Project Structure

```
backend/
├── src/
│   ├── config/              # App configuration
│   │   ├── database.js      # Prisma client
│   │   └── supertokens.js   # Auth config
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Custom middleware
│   ├── routes/              # API routes
│   ├── validators/          # Input validation
│   ├── prisma/
│   │   └── seed.js          # Database seeding
│   └── server.js            # App entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── .env                     # Environment variables
├── package.json
└── docker-compose.yml       # MySQL Docker setup
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm start` | Start production server |
| `npm run migrate` | Run database migrations |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (Database GUI) |

## Next Steps

1. ✅ Backend is running
2. 📖 Read `API_TESTING.md` for detailed API examples
3. 🗄️ Run `npm run db:studio` to view database in GUI
4. 🧪 Test endpoints with Thunder Client
5. 👥 Create admin user (see below)

## Creating an Admin User

1. Sign up a regular user via `/auth/signup`
2. Update role in database:
   - Open Prisma Studio: `npm run db:studio`
   - Find your user in the `users` table
   - Change `role` from `USER` to `ADMIN`
   - Save

3. Sign in again to get admin privileges

## Troubleshooting

### Error: Can't reach database server
- Check if MySQL is running: `docker ps` or check MySQL service
- Verify DATABASE_URL in `.env`

### Error: P1001 (Can't reach database)
- Ensure database name exists: `lets_print_db`
- Check MySQL port (default: 3306)

### Error: Port 5000 already in use
- Change PORT in `.env` file
- Or kill the process using port 5000

### Migration failed
- Reset database: `npx prisma migrate reset`
- Run migrations again: `npm run migrate`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | MySQL connection string | Required |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| SUPERTOKENS_CONNECTION_URI | SuperTokens URI | https://try.supertokens.com |
| API_DOMAIN | API URL | http://localhost:5000 |
| WEBSITE_DOMAIN | Frontend URL | http://localhost:3000 |
| ALLOWED_ORIGINS | CORS origins | http://localhost:3000 |

## SuperTokens Dashboard

Access SuperTokens dashboard at: `http://localhost:5000/auth/dashboard`

## Support

- 📖 See `README_API.md` for detailed API documentation
- 🗄️ See `DATABASE_SETUP.md` for database configuration
- 🧪 See `API_TESTING.md` for testing examples

## Success! 🎉

Your backend is now ready. Start building your frontend or test the API endpoints!
