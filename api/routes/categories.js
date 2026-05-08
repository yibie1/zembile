const express = require('express')
const jwt = require('jsonwebtoken')
const Category = require('../models/Category')
const Product = require('../models/Product')
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'zembile_jwt_secret_key_2024'

const requireAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.status(401).json({ status: 'error', message: 'Access token required' })
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== 'admin') return res.status(403).json({ status: 'error', message: 'Admin access required' })
    req.user = decoded
    next()
  })
}

// GET /api/categories - Public list
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean()
    res.json({ status: 'success', data: categories })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve categories' })
  }
})

// GET /api/categories/:slug - Single category with products
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true }).lean()
    if (!category) return res.status(404).json({ status: 'error', message: 'Category not found' })
    res.json({ status: 'success', data: category })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve category' })
  }
})

// POST /api/categories - Admin create
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, description, icon, image, subcategories, sortOrder } = req.body
    const slug = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
    const category = new Category({ name, slug, description, icon, image, subcategories, sortOrder })
    await category.save()
    res.status(201).json({ status: 'success', data: category })
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ status: 'error', message: 'Category already exists' })
    res.status(500).json({ status: 'error', message: 'Failed to create category' })
  }
})

// PUT /api/categories/:id - Admin update
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!category) return res.status(404).json({ status: 'error', message: 'Category not found' })
    res.json({ status: 'success', data: category })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update category' })
  }
})

// DELETE /api/categories/:id - Admin delete
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ status: 'error', message: 'Category not found' })

    // Check if products exist in this category
    const productCount = await Product.countDocuments({ category: category.slug })
    if (productCount > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot delete category with ${productCount} products. Move products first.`
      })
    }

    await Category.findByIdAndDelete(req.params.id)
    res.json({ status: 'success', message: 'Category deleted' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete category' })
  }
})

module.exports = router
