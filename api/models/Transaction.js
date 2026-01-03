const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  tx_ref: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  orderId: {
    type: String,
    index: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'ETB'
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone_number: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'chapa'
  },
  chapa_reference: {
    type: String
  },
  checkout_url: {
    type: String
  },
  callback_data: {
    type: mongoose.Schema.Types.Mixed
  },
  chapa_data: {
    type: mongoose.Schema.Types.Mixed
  },
  webhook_verified: {
    type: Boolean,
    default: false
  },
  webhook_signature: {
    type: String
  },
  completedAt: {
    type: Date
  },
  failedAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Indexes for better query performance
transactionSchema.index({ tx_ref: 1 })
transactionSchema.index({ orderId: 1 })
transactionSchema.index({ status: 1 })
transactionSchema.index({ email: 1 })
transactionSchema.index({ createdAt: -1 })

// Virtual for transaction success
transactionSchema.virtual('isSuccessful').get(function() {
  return this.status === 'success'
})

transactionSchema.virtual('isPending').get(function() {
  return this.status === 'pending'
})

transactionSchema.virtual('isFailed').get(function() {
  return this.status === 'failed'
})

module.exports = mongoose.model('Transaction', transactionSchema)