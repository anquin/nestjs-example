# API Reference

## Base URL
```
http://localhost:3000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin"
}
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "user": {
    "id": "62c119ea-abdd-4e1b-8c64-7979fdcfb29e",
    "email": "admin@example.com",
    "roles": ["ADMIN"],
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## Users (Admin Only)

### Create User
```http
POST /users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "email": "author@example.com",
  "password": "secure123",
  "roles": ["AUTHOR"]
}
```

**Roles**: `["ADMIN"]`, `["AUTHOR"]`, `["VIEWER"]`, or multiple

**Response** (201 Created):
```json
{
  "id": "uuid",
  "email": "author@example.com",
  "roles": ["AUTHOR"],
  "created_at": "2025-01-01T12:00:00.000Z",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

### Get All Users
```http
GET /users
Authorization: Bearer <admin_token>
```

**Response** (200 OK):
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "roles": ["VIEWER"],
    "created_at": "2025-01-01T12:00:00.000Z",
    "updated_at": "2025-01-01T12:00:00.000Z"
  }
]
```

### Get User by ID
```http
GET /users/:id
Authorization: Bearer <admin_token>
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "roles": ["VIEWER"],
  "created_at": "2025-01-01T12:00:00.000Z",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

### Update User Roles
```http
PUT /users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "roles": ["AUTHOR", "ADMIN"]
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "roles": ["AUTHOR", "ADMIN"],
  "created_at": "2025-01-01T12:00:00.000Z",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

### Delete User
```http
DELETE /users/:id
Authorization: Bearer <admin_token>
```

**Response** (200 OK): (no body)

---

## Posts

### Create Post
**Required Roles**: AUTHOR, ADMIN

```http
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Article Title",
  "content": "This is the detailed content of my article. It should be at least 10 characters."
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "My Article Title",
  "content": "This is the detailed content...",
  "created_at": "2025-01-01T12:00:00.000Z",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

### Get All Posts (Paginated)
```http
GET /posts?page=1&limit=10
```

**Query Parameters**:
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Article Title",
      "content": "Article content...",
      "created_at": "2025-01-01T12:00:00.000Z",
      "updated_at": "2025-01-01T12:00:00.000Z"
    }
  ],
  "total": 42
}
```

### Get Post by ID
```http
GET /posts/:id
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "Article Title",
  "content": "Article content...",
  "created_at": "2025-01-01T12:00:00.000Z",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

### Update Post
**Required Roles**: AUTHOR (own posts), ADMIN (any post)

```http
PUT /posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "Updated Title",
  "content": "Updated content...",
  "created_at": "2025-01-01T12:00:00.000Z",
  "updated_at": "2025-01-01T12:30:00.000Z"
}
```

### Delete Post
**Required Roles**: AUTHOR (own posts), ADMIN (any post)

```http
DELETE /posts/:id
Authorization: Bearer <token>
```

**Response** (200 OK): (no body)

---

## Comments

### Create Comment
**Required Roles**: VIEWER, AUTHOR, ADMIN

```http
POST /posts/:postId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great article! Very informative."
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "post_id": "uuid",
  "user_id": "uuid",
  "content": "Great article! Very informative.",
  "created_at": "2025-01-01T12:00:00.000Z",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

### Get Comments for Post (Paginated)
```http
GET /posts/:postId/comments?page=1&limit=10
```

**Query Parameters**:
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid",
      "post_id": "uuid",
      "user_id": "uuid",
      "content": "Comment text...",
      "created_at": "2025-01-01T12:00:00.000Z",
      "updated_at": "2025-01-01T12:00:00.000Z"
    }
  ],
  "total": 5
}
```

### Get Comment by ID
```http
GET /posts/:postId/comments/:id
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "post_id": "uuid",
  "user_id": "uuid",
  "content": "Comment text...",
  "created_at": "2025-01-01T12:00:00.000Z",
  "updated_at": "2025-01-01T12:00:00.000Z"
}
```

### Update Comment
**Required Roles**: VIEWER, AUTHOR, ADMIN (own comments only)

```http
PUT /posts/:postId/comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment text..."
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "post_id": "uuid",
  "user_id": "uuid",
  "content": "Updated comment text...",
  "created_at": "2025-01-01T12:00:00.000Z",
  "updated_at": "2025-01-01T12:30:00.000Z"
}
```

### Delete Comment
**Required Roles**: VIEWER, AUTHOR, ADMIN (own comments only)

```http
DELETE /posts/:postId/comments/:id
Authorization: Bearer <token>
```

**Response** (200 OK): (no body)

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Post not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

---

## Useful cURL Examples

### Generate Admin Token
```bash
npm run generate:token
```

### Login as Admin
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin"
  }' | jq -r '.access_token'
```

### Get All Users (as Admin)
```bash
TOKEN="your_admin_token"
curl http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Create Post (as Author)
```bash
TOKEN="your_author_token"
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Post",
    "content": "This is my post content"
  }' | jq '.'
```

### Add Comment to Post
```bash
TOKEN="your_user_token"
POST_ID="post_uuid"
curl -X POST http://localhost:3000/posts/$POST_ID/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great post!"
  }' | jq '.'
```
