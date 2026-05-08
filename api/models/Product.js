const mongoose = require('mongoose')

const productVariantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Size", "Color"
  options: [{ type: String }]
})

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  images: [{
    type: String
  }],
  thumbnail: {
    type: String
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  variants: [productVariantSchema],
  tags: [{ type: String, trim: true }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'out_of_stock'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: true
  },
  weight: {
    type: Number, // in grams
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  origin: {
    type: String,
    default: 'Ethiopia'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Auto-generate slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + Date.now()
  }
  // Auto-set status based on stock
  if (this.stock === 0 && this.status === 'active') {
    this.status = 'out_of_stock'
  } else if (this.stock > 0 && this.status === 'out_of_stock') {
    this.status = 'active'
  }
  next()
})

// Indexes — only use schema.index(), not both index:true and schema.index()
productSchema.index({ name: 'text', description: 'text', tags: 'text' })
productSchema.index({ category: 1 })
productSchema.index({ subcategory: 1 })
productSchema.index({ status: 1 })
productSchema.index({ isFeatured: 1 })
productSchema.index({ price: 1 })
productSchema.index({ rating: -1 })
productSchema.index({ soldCount: -1 })
productSchema.index({ createdAt: -1 })
productSchema.index({ slug: 1 }, { unique: true })

module.exports = mongoose.model('Product', productSchema)
