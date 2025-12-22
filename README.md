# NestJS Example - Users, Posts & Comments API

A comprehensive NestJS application with role-based access control (RBAC), JWT authentication, and full CRUD operations for Users, Posts, and Comments.

## Features

- **Authentication**: JWT-based authentication using RSA key pairs
- **Authorization**: Role-based access control (ADMIN, AUTHOR, VIEWER)
- **Entities**:
  - **Users**: ADMIN, AUTHOR, VIEWER roles
  - **Posts**: Create, read, update, delete operations with author ownership
  - **Comments**: Create, read, update, delete on posts with user ownership
- **Database**: PostgreSQL with TypeORM ORM
- **Migrations**: Database schema management with db-migrate
- **Input Validation**: Class-based validation with decorators

## User Roles & Permissions

### VIEWER
- Read all posts
- Create and manage their own comments
- Update and delete their own comments

### AUTHOR
- All VIEWER permissions
- Create new posts
- Update and delete their own posts
- Manage comments on their posts (implicitly via ownership)

### ADMIN
- Full access to all operations
- Create, read, update, delete users
- Create, read, update, delete all posts
- Create, read, update, delete all comments

## Prerequisites

- Node.js >= 16.x
- npm >= 8.x
- PostgreSQL >= 12.x (or Docker to run a PostgreSQL container)
- OpenSSL (usually pre-installed on macOS/Linux, included in Node.js on Windows)

## Installation

1. **Clone and navigate to the project**:
   ```bash
   cd /home/andre/git/nestjs-example
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   The `.env` file includes:
   - Database connection details
   - JWT expiration time
   - Admin credentials (default: `admin@example.com` / `admin`)

## Database Setup

### Option 1: Using Docker (Recommended for Development)

Run a PostgreSQL container with Docker:

```bash
docker run --name nestjs-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nestjs_example \
  -p 5432:5432 \
  -d postgres:15
```

To stop and remove the container:
```bash
docker stop nestjs-postgres
docker rm nestjs-postgres
```

### Option 2: Local PostgreSQL Installation

Ensure PostgreSQL is running locally and create the database:

```bash
psql -U postgres -c "CREATE DATABASE nestjs_example;"
```

## Running the Application

### 1. Run Database Migrations

Before starting the application, run the migrations to create tables and seed the admin user:

```bash
npm run migrate
```

This will:
- Create the `users` table
- Create the `posts` table
- Create the `comments` table
- Seed the admin user with email `admin@example.com` and password `admin`

### 2. Start the Application

**Development mode (with auto-reload)**:
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
node dist/main.js
```

The application will start on `http://localhost:3000` (or the port specified in `.env`)

## API Endpoints

### Authentication

**Login**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin"
}
```

Returns:
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "62c119ea-abdd-4e1b-8c64-7979fdcfb29e",
    "email": "admin@example.com",
    "roles": ["ADMIN"],
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

### Users (Admin Only)

```bash
# Create user
POST /users
Authorization: Bearer <token>

# Get all users
GET /users
Authorization: Bearer <token>

# Get user by ID
GET /users/:id
Authorization: Bearer <token>

# Update user roles
PUT /users/:id
Authorization: Bearer <token>

# Delete user
DELETE /users/:id
Authorization: Bearer <token>
```

### Posts

```bash
# Create post (AUTHOR, ADMIN)
POST /posts
Authorization: Bearer <token>

# Get all posts (paginated)
GET /posts?page=1&limit=10

# Get post by ID
GET /posts/:id

# Update post (AUTHOR, ADMIN - own posts only)
PUT /posts/:id
Authorization: Bearer <token>

# Delete post (AUTHOR, ADMIN - own posts only)
DELETE /posts/:id
Authorization: Bearer <token>
```

### Comments

```bash
# Create comment (VIEWER, AUTHOR, ADMIN)
POST /posts/:postId/comments
Authorization: Bearer <token>

# Get comments for a post
GET /posts/:postId/comments?page=1&limit=10

# Get comment by ID
GET /posts/:postId/comments/:id

# Update comment (own comments only)
PUT /posts/:postId/comments/:id
Authorization: Bearer <token>

# Delete comment (own comments only)
DELETE /posts/:postId/comments/:id
Authorization: Bearer <token>
```

## JWT Token Generation for Testing

To generate a JWT token for the admin user without logging in (useful for local testing):

```bash
npm run generate:token
```

This outputs an admin token that can be used in the `Authorization: Bearer <token>` header.

### Example Usage with Generated Token

```bash
TOKEN=$(node scripts/generate-admin-jwt.js | grep -A1 "Token:" | tail -1 | tr -d '\n')

curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"
```

Or manually using the generated token:

```bash
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post."
  }'
```

## Example Workflows

### 1. Admin Creating a New User

```bash
# Generate admin token
npm run generate:token  # Copy the token

# Create a new AUTHOR user
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@example.com",
    "password": "secure123",
    "roles": ["AUTHOR"]
  }'
```

### 2. Author Creating and Managing Posts

```bash
# Login as author
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@example.com",
    "password": "secure123"
  }'

# Use the returned access_token to create a post
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer <author-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Article",
    "content": "Detailed article content here."
  }'
```

### 3. Viewer Reading Posts and Commenting

```bash
# Login as viewer
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "viewer@example.com",
    "password": "secure123"
  }'

# Get all posts (no auth required)
curl http://localhost:3000/posts

# Create a comment on a post
curl -X POST http://localhost:3000/posts/<post-id>/comments \
  -H "Authorization: Bearer <viewer-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great article!"
  }'
```

## Project Structure

```
nestjs-example/
├── src/
│   ├── controllers/        # HTTP request handlers
│   ├── services/          # Business logic
│   ├── entities/          # TypeORM entities
│   ├── dtos/              # Data transfer objects
│   ├── guards/            # Authentication & authorization guards
│   ├── decorators/        # Custom decorators (roles, etc)
│   ├── config/            # Configuration files
│   ├── migrations/        # Database migrations
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── scripts/
│   └── generate-admin-jwt.js  # JWT token generation script
├── keys/
│   ├── jwt.private.key    # RSA private key for signing JWTs
│   └── jwt.public.key     # RSA public key for verifying JWTs
├── database.json          # db-migrate configuration
├── .env.example           # Environment variables template
├── .env                   # Environment variables (local)
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Configuration

### Environment Variables

Edit `.env` to configure:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nestjs_example

# JWT
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRATION=1h

# Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin
```

## Database Migrations

Create a new migration:
```bash
npm run migrate:create <migration-name>
```

Run migrations:
```bash
npm run migrate
```

Rollback last migration:
```bash
npm run migrate:down
```

## Building for Production

```bash
npm run build
```

This creates a `dist/` folder with compiled JavaScript. Run with:
```bash
node dist/main.js
```

## JWT Token Structure

Tokens include the following claims:

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "roles": ["ADMIN", "AUTHOR"],
  "iat": 1704067200
}
```

- `sub`: Subject (user ID)
- `email`: User's email
- `roles`: Array of user roles
- `iat`: Issued at timestamp

Tokens are signed with RS256 (RSA SHA-256) using key pairs stored in the `keys/` folder.

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

## Troubleshooting

### PostgreSQL Connection Issues

If you get a connection error:
1. Verify PostgreSQL is running
2. Check database credentials in `.env`
3. Ensure the database exists: `psql -U postgres -l`
4. Create the database if missing: `psql -U postgres -c "CREATE DATABASE nestjs_example;"`

### Migration Errors

If migrations fail:
1. Ensure the database is empty or matches the schema
2. Check database credentials in `database.json`
3. Verify the `src/migrations/` folder contains migration files

### JWT Token Errors

If you get JWT verification errors:
1. Verify the `keys/` folder exists with both private and public keys
2. Ensure tokens are sent with `Authorization: Bearer <token>` header
3. Check token expiration time in `.env`

## License

ISC
