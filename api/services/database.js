const mongoose = require('mongoose')
const User = require('../models/User')
const Order = require('../models/Order')
const PaymentProof = require('../models/PaymentProof')
const Transaction = require('../models/Transaction')

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1
}

// Mock data fallback (existing arrays)
let mockUsers = [
  {
    id: 1,
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@zembile.com',
    phone: '+251-9-12-34-56-78',
    password: '$2a$12$FuhWErhFDDTs7NYeSxTqreC5UsLkl5rNUQ8hyDM.A2iIXWVXokcl.', // password: demo123456
    role: 'customer',
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@zembile.com',
    phone: '+251-9-87-65-43-21',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gE.ByG', // password: admin123456
    role: 'admin',
    isVerified: true,
    createdAt: new Date().toISOString()
  }
]

let mockOrders = []
let mockPaymentProofs = []
let mockTransactions = []

// Database service with fallback to mock data
class DatabaseService {
  // User operations
  static async createUser(userData) {
    if (isMongoConnected()) {
      const user = new User(userData)
      return await user.save()
    } else {
      const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        createdAt: new Date().toISOString()
      }
      mockUsers.push(newUser)
      return newUser
    }
  }

  static async findUserByEmail(email) {
    if (isMongoConnected()) {
      return await User.findOne({ email: email.toLowerCase() })
    } else {
      return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase())
    }
  }

  static async findUserById(id) {
    if (isMongoConnected()) {
      return await User.findById(id)
    } else {
      return mockUsers.find(user => user.id === parseInt(id))
    }
  }

  static async updateUser(id, updateData) {
    if (isMongoConnected()) {
      return await User.findByIdAndUpdate(id, updateData, { new: true })
    } else {
      const userIndex = mockUsers.findIndex(user => user.id === parseInt(id))
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updateData }
        return mockUsers[userIndex]
      }
      return null
    }
  }

  static async getAllUsers(filters = {}) {
    if (isMongoConnected()) {
      const query = {}
      if (filters.role) query.role = filters.role
      if (filters.search) {
        query.$or = [
          { firstName: { $regex: filters.search, $options: 'i' } },
          { lastName: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } }
        ]
      }
      return await User.find(query).sort({ createdAt: -1 })
    } else {
      let filteredUsers = [...mockUsers]
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role)
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredUsers = filteredUsers.filter(user => 
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        )
      }
      return filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }

  // Order operations
  static async createOrder(orderData) {
    if (isMongoConnected()) {
      const order = new Order(orderData)
      return await order.save()
    } else {
      const newOrder = {
        id: orderData.orderId || `ZMB${Date.now()}`,
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockOrders.push(newOrder)
      return newOrder
    }
  }

  static async findOrderById(orderId) {
    if (isMongoConnected()) {
      return await Order.findOne({ orderId }).populate('paymentProofId')
    } else {
      return mockOrders.find(order => order.id === orderId || order.orderId === orderId)
    }
  }

  static async findOrderByTxRef(tx_ref) {
    if (isMongoConnected()) {
      return await Order.findOne({ tx_ref })
    } else {
      return mockOrders.find(order => order.tx_ref === tx_ref)
    }
  }

  static async updateOrder(orderId, updateData) {
    if (isMongoConnected()) {
      return await Order.findOneAndUpdate(
        { orderId }, 
        { ...updateData, updatedAt: new Date() }, 
        { new: true }
      )
    } else {
      const orderIndex = mockOrders.findIndex(order => 
        order.id === orderId || order.orderId === orderId
      )
      if (orderIndex !== -1) {
        mockOrders[orderIndex] = { 
          ...mockOrders[orderIndex], 
          ...updateData, 
          updatedAt: new Date().toISOString() 
        }
        return mockOrders[orderIndex]
      }
      return null
    }
  }

  static async getAllOrders(filters = {}) {
    if (isMongoConnected()) {
      const query = {}
      if (filters.status) query.status = filters.status
      if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod
      if (filters.dateFrom) query.createdAt = { $gte: new Date(filters.dateFrom) }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999)
        query.createdAt = { ...query.createdAt, $lte: toDate }
      }
      if (filters.search) {
        query.$or = [
          { orderId: { $regex: filters.search, $options: 'i' } },
          { 'customerInfo.email': { $regex: filters.search, $options: 'i' } },
          { 'customerInfo.firstName': { $regex: filters.search, $options: 'i' } },
          { 'customerInfo.lastName': { $regex: filters.search, $options: 'i' } }
        ]
      }
      
      return await Order.find(query)
        .populate('paymentProofId')
        .sort({ createdAt: -1 })
    } else {
      let filteredOrders = [...mockOrders]
      
      if (filters.status) {
        filteredOrders = filteredOrders.filter(order => order.status === filters.status)
      }
      if (filters.paymentMethod) {
        filteredOrders = filteredOrders.filter(order => order.paymentMethod === filters.paymentMethod)
      }
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) >= fromDate)
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999)
        filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) <= toDate)
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredOrders = filteredOrders.filter(order => 
          (order.id && order.id.toLowerCase().includes(searchLower)) ||
          (order.orderId && order.orderId.toLowerCase().includes(searchLower)) ||
          (order.customerInfo?.email?.toLowerCase().includes(searchLower)) ||
          (order.customerInfo?.firstName?.toLowerCase().includes(searchLower)) ||
          (order.customerInfo?.lastName?.toLowerCase().includes(searchLower))
        )
      }
      
      return filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }

  // Payment Proof operations
  static async createPaymentProof(proofData) {
    if (isMongoConnected()) {
      const proof = new PaymentProof(proofData)
      return await proof.save()
    } else {
      const newProof = {
        id: `PROOF${Date.now()}`,
        ...proofData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockPaymentProofs.push(newProof)
      return newProof
    }
  }

  static async findPaymentProofById(proofId) {
    if (isMongoConnected()) {
      return await PaymentProof.findById(proofId).populate('order')
    } else {
      return mockPaymentProofs.find(proof => proof.id === proofId)
    }
  }

  static async findPaymentProofByOrderId(orderId) {
    if (isMongoConnected()) {
      return await PaymentProof.findOne({ orderId })
    } else {
      return mockPaymentProofs.find(proof => proof.orderId === orderId)
    }
  }

  static async updatePaymentProof(proofId, updateData) {
    if (isMongoConnected()) {
      return await PaymentProof.findByIdAndUpdate(
        proofId, 
        { ...updateData, updatedAt: new Date() }, 
        { new: true }
      )
    } else {
      const proofIndex = mockPaymentProofs.findIndex(proof => proof.id === proofId)
      if (proofIndex !== -1) {
        mockPaymentProofs[proofIndex] = { 
          ...mockPaymentProofs[proofIndex], 
          ...updateData, 
          updatedAt: new Date().toISOString() 
        }
        return mockPaymentProofs[proofIndex]
      }
      return null
    }
  }

  static async getAllPaymentProofs(filters = {}) {
    if (isMongoConnected()) {
      const query = {}
      if (filters.status) query.status = filters.status
      if (filters.dateFrom) query.createdAt = { $gte: new Date(filters.dateFrom) }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999)
        query.createdAt = { ...query.createdAt, $lte: toDate }
      }
      if (filters.search) {
        query.$or = [
          { orderId: { $regex: filters.search, $options: 'i' } },
          { transactionRef: { $regex: filters.search, $options: 'i' } }
        ]
      }
      
      return await PaymentProof.find(query)
        .populate('order')
        .sort({ createdAt: -1 })
    } else {
      let filteredProofs = [...mockPaymentProofs]
      
      if (filters.status) {
        filteredProofs = filteredProofs.filter(proof => proof.status === filters.status)
      }
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        filteredProofs = filteredProofs.filter(proof => new Date(proof.createdAt) >= fromDate)
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999)
        filteredProofs = filteredProofs.filter(proof => new Date(proof.createdAt) <= toDate)
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredProofs = filteredProofs.filter(proof => 
          proof.orderId.toLowerCase().includes(searchLower) ||
          proof.transactionRef.toLowerCase().includes(searchLower)
        )
      }
      
      return filteredProofs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }

  // Transaction operations
  static async createTransaction(transactionData) {
    if (isMongoConnected()) {
      const transaction = new Transaction(transactionData)
      return await transaction.save()
    } else {
      const newTransaction = {
        id: `TX${Date.now()}`,
        ...transactionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockTransactions.push(newTransaction)
      return newTransaction
    }
  }

  static async findTransactionByTxRef(tx_ref) {
    if (isMongoConnected()) {
      return await Transaction.findOne({ tx_ref })
    } else {
      return mockTransactions.find(tx => tx.tx_ref === tx_ref)
    }
  }

  static async updateTransaction(tx_ref, updateData) {
    if (isMongoConnected()) {
      return await Transaction.findOneAndUpdate(
        { tx_ref }, 
        { ...updateData, updatedAt: new Date() }, 
        { new: true }
      )
    } else {
      const txIndex = mockTransactions.findIndex(tx => tx.tx_ref === tx_ref)
      if (txIndex !== -1) {
        mockTransactions[txIndex] = { 
          ...mockTransactions[txIndex], 
          ...updateData, 
          updatedAt: new Date().toISOString() 
        }
        return mockTransactions[txIndex]
      }
      return null
    }
  }

  // Statistics
  static async getStatistics() {
    if (isMongoConnected()) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const [
        totalOrders,
        todayOrders,
        thisMonthOrders,
        ordersByStatus,
        totalProofs,
        proofsByStatus,
        totalUsers,
        usersByRole
      ] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ createdAt: { $gte: today } }),
        Order.countDocuments({ createdAt: { $gte: thisMonth } }),
        Order.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        PaymentProof.countDocuments(),
        PaymentProof.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        User.countDocuments(),
        User.aggregate([
          { $group: { _id: '$role', count: { $sum: 1 } } }
        ])
      ])

      // Calculate revenue
      const paidOrders = await Order.find({ 
        status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } 
      })
      const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.pricing?.total || order.total || 0), 0)

      const thisMonthPaidOrders = await Order.find({ 
        status: { $in: ['paid', 'processing', 'shipped', 'delivered'] },
        createdAt: { $gte: thisMonth }
      })
      const thisMonthRevenue = thisMonthPaidOrders.reduce((sum, order) => sum + (order.pricing?.total || order.total || 0), 0)

      return {
        orders: {
          total: totalOrders,
          today: todayOrders,
          thisMonth: thisMonthOrders,
          ...ordersByStatus.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {})
        },
        payments: {
          totalProofs: totalProofs,
          ...proofsByStatus.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {})
        },
        revenue: {
          total: totalRevenue,
          thisMonth: thisMonthRevenue
        },
        users: {
          total: totalUsers,
          ...usersByRole.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {})
        }
      }
    } else {
      // Mock statistics calculation
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const stats = {
        orders: {
          total: mockOrders.length,
          today: mockOrders.filter(order => new Date(order.createdAt) >= today).length,
          thisMonth: mockOrders.filter(order => new Date(order.createdAt) >= thisMonth).length,
          pending_payment: mockOrders.filter(order => order.status === 'pending_payment').length,
          paid: mockOrders.filter(order => order.status === 'paid').length,
          processing: mockOrders.filter(order => order.status === 'processing').length,
          shipped: mockOrders.filter(order => order.status === 'shipped').length,
          delivered: mockOrders.filter(order => order.status === 'delivered').length
        },
        payments: {
          totalProofs: mockPaymentProofs.length,
          pending_verification: mockPaymentProofs.filter(proof => proof.status === 'pending_verification').length,
          verified: mockPaymentProofs.filter(proof => proof.status === 'verified').length,
          rejected: mockPaymentProofs.filter(proof => proof.status === 'rejected').length
        },
        revenue: {
          total: mockOrders.filter(order => ['paid', 'processing', 'shipped', 'delivered'].includes(order.status))
            .reduce((sum, order) => sum + (order.pricing?.total || order.total || 0), 0),
          thisMonth: mockOrders.filter(order => 
            ['paid', 'processing', 'shipped', 'delivered'].includes(order.status) &&
            new Date(order.createdAt) >= thisMonth
          ).reduce((sum, order) => sum + (order.pricing?.total || order.total || 0), 0)
        },
        users: {
          total: mockUsers.length,
          customers: mockUsers.filter(user => user.role === 'customer').length,
          admins: mockUsers.filter(user => user.role === 'admin').length
        }
      }

      return stats
    }
  }

  // Utility methods
  static isUsingMongoDB() {
    return isMongoConnected()
  }

  static async seedDefaultUsers() {
    if (isMongoConnected()) {
      const existingAdmin = await User.findOne({ email: 'admin@zembile.com' })
      if (!existingAdmin) {
        await User.create({
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@zembile.com',
          phone: '+251987654321',
          password: 'admin123456', // Updated to match expected credentials
          role: 'admin',
          isVerified: true
        })
        console.log('✅ Default admin user created')
      }

      const existingDemo = await User.findOne({ email: 'demo@zembile.com' })
      if (!existingDemo) {
        await User.create({
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@zembile.com',
          phone: '+251912345678',
          password: 'demo123456', // 8+ characters
          role: 'customer',
          isVerified: true
        })
        console.log('✅ Default demo user created')
      }
    }
  }
}

module.exports = DatabaseService