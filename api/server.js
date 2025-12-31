const express = require('express')
const cors = require('cors')
const path = require('path')

const payments = require('./routes/payments')
const uploads = require('./routes/uploads')
const auth = require('./routes/auth')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', auth) // Authentication routes
app.use('/api', payments) // Mount payment routes directly under /api
app.use('/api/uploads', uploads)

// Health check
app.get('/', (req, res) => res.json({ 
  name: 'Zembile API', 
  version: '1.0.0',
  status: 'running',
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
    create_order: 'POST /api/orders',
    get_order: 'GET /api/orders/:orderId',
    payment_proof: 'POST /api/payment-proof',
    
    // Upload endpoints
    upload_payment_proof: 'POST /api/uploads/payment-proof',
    upload_legacy: 'POST /api/uploads'
  }
}))

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error)
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size is 5MB.'
      })
    }
  }
  
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 Zembile API running on port ${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}`)
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`)
  console.log(`💳 Payment endpoints: http://localhost:${PORT}/api/*`)
  console.log(`📤 Upload endpoints: http://localhost:${PORT}/api/uploads/*`)
})
