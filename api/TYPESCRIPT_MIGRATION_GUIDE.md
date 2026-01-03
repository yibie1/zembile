# TypeScript Migration Guide

## 🚀 Overview

This guide outlines the migration from JavaScript to TypeScript with a clean, scalable architecture following the **Service-Controller-Entity** pattern.

## 📁 New Project Structure

```
api/
├── src/                     # TypeScript source code
│   ├── controllers/         # Route handlers (HTTP layer)
│   │   ├── UserController.ts
│   │   ├── ProductController.ts
│   │   ├── OrderController.ts
│   │   ├── PaymentController.ts
│   │   └── AdminController.ts
│   ├── services/           # Business logic layer
│   │   ├── UserService.ts
│   │   ├── ProductService.ts
│   │   ├── OrderService.ts
│   │   ├── PaymentService.ts
│   │   └── DatabaseService.ts
│   ├── entities/           # TypeScript interfaces/types
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── Payment.ts
│   ├── models/             # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── Transaction.ts
│   ├── middleware/         # Custom middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/             # Express routes
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── payments.ts
│   │   ├── uploads.ts
│   │   └── admin.ts
│   ├── config/             # Configuration files
│   │   ├── database.ts
│   │   └── environment.ts
│   ├── utils/              # Utility functions
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── types/              # Global type definitions
│   │   └── common.ts
│   └── server.ts           # Main server file
├── dist/                   # Compiled JavaScript (auto-generated)
├── uploads/                # File uploads
├── package.json
├── tsconfig.json
├── nodemon.json
└── .env
```

## 🏗️ Architecture Layers

### 1. **Controllers** (HTTP Layer)
- Handle HTTP requests and responses
- Validate input data
- Call appropriate services
- Format API responses

```typescript
// Example: UserController.ts
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    // Handle registration logic
  };
}
```

### 2. **Services** (Business Logic Layer)
- Contain all business logic
- Interact with database models
- Handle complex operations
- Return structured responses

```typescript
// Example: UserService.ts
export class UserService {
  async createUser(userData: IUserCreate): Promise<ServiceResponse<IUserResponse>> {
    // Business logic for user creation
  }
}
```

### 3. **Entities** (Type Definitions)
- Define TypeScript interfaces
- Ensure type safety
- Document data structures
- Provide input/output types

```typescript
// Example: User.ts
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  // ... other properties
}
```

### 4. **Models** (Database Layer)
- Mongoose schemas with TypeScript
- Database validation
- Indexes and relationships
- Instance and static methods

## 🔧 Migration Steps

### Step 1: Install Dependencies
```bash
cd api
npm install
```

### Step 2: Build TypeScript
```bash
npm run build
```

### Step 3: Run Development Server
```bash
npm run dev
```

### Step 4: Run Production
```bash
npm run build
npm start
```

## 📋 Available Scripts

```json
{
  "dev": "nodemon",                    // Development with hot reload
  "start": "node dist/server.js",     // Production server
  "build": "tsc",                     // Compile TypeScript
  "build:watch": "tsc --watch",       // Watch mode compilation
  "clean": "rm -rf dist"              // Clean compiled files
}
```

## 🎯 Key Benefits

### 1. **Type Safety**
- Catch errors at compile time
- Better IDE support with IntelliSense
- Self-documenting code

### 2. **Clean Architecture**
- Separation of concerns
- Easier testing and maintenance
- Scalable codebase

### 3. **Better Developer Experience**
- Auto-completion
- Refactoring support
- Better debugging

### 4. **Production Ready**
- Compiled JavaScript for production
- Optimized performance
- Error handling and logging

## 🔄 Migration from Existing Code

### Current JavaScript Files → New TypeScript Structure

| Old File | New Location | Purpose |
|----------|--------------|---------|
| `server.js` | `src/server.ts` | Main server with TypeScript |
| `routes/auth.js` | `src/routes/auth.ts` | Auth routes with types |
| `models/User.js` | `src/models/User.ts` | User model with interfaces |
| `services/database.js` | `src/services/DatabaseService.ts` | Database service with types |

### Example Migration: User Authentication

**Before (JavaScript):**
```javascript
// routes/auth.js
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Login logic...
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

**After (TypeScript):**
```typescript
// src/controllers/UserController.ts
login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loginData: IUserLogin = req.body;
    const result = await this.userService.loginUser(loginData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: result.data
    };

    res.status(result.statusCode || HttpStatus.OK).json(response);
  } catch (error) {
    next(error);
  }
};
```

## 🛠️ Development Workflow

### 1. **Create New Feature**
1. Define interfaces in `entities/`
2. Create service in `services/`
3. Create controller in `controllers/`
4. Add routes in `routes/`
5. Update models if needed

### 2. **Type-First Development**
1. Start with TypeScript interfaces
2. Implement business logic in services
3. Create controllers for HTTP handling
4. Add proper error handling

### 3. **Testing Strategy**
- Unit tests for services
- Integration tests for controllers
- Type checking with TypeScript compiler

## 🚨 Important Notes

### Environment Variables
Make sure to set up your `.env` file:
```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/zembile
JWT_SECRET=your-secret-key
CHAPA_SECRET_KEY=your-chapa-key
```

### Path Aliases
The project uses path aliases for cleaner imports:
```typescript
import { UserService } from '@/services/UserService';
import { IUser } from '@/entities/User';
import { authenticate } from '@/middleware/auth';
```

### Error Handling
All errors are handled through a centralized error handler:
```typescript
throw new AppError(
  'User not found',
  HttpStatus.NOT_FOUND,
  ErrorType.NOT_FOUND_ERROR
);
```

## 🎉 Next Steps

1. **Complete Migration**: Move remaining JavaScript files to TypeScript
2. **Add Validation**: Implement request validation middleware
3. **Add Testing**: Set up Jest with TypeScript
4. **Add Documentation**: Generate API docs with Swagger
5. **Add Logging**: Implement structured logging
6. **Add Monitoring**: Add health checks and metrics

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express with TypeScript](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Mongoose with TypeScript](https://mongoosejs.com/docs/typescript.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Ready to migrate?** The new TypeScript structure is set up and ready to use! 🚀