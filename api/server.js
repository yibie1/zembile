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
const products = require('./routes/products')
const categories = require('./routes/categories')
const analytics = require('./routes/analytics')

const app = express()

// Seed categories and sample products
const seedCatalog = async () => {
  const Category = require('./models/Category')
  const Product = require('./models/Product')

  const catCount = await Category.countDocuments()
  if (catCount === 0) {
    const defaultCategories = [
      { name: 'Coffee', slug: 'coffee', icon: '☕', description: 'Premium Ethiopian coffee beans and blends', sortOrder: 1,
        subcategories: [{ name: 'Single Origin', slug: 'single-origin', description: 'Pure single-farm beans' }, { name: 'Blends', slug: 'blends', description: 'Expertly crafted blends' }, { name: 'Roasted', slug: 'roasted', description: 'Ready to brew' }] },
      { name: 'Food & Spices', slug: 'food', icon: '🌶️', description: 'Authentic Ethiopian spices and food products', sortOrder: 2,
        subcategories: [{ name: 'Spices & Seasonings', slug: 'spices-seasonings', description: 'Traditional spice blends' }, { name: 'Grains & Cereals', slug: 'grains', description: 'Teff, barley and more' }, { name: 'Honey & Preserves', slug: 'honey', description: 'Natural Ethiopian honey' }] },
      { name: 'Fashion', slug: 'fashion', icon: '👗', description: 'Traditional and modern Ethiopian clothing', sortOrder: 3,
        subcategories: [{ name: 'Traditional Clothing', slug: 'traditional-clothing', description: 'Habesha kemis and more' }, { name: 'Modern Wear', slug: 'modern-wear', description: 'Contemporary Ethiopian fashion' }, { name: 'Accessories', slug: 'accessories', description: 'Scarves, belts and more' }] },
      { name: 'Home & Decor', slug: 'home', icon: '🏠', description: 'Ethiopian home decor and furnishings', sortOrder: 4,
        subcategories: [{ name: 'Baskets & Storage', slug: 'baskets-storage', description: 'Handwoven baskets' }, { name: 'Pottery & Ceramics', slug: 'pottery-ceramics', description: 'Traditional clay items' }, { name: 'Textiles', slug: 'textiles', description: 'Woven fabrics and rugs' }] },
      { name: 'Beauty & Wellness', slug: 'beauty', icon: '✨', description: 'Natural Ethiopian beauty products', sortOrder: 5,
        subcategories: [{ name: 'Skincare', slug: 'skincare', description: 'Natural skin care' }, { name: 'Hair Care', slug: 'hair-care', description: 'Traditional hair treatments' }, { name: 'Essential Oils', slug: 'essential-oils', description: 'Pure Ethiopian oils' }] },
      { name: 'Art & Crafts', slug: 'crafts', icon: '🎨', description: 'Handmade Ethiopian art and crafts', sortOrder: 6,
        subcategories: [{ name: 'Paintings', slug: 'paintings', description: 'Ethiopian art' }, { name: 'Jewelry', slug: 'jewelry', description: 'Handcrafted jewelry' }, { name: 'Sculptures', slug: 'sculptures', description: 'Traditional sculptures' }] }
    ]
    await Category.insertMany(defaultCategories)
    console.log('✅ Default categories seeded')
  }

  const prodCount = await Product.countDocuments()
  if (prodCount === 0) {
    const sampleProducts = [
      { name: 'Yirgacheffe Single Origin Coffee', slug: 'yirgacheffe-single-origin-coffee', description: 'Premium single-origin coffee from the Yirgacheffe region, known for its bright acidity and floral notes. Hand-picked and sun-dried for exceptional quality.', shortDescription: 'Premium Yirgacheffe coffee with floral notes', category: 'coffee', subcategory: 'single-origin', brand: 'Zembile Coffee', sku: 'COF-001', price: 450, originalPrice: 500, discount: 10, images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80'], thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&q=80', stock: 50, rating: 4.8, reviewCount: 124, soldCount: 340, isFeatured: true, isNewArrival: false, tags: ['coffee', 'yirgacheffe', 'single-origin', 'premium'], origin: 'Yirgacheffe, Ethiopia' },
      { name: 'Berbere Spice Blend', slug: 'berbere-spice-blend', description: 'Authentic Ethiopian berbere spice blend made from over 15 hand-selected spices. Perfect for traditional dishes like doro wat and tibs.', shortDescription: 'Traditional Ethiopian spice blend', category: 'food', subcategory: 'spices-seasonings', brand: 'Zembile Spices', sku: 'SPE-001', price: 180, stock: 100, rating: 4.9, reviewCount: 89, soldCount: 520, isFeatured: true, isNewArrival: false, images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80'], thumbnail: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80', tags: ['spices', 'berbere', 'traditional', 'cooking'], origin: 'Addis Ababa, Ethiopia' },
      { name: 'Habesha Kemis (Traditional Dress)', slug: 'habesha-kemis-traditional-dress', description: 'Beautiful traditional Ethiopian dress with intricate hand-embroidered borders. Made from 100% cotton with traditional Habesha patterns. Available in multiple sizes.', shortDescription: 'Traditional Ethiopian dress with embroidery', category: 'fashion', subcategory: 'traditional-clothing', brand: 'Zembile Fashion', sku: 'FAH-001', price: 2500, originalPrice: 3000, discount: 17, images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=600&q=80'], thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=300&q=80', stock: 25, rating: 4.7, reviewCount: 56, soldCount: 180, isFeatured: true, isNewArrival: false, variants: [{ name: 'Size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }], tags: ['dress', 'traditional', 'habesha', 'cotton'], origin: 'Addis Ababa, Ethiopia' },
      { name: 'Handwoven Mesob Basket', slug: 'handwoven-mesob-basket', description: 'Traditional Ethiopian mesob basket handwoven by skilled artisans using natural grass and colorful threads. Used for serving injera and as decorative pieces.', shortDescription: 'Traditional handwoven Ethiopian basket', category: 'home', subcategory: 'baskets-storage', brand: 'Zembile Crafts', sku: 'HOM-001', price: 650, stock: 30, rating: 4.6, reviewCount: 43, soldCount: 95, isFeatured: false, isNewArrival: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80'], thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80', tags: ['basket', 'handwoven', 'traditional', 'decor'], origin: 'Oromia, Ethiopia' },
      { name: 'Ethiopian Honey (Raw & Unfiltered)', slug: 'ethiopian-honey-raw-unfiltered', description: 'Pure raw honey from the highlands of Ethiopia. Collected from wild bees in pristine forests, this honey has unique floral notes and exceptional health benefits.', shortDescription: 'Pure raw Ethiopian highland honey', category: 'food', subcategory: 'honey', brand: 'Zembile Natural', sku: 'FOD-002', price: 320, stock: 75, rating: 4.9, reviewCount: 201, soldCount: 680, isFeatured: true, isNewArrival: false, images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80'], thumbnail: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&q=80', tags: ['honey', 'natural', 'raw', 'organic'], origin: 'Tigray, Ethiopia' },
      { name: 'Argan & Castor Hair Oil', slug: 'argan-castor-hair-oil', description: 'Luxurious hair oil blend combining Ethiopian castor oil with argan oil. Promotes hair growth, reduces breakage, and adds shine. 100% natural ingredients.', shortDescription: 'Natural Ethiopian hair growth oil', category: 'beauty', subcategory: 'hair-care', brand: 'Zembile Beauty', sku: 'BEA-001', price: 280, originalPrice: 350, discount: 20, images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80'], thumbnail: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&q=80', stock: 60, rating: 4.5, reviewCount: 78, soldCount: 230, isFeatured: false, isNewArrival: true, tags: ['hair', 'oil', 'natural', 'beauty'], origin: 'Ethiopia' },
      { name: 'Ethiopian Silver Jewelry Set', slug: 'ethiopian-silver-jewelry-set', description: 'Handcrafted sterling silver jewelry set featuring traditional Ethiopian cross and geometric patterns. Includes necklace, earrings, and bracelet.', shortDescription: 'Handcrafted Ethiopian silver jewelry', category: 'crafts', subcategory: 'jewelry', brand: 'Zembile Jewelry', sku: 'CRA-001', price: 1800, stock: 15, rating: 4.8, reviewCount: 34, soldCount: 67, isFeatured: true, isNewArrival: false, images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80'], thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=80', tags: ['jewelry', 'silver', 'handcrafted', 'traditional'], origin: 'Addis Ababa, Ethiopia' },
      { name: 'Teff Flour (Organic)', slug: 'teff-flour-organic', description: 'Certified organic teff flour from Ethiopian highlands. Rich in iron, calcium, and protein. Perfect for making traditional injera and gluten-free baking.', shortDescription: 'Organic Ethiopian teff flour', category: 'food', subcategory: 'grains', brand: 'Zembile Organic', sku: 'FOD-003', price: 150, stock: 200, rating: 4.7, reviewCount: 156, soldCount: 890, isFeatured: false, isNewArrival: false, images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80'], thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80', tags: ['teff', 'flour', 'organic', 'gluten-free'], origin: 'Amhara, Ethiopia' },
      { name: 'Sidama Coffee Blend', slug: 'sidama-coffee-blend', description: 'Rich and full-bodied coffee from the Sidama region. Features notes of dark chocolate, berries, and a smooth finish. Medium-dark roast.', shortDescription: 'Full-bodied Sidama coffee blend', category: 'coffee', subcategory: 'blends', brand: 'Zembile Coffee', sku: 'COF-002', price: 380, stock: 45, rating: 4.6, reviewCount: 92, soldCount: 275, isFeatured: false, isNewArrival: true, images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80'], thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&q=80', tags: ['coffee', 'sidama', 'blend', 'medium-dark'], origin: 'Sidama, Ethiopia' },
      { name: 'Ethiopian Coffee Ceremony Set', slug: 'ethiopian-coffee-ceremony-set', description: 'Complete traditional Ethiopian coffee ceremony set including jebena (clay pot), 6 small cups, incense holder, and grass tray. Perfect for authentic coffee ceremonies.', shortDescription: 'Complete traditional coffee ceremony set', category: 'home', subcategory: 'pottery-ceramics', brand: 'Zembile Crafts', sku: 'HOM-002', price: 1200, originalPrice: 1500, discount: 20, images: ['https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&q=80'], thumbnail: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&q=80', stock: 20, rating: 4.9, reviewCount: 67, soldCount: 145, isFeatured: true, isNewArrival: false, tags: ['coffee', 'ceremony', 'jebena', 'traditional'], origin: 'Addis Ababa, Ethiopia' },
      { name: 'Niter Kibbeh (Spiced Butter)', slug: 'niter-kibbeh-spiced-butter', description: 'Traditional Ethiopian spiced clarified butter infused with onions, garlic, ginger, and aromatic spices. Essential ingredient for authentic Ethiopian cooking.', shortDescription: 'Traditional Ethiopian spiced clarified butter', category: 'food', subcategory: 'spices-seasonings', brand: 'Zembile Kitchen', sku: 'FOD-004', price: 220, stock: 80, rating: 4.8, reviewCount: 45, soldCount: 310, isFeatured: false, isNewArrival: false, images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80'], thumbnail: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&q=80', tags: ['butter', 'spiced', 'cooking', 'traditional'], origin: 'Ethiopia' },
      { name: 'Handpainted Ethiopian Art Canvas', slug: 'handpainted-ethiopian-art-canvas', description: 'Original handpainted canvas featuring traditional Ethiopian religious and cultural scenes. Each piece is unique, painted by local artists using natural pigments.', shortDescription: 'Original handpainted Ethiopian art', category: 'crafts', subcategory: 'paintings', brand: 'Zembile Art', sku: 'CRA-002', price: 3500, stock: 8, rating: 4.9, reviewCount: 23, soldCount: 42, isFeatured: true, isNewArrival: false, images: ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80'], thumbnail: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=300&q=80', tags: ['art', 'painting', 'canvas', 'handmade'], origin: 'Addis Ababa, Ethiopia' }
    ]
    await Product.insertMany(sampleProducts)
    console.log('✅ Sample products seeded')
  }
}

// Initialize database connection
const initializeDatabase = async () => {
  const isConnected = await connectDB()
  if (isConnected !== false) {
    // Seed default users if using MongoDB
    await DatabaseService.seedDefaultUsers()
    await seedCatalog()
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
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ],
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', auth)
app.use('/api/admin', admin)
app.use('/api/products', products)
app.use('/api/categories', categories)
app.use('/api/analytics', analytics)
app.use('/api', payments)
app.use('/api/uploads', uploads)

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
