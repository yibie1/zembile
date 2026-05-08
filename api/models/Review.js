const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userId: {
    type: String
  },
  orderId: {
    type: String
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: 2000
  },
  reviewerName: {
    type: String,
    required: true,
    trim: true
  },
  reviewerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  adminResponse: {
    type: String,
    trim: true
  },
  adminResponseAt: {
    type: Date
  }
}, {
  timestamps: true
})

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true, sparse: true })
reviewSchema.index({ product: 1, status: 1 })
reviewSchema.index({ status: 1 })
reviewSchema.index({ rating: 1 })
reviewSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Review', reviewSchema)
