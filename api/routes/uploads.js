const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = path.extname(file.originalname)
    cb(null, `payment-proof-${uniqueSuffix}${extension}`)
  }
})

// File filter for security
const fileFilter = (req, file, cb) => {
  // Allow only images and PDFs
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WebP, and PDF files are allowed.'), false)
  }
}

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

const router = express.Router()

// Payment proof upload endpoint
router.post('/payment-proof', upload.single('proof'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      })
    }

    const {
      orderId,
      transactionRef,
      transactionDate,
      bankId,
      amount,
      notes
    } = req.body

    // Validate required fields
    if (!orderId || !transactionRef || !transactionDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      })
    }

    // TODO: Store file metadata in database
    const fileData = {
      id: `FILE${Date.now()}`,
      orderId,
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      transactionRef,
      transactionDate,
      bankId,
      amount,
      notes,
      uploadedAt: new Date().toISOString(),
      status: 'pending_verification'
    }

    console.log('Payment proof uploaded:', fileData)

    res.json({
      status: 'success',
      message: 'Payment proof uploaded successfully',
      fileId: fileData.id,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      status: 'error',
      message: 'File upload failed'
    })
  }
})

// Legacy upload endpoint (for backward compatibility)
router.post('/', upload.single('proof'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: 'No file uploaded'
      })
    }

    // TODO: store metadata in DB and associate with order
    res.json({
      ok: true,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      ok: false,
      message: 'Upload failed'
    })
  }
})

// Get uploaded file (for admin verification)
router.get('/file/:filename', (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(uploadsDir, filename)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      })
    }

    res.sendFile(filePath)
  } catch (error) {
    console.error('File retrieval error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve file'
    })
  }
})

module.exports = router
