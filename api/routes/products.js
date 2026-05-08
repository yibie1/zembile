const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Product = require('../models/Product')
const Review = require('../models/Review')
const Category = require('../models/Category')
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'zembile_jwt_secret_key_2024'

// Optional auth middleware
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) req.user = decoded
    })
  }
  next()
}

// Admin auth middleware
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ status: 'error', message: 'Access token required' })
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ status: 'error', message: 'Invalid token' })
    if (decoded.role !== 'admin') return res.status(403).json({ status: 'error', message: 'Admin access required' })
    req.user = decoded
    next()
  })
}

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// GET /api/products - List products with filtering, sorting, pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1, limit = 12, category, subcategory, brand,
      minPrice, maxPrice, rating, inStock, onSale, featured,
      search, sort = 'popular', tags
    } = req.query

    const query = { status: { $in: ['active', 'out_of_stock'] } }

    if (category) query.category = category
    if (subcategory) query.subcategory = subcategory
    if (brand) query.brand = brand
    if (featured === 'true') query.isFeatured = true
    if (inStock === 'true') query.stock = { $gt: 0 }
    if (onSale === 'true') query.discount = { $gt: 0 }
    if (tags) query.tags = { $in: tags.split(',') }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseFloat(minPrice)
      if (maxPrice) query.price.$lte = parseFloat(maxPrice)
    }

    if (rating) query.rating = { $gte: parseFloat(rating) }

    if (search) {
      query.$text = { $search: search }
    }

    // Sort options
    let sortObj = {}
    switch (sort) {
      case 'price_asc': sortObj = { price: 1 }; break
      case 'price_desc': sortObj = { price: -1 }; break
      case 'rating': sortObj = { rating: -1 }; break
      case 'newest': sortObj = { createdAt: -1 }; break
      case 'name_asc': sortObj = { name: 1 }; break
      case 'name_desc': sortObj = { name: -1 }; break
      case 'discount': sortObj = { discount: -1 }; break
      default: sortObj = { soldCount: -1, rating: -1 } // popular
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)).lean(),
      Product.countDocuments(query)
    ])

    res.json({
      status: 'success',
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ status: 'error', message: 'Failed to retrieve products' })
  }
})

// GET /api/products/featured - Get featured products
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8
    const products = await Product.find({ isFeatured: true, status: 'active' })
      .sort({ soldCount: -1 }).limit(limit).lean()
    res.json({ status: 'success', data: products })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve featured products' })
  }
})

// GET /api/products/new-arrivals
router.get('/new-arrivals', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8
    const products = await Product.find({ status: 'active' })
      .sort({ createdAt: -1 }).limit(limit).lean()
    res.json({ status: 'success', data: products })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve new arrivals' })
  }
})

// GET /api/products/best-sellers
router.get('/best-sellers', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8
    const products = await Product.find({ status: 'active' })
      .sort({ soldCount: -1, rating: -1 }).limit(limit).lean()
    res.json({ status: 'success', data: products })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve best sellers' })
  }
})

// GET /api/products/on-sale
router.get('/on-sale', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8
    const products = await Product.find({ status: 'active', discount: { $gt: 0 } })
      .sort({ discount: -1 }).limit(limit).lean()
    res.json({ status: 'success', data: products })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve sale products' })
  }
})

// GET /api/products/:id - Get single product
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params
    let product

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean()
    } else {
      product = await Product.findOne({ slug: id }).lean()
    }

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' })
    }

    // Get approved reviews
    const reviews = await Review.find({ productId: product._id.toString(), status: 'approved' })
      .sort({ createdAt: -1 }).limit(10).lean()

    // Get related products
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active'
    }).limit(4).lean()

    res.json({
      status: 'success',
      data: { ...product, reviews, related }
    })
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ status: 'error', message: 'Failed to retrieve product' })
  }
})

// POST /api/products/:id/reviews - Add review
router.post('/:id/reviews', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { rating, title, comment, reviewerName, reviewerEmail, orderId } = req.body

    if (!rating || !comment || !reviewerName) {
      return res.status(400).json({ status: 'error', message: 'Rating, comment, and name are required' })
    }

    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' })

    const reviewData = {
      product: product._id,
      productId: product._id.toString(),
      rating: parseInt(rating),
      title,
      comment,
      reviewerName,
      reviewerEmail,
      orderId,
      status: 'pending'
    }

    if (req.user) {
      reviewData.user = req.user.id
      reviewData.userId = req.user.id
      reviewData.isVerifiedPurchase = !!orderId
    }

    const review = new Review(reviewData)
    await review.save()

    res.status(201).json({
      status: 'success',
      message: 'Review submitted and pending approval',
      data: review
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'error', message: 'You have already reviewed this product' })
    }
    console.error('Add review error:', error)
    res.status(500).json({ status: 'error', message: 'Failed to submit review' })
  }
})

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// POST /api/products - Create product
router.post('/', requireAdmin, async (req, res) => {
  try {
    const productData = { ...req.body, createdBy: req.user.id }
    const product = new Product(productData)
    await product.save()

    // Update category product count
    if (product.category) {
      await Category.findOneAndUpdate(
        { slug: product.category },
        { $inc: { productCount: 1 } }
      )
    }

    res.status(201).json({ status: 'success', message: 'Product created', data: product })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'error', message: 'Product with this SKU or slug already exists' })
    }
    console.error('Create product error:', error)
    res.status(500).json({ status: 'error', message: 'Failed to create product' })
  }
})

// PUT /api/products/:id - Update product
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' })
    res.json({ status: 'success', message: 'Product updated', data: product })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ status: 'error', message: 'Failed to update product' })
  }
})

// DELETE /api/products/:id - Delete product
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' })

    // Update category count
    if (product.category) {
      await Category.findOneAndUpdate(
        { slug: product.category },
        { $inc: { productCount: -1 } }
      )
    }

    res.json({ status: 'success', message: 'Product deleted' })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ status: 'error', message: 'Failed to delete product' })
  }
})

// PATCH /api/products/:id/stock - Update stock
router.patch('/:id/stock', requireAdmin, async (req, res) => {
  try {
    const { stock, operation } = req.body // operation: 'set', 'increment', 'decrement'
    let update = {}

    if (operation === 'increment') update = { $inc: { stock: parseInt(stock) } }
    else if (operation === 'decrement') update = { $inc: { stock: -parseInt(stock) } }
    else update = { $set: { stock: parseInt(stock) } }

    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' })

    res.json({ status: 'success', data: { stock: product.stock, status: product.status } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update stock' })
  }
})

// GET /api/products/admin/all - Admin product list with full details
router.get('/admin/all', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, status, sort = 'newest' } = req.query
    const query = {}

    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ]
    if (category) query.category = category
    if (status) query.status = status

    let sortObj = {}
    switch (sort) {
      case 'price_asc': sortObj = { price: 1 }; break
      case 'price_desc': sortObj = { price: -1 }; break
      case 'stock_asc': sortObj = { stock: 1 }; break
      case 'oldest': sortObj = { createdAt: 1 }; break
      default: sortObj = { createdAt: -1 }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)).lean(),
      Product.countDocuments(query)
    ])

    res.json({
      status: 'success',
      data: products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve products' })
  }
})

// Admin review management
router.get('/admin/reviews', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, productId } = req.query
    const query = {}
    if (status) query.status = status
    if (productId) query.productId = productId

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [reviews, total] = await Promise.all([
      Review.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Review.countDocuments(query)
    ])

    res.json({
      status: 'success',
      data: reviews,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve reviews' })
  }
})

router.put('/admin/reviews/:reviewId', requireAdmin, async (req, res) => {
  try {
    const { status, adminResponse } = req.body
    const update = {}
    if (status) update.status = status
    if (adminResponse) {
      update.adminResponse = adminResponse
      update.adminResponseAt = new Date()
    }

    const review = await Review.findByIdAndUpdate(req.params.reviewId, update, { new: true })
    if (!review) return res.status(404).json({ status: 'error', message: 'Review not found' })

    // Update product rating if review status changed
    if (status === 'approved' || status === 'rejected') {
      const approvedReviews = await Review.find({ productId: review.productId, status: 'approved' })
      const avgRating = approvedReviews.length > 0
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
        : 0
      await Product.findByIdAndUpdate(review.product, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: approvedReviews.length
      })
    }

    res.json({ status: 'success', data: review })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update review' })
  }
})

module.exports = router
