# 🚀 START HERE

Welcome to your NestJS project! This file will guide you through the initial setup and help you understand what you have.

## 📋 What This Project Is

A fully-functional NestJS REST API with:
- **Users, Posts, and Comments** management
- **Role-Based Access Control** (ADMIN, AUTHOR, VIEWER)
- **JWT Authentication** with RSA-256 encryption
- **PostgreSQL** database with migrations
- **Complete API Documentation**

## 🎯 Quick Decision Tree

### I want to...
- **Get the app running quickly?** → Go to [5 Minute Setup](#5-minute-setup-quickstart)
- **Understand the full project?** → Read [QUICKSTART.md](QUICKSTART.md)
- **See API endpoints?** → Check [API.md](API.md)
- **Read everything?** → Start with [README.md](README.md)
- **Verify what's implemented?** → Look at [CHECKLIST.md](CHECKLIST.md)

## ⚡ 5 Minute Setup (Quick Start)

### Prerequisites
- Node.js 16+ (you have it)
- Docker (or PostgreSQL running locally)

### Steps

**1. Install packages:**
```bash
npm install
```

**2. Start PostgreSQL:**
```bash
docker run --name nestjs-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nestjs_example \
  -p 5432:5432 \
  -d postgres:15
```

**3. Run migrations (creates tables + seeds admin):**
```bash
npm run migrate
```

**4. Start the server:**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

**5. Generate admin token for testing:**
```bash
npm run generate:token
```

Copy the token and use in requests:
```bash
curl http://localhost:3000/posts \
  -H "Authorization: Bearer <your-token>"
```

## 📖 Documentation Guide

### For Different Needs

| Need | Document | Time |
|------|----------|------|
| Quick setup | [QUICKSTART.md](QUICKSTART.md) | 5 min |
| Understanding the API | [API.md](API.md) | 15 min |
| Full documentation | [README.md](README.md) | 30 min |
| Project overview | [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | 10 min |
| Feature checklist | [CHECKLIST.md](CHECKLIST.md) | 5 min |
| Full details | [FINAL_SUMMARY.txt](FINAL_SUMMARY.txt) | 10 min |

## 🔐 Default Admin Credentials

```
Email: admin@example.com
Password: admin
```

Use these to login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin"}'
```

## 👥 User Roles

### VIEWER
- Read posts
- Create and manage own comments

### AUTHOR
- Everything VIEWER can do
- Create, update, delete own posts

### ADMIN
- Everything AUTHOR can do
- Manage all posts
- Create, update, delete users

## 🔌 Main API Endpoints

**Authentication:**
- `POST /auth/login` - Login and get JWT token

**Users (Admin only):**
- `POST /users` - Create user
- `GET /users` - List all users
- `GET /users/:id` - Get specific user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

**Posts:**
- `POST /posts` - Create post
- `GET /posts` - List posts (public)
- `GET /posts/:id` - Get post (public)
- `PUT /posts/:id` - Update own post
- `DELETE /posts/:id` - Delete own post

**Comments:**
- `POST /posts/:postId/comments` - Create comment
- `GET /posts/:postId/comments` - List comments
- `PUT /posts/:postId/comments/:id` - Update own comment
- `DELETE /posts/:postId/comments/:id` - Delete own comment

## 📝 Project Structure

```
src/
├── controllers/     - HTTP handlers (4 files)
├── services/        - Business logic (4 files)
├── entities/        - Database models (3 files)
├── dtos/           - Input validation (4 files)
├── guards/         - Auth guards (2 files)
├── config/         - Configuration (2 files)
└── migrations/     - Database migrations (4 files)

keys/               - RSA keys for JWT
scripts/            - Utility scripts
```

## 🛠️ Available Commands

```bash
npm run dev              # Start with auto-reload
npm run start            # Start production build
npm run build            # Compile TypeScript
npm run migrate          # Run migrations
npm run migrate:down     # Undo last migration
npm run generate:token   # Generate admin JWT token
```

## 🔑 Important Files

- **README.md** - Complete documentation with examples
- **QUICKSTART.md** - Quick start guide
- **API.md** - Complete API reference
- **package.json** - Dependencies and scripts
- **.env** - Configuration (copy from .env.example)
- **database.json** - Migration settings

## 💡 Example Workflow

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Generate admin token:**
   ```bash
   npm run generate:token
   ```

3. **Create a new user (AUTHOR):**
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

4. **Author creates a post:**
   ```bash
   curl -X POST http://localhost:3000/posts \
     -H "Authorization: Bearer <author-token>" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "My Article",
       "content": "Content here..."
     }'
   ```

5. **View the post (no auth needed):**
   ```bash
   curl http://localhost:3000/posts
   ```

## ❓ Frequently Asked Questions

**Q: Where's the database?**
A: PostgreSQL runs in Docker. Start it with the command in step 2 of Quick Setup.

**Q: How do I stop PostgreSQL?**
A: `docker stop nestjs-postgres && docker rm nestjs-postgres`

**Q: Can I run PostgreSQL locally instead of Docker?**
A: Yes! Create a database named `nestjs_example` and update `.env` with your credentials.

**Q: How do I test the API?**
A: Generate a token with `npm run generate:token` and use it in the `Authorization: Bearer <token>` header.

**Q: Can I modify the default admin password?**
A: You can change it after login, or edit the migration and re-run it.

**Q: What's the JWT signing algorithm?**
A: RS256 (RSA-256). Keys are in the `keys/` folder.

## 🚨 Common Issues

**"Error: Cannot find module"**
→ Run `npm install`

**"Database connection error"**
→ Ensure PostgreSQL is running and credentials in `.env` match

**"Port 3000 already in use"**
→ Change PORT in `.env` or kill the process using port 3000

**"Migration error"**
→ Ensure database exists and is empty, or check credentials

## 📚 Next Steps

1. ✅ Run Quick Setup above
2. ✅ Read [QUICKSTART.md](QUICKSTART.md)
3. ✅ Check [API.md](API.md) for all endpoints
4. ✅ Read [README.md](README.md) for full documentation
5. ✅ Start building!

## 🎓 Learning Resources

This project demonstrates:
- NestJS architecture and best practices
- JWT authentication with asymmetric encryption
- Role-based access control implementation
- TypeORM database relationships
- Database migrations with db-migrate
- Input validation with class-validator
- Error handling and HTTP status codes

Each file includes comments explaining the patterns used.

---

**Ready to get started?** Run the 5 commands in the Quick Setup section above!

For detailed information, check [QUICKSTART.md](QUICKSTART.md) or [README.md](README.md).
