import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from '@/config/database';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { EnvConfig } from '@/types/common';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import productRoutes from '@/routes/products';
import orderRoutes from '@/routes/orders';
import paymentRoutes from '@/routes/payments';
import uploadRoutes from '@/routes/uploads';
import adminRoutes from '@/routes/admin';

// Load environment variables
dotenv.config();

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '4000', 10);
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    }));

    // CORS configuration
    const corsOptions = {
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_URL || 'http://localhost:3000'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    };
    this.app.use(cors(corsOptions));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        error: 'Rate limit exceeded'
      },
      standardHeaders: true,
      legacyHeaders: false
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Static files
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // Request logging in development
    if (process.env.NODE_ENV === 'development') {
      this.app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
      });
    }
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Zembile API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '2.0.0'
      });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/products', productRoutes);
    this.app.use('/api/orders', orderRoutes);
    this.app.use('/api/payments', paymentRoutes);
    this.app.use('/api/uploads', uploadRoutes);
    this.app.use('/api/admin', adminRoutes);

    // API documentation endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        success: true,
        message: 'Zembile API v2.0.0',
        documentation: {
          auth: '/api/auth - Authentication endpoints',
          users: '/api/users - User management',
          products: '/api/products - Product catalog',
          orders: '/api/orders - Order management',
          payments: '/api/payments - Payment processing',
          uploads: '/api/uploads - File uploads',
          admin: '/api/admin - Admin operations'
        },
        endpoints: {
          health: '/health - Health check',
          docs: '/api - This documentation'
        }
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler for undefined routes
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  private validateEnvironment(): void {
    const requiredEnvVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'CHAPA_SECRET_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      console.error('Missing required environment variables:', missingVars);
      process.exit(1);
    }
  }

  public async start(): Promise<void> {
    try {
      // Validate environment variables
      this.validateEnvironment();

      // Try to connect to database, but don't fail if it's unavailable
      try {
        await connectDatabase();
        console.log('✅ Database connected successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn('⚠️  Database connection failed, falling back to mock data:', errorMessage);
        console.log('🔄 Server will continue with mock data functionality');
      }

      // Start server
      this.app.listen(this.port, () => {
        console.log(`
🚀 Zembile API Server Started Successfully!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server: http://localhost:${this.port}
📚 API Docs: http://localhost:${this.port}/api
❤️  Health Check: http://localhost:${this.port}/health
🕐 Started at: ${new Date().toISOString()}
        `);
      });

      // Graceful shutdown
      process.on('SIGTERM', this.gracefulShutdown);
      process.on('SIGINT', this.gracefulShutdown);

    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private gracefulShutdown = (signal: string): void => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    
    // Close server
    process.exit(0);
  };
}

// Start the server
const server = new Server();
server.start().catch(error => {
  console.error('Server startup failed:', error);
  process.exit(1);
});