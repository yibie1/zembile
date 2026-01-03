const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')
require('dotenv').config()

// Database connection
const connectDB = require('./config/database')
const DatabaseService = require('./services/database')

// Routes
const payments = require('./routes/payments')
const uploads = require('./routes/uploads')
const auth = require('./routes/auth')
const admin = require('./routes/admin')

const app = express()

// Initialize database connection
const initializeDatabase = async () => {
  const isConnected = await connectDB()
  if (isConnected !== false) {
    // Seed default users if using MongoDB
    await DatabaseService.seedDefaultUsers()
  }
}

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
})
app.use('/api/', limiter)

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
})
app.use('/api/auth/', authLimiter)

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001', // Admin panel
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', auth) // Authentication routes
app.use('/api/admin', admin) // Admin routes
app.use('/api', payments) // Payment routes
app.use('/api/uploads', uploads) // Upload routes

// Health check
app.get('/', (req, res) => res.json({ 
  name: 'Zembile API', 
  version: '1.0.0',
  status: 'running',
  environment: process.env.NODE_ENV || 'development',
  database: DatabaseService.isUsingMongoDB() ? 'MongoDB' : 'Mock Data',
  timestamp: new Date().toISOString(),
  endpoints: {
    // Auth endpoints
    signup: 'POST /api/auth/signup',
    login: 'POST /api/auth/login',
    verify_token: 'GET /api/auth/verify',
    forgot_password: 'POST /api/auth/forgot-password',
    reset_password: 'POST /api/auth/reset-password',
    profile: 'GET /api/auth/profile',
    update_profile: 'PUT /api/auth/profile',
    change_password: 'POST /api/auth/change-password',
    logout: 'POST /api/auth/logout',
    
    // Payment endpoints
    chapa_initialize: 'POST /api/chapa/initialize',
    chapa_callback: 'POST /api/chapa/callback',
    chapa_verify: 'GET /api/chapa/verify/:tx_ref',
    create_order: 'POST /api/orders',
    get_order: 'GET /api/orders/:orderId',
    payment_proof: 'POST /api/payment-proof',
    
    // Upload endpoints
    upload_payment_proof: 'POST /api/uploads/payment-proof',
    upload_legacy: 'POST /api/uploads',
    
    // Admin endpoints
    admin_dashboard: 'GET /api/admin/dashboard',
    admin_orders: 'GET /api/admin/orders',
    admin_payment_proofs: 'GET /api/admin/payment-proofs',
    admin_verify_proof: 'POST /api/admin/payment-proofs/:proofId/verify'
  }
}))

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.originalUrl
  })
})

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error)
  
  // Mongoose validation errors
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message)
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors
    })
  }
  
  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    return res.status(400).json({
      status: 'error',
      message: `${field} already exists`
    })
  }
  
  // Mongoose cast error
  if (error.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format'
    })
  }
  
  // Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'error',
      message: 'File too large. Maximum size is 5MB.'
    })
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      status: 'error',
      message: 'Too many files. Maximum is 1 file per upload.'
    })
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    })
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    })
  }
  
  // Default error
  res.status(error.status || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message || 'Internal server error'
  })
})

const PORT = process.env.PORT || 4000

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase()
    
    app.listen(PORT, () => {
      console.log(`🚀 Zembile API running on port ${PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🗄️  Database: ${DatabaseService.isUsingMongoDB() ? 'MongoDB Connected' : 'Mock Data Mode'}`)
      console.log(`📋 Health check: http://localhost:${PORT}`)
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`)
      console.log(`💳 Payment endpoints: http://localhost:${PORT}/api/*`)
      console.log(`📤 Upload endpoints: http://localhost:${PORT}/api/uploads/*`)
      console.log(`👨‍💼 Admin endpoints: http://localhost:${PORT}/api/admin/*`)
      
      if (!process.env.CHAPA_SECRET_KEY) {
        console.warn('⚠️  CHAPA_SECRET_KEY not set - Chapa payments will use mock mode')
      }
      
      if (!process.env.JWT_SECRET) {
        console.warn('⚠️  JWT_SECRET not set - Using default secret (change in production!)')
      }

      if (!process.env.MONGODB_URI && process.env.NODE_ENV !== 'development') {
        console.warn('⚠️  MONGODB_URI not set - Using mock data')
      }
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
