const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  selectedSize: {
    type: String
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
})

const customerInfoSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  region: {
    type: String,
    trim: true
  }
})

const pricingSchema = new mongoose.Schema({
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
})

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  previousStatus: {
    type: String
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
})

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [orderItemSchema],
  customerInfo: customerInfoSchema,
  pricing: pricingSchema,
  paymentMethod: {
    type: String,
    required: true,
    enum: ['chapa', 'bank_transfer']
  },
  selectedBank: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: [
      'pending_payment',
      'payment_proof_uploaded',
      'paid',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
      'payment_failed',
      'payment_rejected'
    ],
    default: 'pending_payment'
  },
  tx_ref: {
    type: String,
    index: true
  },
  payment_reference: {
    type: String
  },
  paymentProofId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentProof'
  },
  statusHistory: [statusHistorySchema],
  paidAt: {
    type: Date
  },
  shippedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
orderSchema.index({ orderId: 1 })
orderSchema.index({ 'customerInfo.email': 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ paymentMethod: 1 })
orderSchema.index({ createdAt: -1 })
orderSchema.index({ tx_ref: 1 })

// Pre-save middleware to generate orderId
orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    this.orderId = `ZMB${Date.now()}`
  }
  next()
})

// Virtual for order total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0)
})

module.exports = mongoose.model('Order', orderSchema)