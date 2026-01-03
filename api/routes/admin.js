const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const DatabaseService = require('../services/database')
const router = express.Router()

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'zembile_jwt_secret_key_2024'

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access token required'
      })
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: 'error',
          message: 'Invalid or expired token'
        })
      }

      // Check if user is admin
      const userData = await DatabaseService.findUserById(decoded.id)
      if (!userData || userData.role !== 'admin') {
        return res.status(403).json({
          status: 'error',
          message: 'Admin access required'
        })
      }

      req.user = decoded
      req.userDetails = userData
      next()
    })
  } catch (error) {
    console.error('Admin auth error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed'
    })
  }
}

// Get dashboard statistics
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const stats = await DatabaseService.getStatistics()
    
    res.json({
      status: 'success',
      data: stats
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve dashboard statistics'
    })
  }
})

// Get all orders with advanced filtering and pagination
router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const filters = {
      status: req.query.status,
      paymentMethod: req.query.paymentMethod,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      search: req.query.search
    }

    const allOrders = await DatabaseService.getAllOrders(filters)

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = allOrders.slice(startIndex, endIndex)

    // Add payment proof information to orders
    const ordersWithProofs = await Promise.all(
      paginatedOrders.map(async (order) => {
        const paymentProof = await DatabaseService.findPaymentProofByOrderId(
          order.orderId || order.id
        )
        return {
          ...order,
          paymentProof: paymentProof || null
        }
      })
    )

    res.json({
      status: 'success',
      data: ordersWithProofs,
      pagination: {
        page,
        limit,
        total: allOrders.length,
        pages: Math.ceil(allOrders.length / limit)
      },
      filters
    })
  } catch (error) {
    console.error('Get admin orders error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve orders'
    })
  }
})

// Update order status
router.put('/orders/:orderId/status', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params
    const { status, notes } = req.body

    const validStatuses = [
      'pending_payment',
      'payment_proof_uploaded',
      'paid',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ]

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid status is required',
        validStatuses
      })
    }

    // Get current order
    const currentOrder = await DatabaseService.findOrderById(orderId)
    if (!currentOrder) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      })
    }

    const previousStatus = currentOrder.status

    // Prepare update data
    const updateData = {
      status,
      updatedAt: new Date()
    }

    // Add status history
    const statusHistoryEntry = {
      status,
      previousStatus,
      updatedBy: req.user.id,
      updatedAt: new Date(),
      notes: notes || ''
    }

    if (DatabaseService.isUsingMongoDB()) {
      updateData.$push = { statusHistory: statusHistoryEntry }
    } else {
      // For mock data, handle status history manually
      if (!currentOrder.statusHistory) {
        currentOrder.statusHistory = []
      }
      currentOrder.statusHistory.push(statusHistoryEntry)
      updateData.statusHistory = currentOrder.statusHistory
    }

    // Add timestamp fields based on status
    if (status === 'paid') {
      updateData.paidAt = new Date()
    } else if (status === 'shipped') {
      updateData.shippedAt = new Date()
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date()
    }

    const updatedOrder = await DatabaseService.updateOrder(orderId, updateData)

    res.json({
      status: 'success',
      message: 'Order status updated successfully',
      data: {
        orderId,
        status,
        previousStatus,
        updatedAt: updateData.updatedAt
      }
    })
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to update order status'
    })
  }
})

// Get all payment proofs with filtering and pagination
router.get('/payment-proofs', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const filters = {
      status: req.query.status,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      search: req.query.search
    }

    const allProofs = await DatabaseService.getAllPaymentProofs(filters)

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProofs = allProofs.slice(startIndex, endIndex)

    // Add order information to proofs
    const proofsWithOrders = await Promise.all(
      paginatedProofs.map(async (proof) => {
        const order = await DatabaseService.findOrderById(proof.orderId)
        return {
          ...proof,
          order: order || null
        }
      })
    )

    res.json({
      status: 'success',
      data: proofsWithOrders,
      pagination: {
        page,
        limit,
        total: allProofs.length,
        pages: Math.ceil(allProofs.length / limit)
      }
    })
  } catch (error) {
    console.error('Get payment proofs error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve payment proofs'
    })
  }
})

// Verify payment proof
router.post('/payment-proofs/:proofId/verify', authenticateAdmin, async (req, res) => {
  try {
    const { proofId } = req.params
    const { status, notes } = req.body

    const validStatuses = ['verified', 'rejected']
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Status must be either "verified" or "rejected"'
      })
    }

    const proof = await DatabaseService.findPaymentProofById(proofId)
    if (!proof) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment proof not found'
      })
    }

    // Update payment proof
    const proofUpdateData = {
      status,
      verifiedAt: new Date(),
      verifiedBy: req.user.id,
      verificationNotes: notes || ''
    }

    if (status === 'rejected') {
      proofUpdateData.rejectionReason = notes || 'Payment proof rejected by admin'
    }

    await DatabaseService.updatePaymentProof(proofId, proofUpdateData)

    // Update related order status
    const orderUpdateData = {}
    if (status === 'verified') {
      orderUpdateData.status = 'paid'
      orderUpdateData.paidAt = new Date()
    } else if (status === 'rejected') {
      orderUpdateData.status = 'payment_rejected'
    }
    orderUpdateData.updatedAt = new Date()

    await DatabaseService.updateOrder(proof.orderId, orderUpdateData)

    res.json({
      status: 'success',
      message: `Payment proof ${status} successfully`,
      data: {
        proofId,
        status,
        verifiedAt: proofUpdateData.verifiedAt,
        verifiedBy: req.user.id,
        orderId: proof.orderId
      }
    })
  } catch (error) {
    console.error('Verify payment proof error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify payment proof'
    })
  }
})

// Get payment proof file
router.get('/payment-proofs/:proofId/file', authenticateAdmin, async (req, res) => {
  try {
    const { proofId } = req.params
    const proof = await DatabaseService.findPaymentProofById(proofId)
    
    if (!proof || !proof.filename) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment proof file not found'
      })
    }

    // Construct file path
    const uploadsDir = path.join(__dirname, '..', 'uploads')
    const paymentProofsDir = path.join(uploadsDir, 'payment-proofs')
    
    let filePath = path.join(paymentProofsDir, proof.filename)
    if (!fs.existsSync(filePath)) {
      filePath = path.join(uploadsDir, proof.filename)
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'Physical file not found'
      })
    }

    // Set appropriate headers
    res.setHeader('Content-Type', proof.mimeType || 'application/octet-stream')
    res.setHeader('Content-Disposition', `inline; filename="${proof.originalName || proof.filename}"`)
    
    res.sendFile(path.resolve(filePath))
  } catch (error) {
    console.error('Get payment proof file error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve payment proof file'
    })
  }
})

// Get users (admin management)
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const filters = {
      role: req.query.role,
      search: req.query.search
    }

    const allUsers = await DatabaseService.getAllUsers(filters)

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = allUsers.slice(startIndex, endIndex)

    // Remove passwords from response
    const safeUsers = paginatedUsers.map(user => {
      const { password, ...safeUser } = user.toObject ? user.toObject() : user
      return safeUser
    })

    res.json({
      status: 'success',
      data: safeUsers,
      pagination: {
        page,
        limit,
        total: allUsers.length,
        pages: Math.ceil(allUsers.length / limit)
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve users'
    })
  }
})

// Export data for backup
router.get('/export', authenticateAdmin, async (req, res) => {
  try {
    const { type } = req.query
    
    let data = {}
    
    if (!type || type === 'all') {
      const [orders, paymentProofs, users] = await Promise.all([
        DatabaseService.getAllOrders(),
        DatabaseService.getAllPaymentProofs(),
        DatabaseService.getAllUsers()
      ])

      data = {
        orders: orders.map(order => {
          const orderObj = order.toObject ? order.toObject() : order
          // Mask sensitive customer info
          if (orderObj.customerInfo) {
            orderObj.customerInfo.phone = '***'
          }
          return orderObj
        }),
        paymentProofs: paymentProofs.map(proof => {
          const proofObj = proof.toObject ? proof.toObject() : proof
          // Mask transaction refs
          proofObj.transactionRef = proofObj.transactionRef.slice(0, 4) + '***'
          return proofObj
        }),
        users: users.map(user => {
          const userObj = user.toObject ? user.toObject() : user
          // Remove passwords and mask phones
          delete userObj.password
          if (userObj.phone) userObj.phone = '***'
          return userObj
        })
      }
    } else if (type === 'orders') {
      const orders = await DatabaseService.getAllOrders()
      data = { 
        orders: orders.map(order => {
          const orderObj = order.toObject ? order.toObject() : order
          if (orderObj.customerInfo) {
            orderObj.customerInfo.phone = '***'
          }
          return orderObj
        })
      }
    } else if (type === 'payments') {
      const paymentProofs = await DatabaseService.getAllPaymentProofs()
      data = { 
        paymentProofs: paymentProofs.map(proof => {
          const proofObj = proof.toObject ? proof.toObject() : proof
          proofObj.transactionRef = proofObj.transactionRef.slice(0, 4) + '***'
          return proofObj
        })
      }
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid export type. Use: all, orders, or payments'
      })
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="zembile-export-${type}-${new Date().toISOString().split('T')[0]}.json"`)
    
    res.json({
      status: 'success',
      exportedAt: new Date().toISOString(),
      exportedBy: req.user.id,
      type,
      database: DatabaseService.isUsingMongoDB() ? 'MongoDB' : 'Mock Data',
      data
    })
  } catch (error) {
    console.error('Export data error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to export data'
    })
  }
})

module.exports = router