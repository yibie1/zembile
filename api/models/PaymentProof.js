const mongoose = require('mongoose')

const paymentProofSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    index: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  transactionRef: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  transactionDate: {
    type: Date,
    required: true
  },
  bankId: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    min: 0
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileHash: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['pending_verification', 'verified', 'rejected'],
    default: 'pending_verification'
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Verification notes cannot exceed 500 characters']
  },
  rejectionReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
paymentProofSchema.index({ orderId: 1 })
paymentProofSchema.index({ transactionRef: 1 })
paymentProofSchema.index({ status: 1 })
paymentProofSchema.index({ createdAt: -1 })
paymentProofSchema.index({ transactionDate: -1 })

// Virtual for verification status
paymentProofSchema.virtual('isVerified').get(function() {
  return this.status === 'verified'
})

paymentProofSchema.virtual('isPending').get(function() {
  return this.status === 'pending_verification'
})

paymentProofSchema.virtual('isRejected').get(function() {
  return this.status === 'rejected'
})

module.exports = mongoose.model('PaymentProof', paymentProofSchema)