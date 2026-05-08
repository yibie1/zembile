const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Order = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/Product')
const Transaction = require('../models/Transaction')
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

// GET /api/analytics/overview - Dashboard overview stats
router.get('/overview', requireAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query
    const now = new Date()
    let startDate, prevStartDate

    switch (period) {
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000)
        prevStartDate = new Date(now - 14 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now - 90 * 24 * 60 * 60 * 1000)
        prevStartDate = new Date(now - 180 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now - 365 * 24 * 60 * 60 * 1000)
        prevStartDate = new Date(now - 730 * 24 * 60 * 60 * 1000)
        break
      default: // 30d
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000)
        prevStartDate = new Date(now - 60 * 24 * 60 * 60 * 1000)
    }

    const paidStatuses = ['paid', 'processing', 'shipped', 'delivered']

    const [
      currentOrders, prevOrders,
      currentRevenue, prevRevenue,
      currentCustomers, prevCustomers,
      totalProducts, lowStockProducts,
      pendingOrders, pendingPayments
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      Order.countDocuments({ createdAt: { $gte: prevStartDate, $lt: startDate } }),
      Order.aggregate([
        { $match: { status: { $in: paidStatuses }, createdAt: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      Order.aggregate([
        { $match: { status: { $in: paidStatuses }, createdAt: { $gte: prevStartDate, $lt: startDate } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      User.countDocuments({ role: 'customer', createdAt: { $gte: startDate } }),
      User.countDocuments({ role: 'customer', createdAt: { $gte: prevStartDate, $lt: startDate } }),
      Product.countDocuments({ status: { $in: ['active', 'out_of_stock'] } }),
      Product.countDocuments({ stock: { $lte: 10, $gt: 0 } }),
      Order.countDocuments({ status: 'pending_payment' }),
      Order.countDocuments({ status: 'payment_proof_uploaded' })
    ])

    const calcChange = (current, prev) => {
      if (prev === 0) return current > 0 ? 100 : 0
      return Math.round(((current - prev) / prev) * 100 * 10) / 10
    }

    const currentRev = currentRevenue[0]?.total || 0
    const prevRev = prevRevenue[0]?.total || 0

    res.json({
      status: 'success',
      data: {
        revenue: {
          value: currentRev,
          change: calcChange(currentRev, prevRev),
          trend: currentRev >= prevRev ? 'up' : 'down'
        },
        orders: {
          value: currentOrders,
          change: calcChange(currentOrders, prevOrders),
          trend: currentOrders >= prevOrders ? 'up' : 'down',
          pending: pendingOrders,
          pendingPayments
        },
        customers: {
          value: currentCustomers,
          change: calcChange(currentCustomers, prevCustomers),
          trend: currentCustomers >= prevCustomers ? 'up' : 'down'
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts
        }
      }
    })
  } catch (error) {
    console.error('Analytics overview error:', error)
    res.status(500).json({ status: 'error', message: 'Failed to retrieve analytics' })
  }
})

// GET /api/analytics/revenue - Revenue chart data
router.get('/revenue', requireAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query
    const now = new Date()
    let startDate, groupFormat, labels = []

    if (period === '7d') {
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000)
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
    } else if (period === '1y') {
      startDate = new Date(now - 365 * 24 * 60 * 60 * 1000)
      groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
    } else {
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000)
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          status: { $in: ['paid', 'processing', 'shipped', 'delivered'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupFormat,
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    res.json({ status: 'success', data: revenueData })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve revenue data' })
  }
})

// GET /api/analytics/orders - Orders chart data
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query
    const startDate = period === '7d'
      ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [ordersByStatus, ordersByDay] = await Promise.all([
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ])

    res.json({ status: 'success', data: { byStatus: ordersByStatus, byDay: ordersByDay } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve order analytics' })
  }
})

// GET /api/analytics/top-products - Top selling products
router.get('/top-products', requireAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const products = await Product.find({ status: { $in: ['active', 'out_of_stock'] } })
      .sort({ soldCount: -1 }).limit(limit).select('name category price soldCount rating images').lean()
    res.json({ status: 'success', data: products })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve top products' })
  }
})

// GET /api/analytics/categories - Sales by category
router.get('/categories', requireAdmin, async (req, res) => {
  try {
    const categorySales = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.category',
          revenue: { $sum: '$items.subtotal' },
          count: { $sum: '$items.quantity' }
        }
      },
      { $sort: { revenue: -1 } }
    ])
    res.json({ status: 'success', data: categorySales })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve category analytics' })
  }
})

// GET /api/analytics/customers - Customer analytics
router.get('/customers', requireAdmin, async (req, res) => {
  try {
    const [totalCustomers, newThisMonth, topCustomers] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({
        role: 'customer',
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }),
      Order.aggregate([
        { $match: { status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } } },
        {
          $group: {
            _id: '$customerInfo.email',
            name: { $first: { $concat: ['$customerInfo.firstName', ' ', '$customerInfo.lastName'] } },
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$pricing.total' }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 }
      ])
    ])

    res.json({
      status: 'success',
      data: { totalCustomers, newThisMonth, topCustomers }
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve customer analytics' })
  }
})

module.exports = router
