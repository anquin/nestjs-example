# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 16+ 
- Docker (optional, for PostgreSQL)
- PostgreSQL 12+ (or use Docker)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up PostgreSQL

**Using Docker (Recommended)**:
```bash
docker run --name nestjs-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nestjs_example \
  -p 5432:5432 \
  -d postgres:15
```

**Or use local PostgreSQL**:
```bash
psql -U postgres -c "CREATE DATABASE nestjs_example;"
```

### Step 3: Run Migrations
```bash
npm run migrate
```

This creates all tables and seeds the admin user.

### Step 4: Start the App
```bash
npm run dev
```

The API is now running on http://localhost:3000

### Step 5: Generate Admin Token (for testing)
```bash
npm run generate:token
```

Copy the generated token and use it in requests:
```bash
curl http://localhost:3000/users \
  -H "Authorization: Bearer <your-token>"
```

## Available Commands

```bash
npm run dev              # Start in development mode with auto-reload
npm run build            # Build TypeScript to JavaScript
npm run migrate          # Run database migrations
npm run migrate:down     # Rollback last migration
npm run generate:token   # Generate admin JWT token for testing
```

## Default Admin Credentials
- Email: `admin@example.com`
- Password: `admin`

## Example API Calls

### 1. Login with Admin
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin"
  }'
```

### 2. Create a New User
```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@example.com",
    "password": "password123",
    "roles": ["AUTHOR"]
  }'
```

### 3. Create a Post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer <author-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my post."
  }'
```

### 4. Get All Posts
```bash
curl http://localhost:3000/posts
```

### 5. Add a Comment
```bash
curl -X POST http://localhost:3000/posts/<post-id>/comments \
  -H "Authorization: Bearer <user-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great post!"
  }'
```

## Stopping PostgreSQL Container
```bash
docker stop nestjs-postgres
docker rm nestjs-postgres
```

## Need Help?

Refer to the full README.md for:
- Complete API documentation
- Detailed role permissions
- Project structure explanation
- Troubleshooting guide
- Advanced configuration options
