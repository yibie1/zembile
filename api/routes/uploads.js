const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Create subdirectories for organization
const paymentProofsDir = path.join(uploadsDir, 'payment-proofs')
if (!fs.existsSync(paymentProofsDir)) {
  fs.mkdirSync(paymentProofsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Organize files by type
    if (req.path.includes('payment-proof')) {
      cb(null, paymentProofsDir)
    } else {
      cb(null, uploadsDir)
    }
  },
  filename: function (req, file, cb) {
    // Generate secure filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex')
    const extension = path.extname(file.originalname).toLowerCase()
    const baseName = file.fieldname || 'file'
    cb(null, `${baseName}-${uniqueSuffix}${extension}`)
  }
})

// Enhanced file filter for security
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const allowedDocTypes = ['application/pdf']
  const allowedTypes = [...allowedImageTypes, ...allowedDocTypes]
  
  // Check MIME type
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPG, PNG, WebP, and PDF files are allowed.'), false)
  }
  
  // Additional security: check file extension
  const extension = path.extname(file.originalname).toLowerCase()
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
  
  if (!allowedExtensions.includes(extension)) {
    return cb(new Error('Invalid file extension.'), false)
  }
  
  // Check for suspicious filenames
  if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\')) {
    return cb(new Error('Invalid filename.'), false)
  }
  
  cb(null, true)
}

// Configure multer with enhanced security
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 1 // Only allow 1 file per upload
  }
})

const router = express.Router()

// Mock database for file metadata - In production, use a real database
let fileMetadata = []

// Payment proof upload endpoint (enhanced)
router.post('/payment-proof', upload.single('proof'), async (req, res) => {
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
      // Clean up uploaded file if validation fails
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err)
      })
      
      return res.status(400).json({
        status: 'error',
        message: 'Order ID, transaction reference, and transaction date are required'
      })
    }

    // Validate transaction date
    const txDate = new Date(transactionDate)
    const now = new Date()
    if (isNaN(txDate.getTime()) || txDate > now) {
      // Clean up uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err)
      })
      
      return res.status(400).json({
        status: 'error',
        message: 'Invalid transaction date'
      })
    }

    // Generate file metadata
    const fileId = uuidv4()
    const metadata = {
      id: fileId,
      orderId: orderId.trim(),
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      transactionRef: transactionRef.trim(),
      transactionDate,
      bankId: bankId || null,
      amount: amount ? parseFloat(amount) : null,
      notes: notes ? notes.trim() : '',
      uploadedAt: new Date().toISOString(),
      status: 'pending_verification',
      hash: crypto.createHash('md5').update(fs.readFileSync(req.file.path)).digest('hex')
    }

    fileMetadata.push(metadata)

    // Also create payment proof record via payment API
    try {
      const paymentProofResponse = await fetch(`${process.env.API_BASE_URL || 'http://localhost:4000'}/api/payment-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          transactionRef,
          transactionDate,
          bankId,
          amount,
          notes,
          filename: req.file.filename
        })
      })

      if (!paymentProofResponse.ok) {
        console.warn('Failed to create payment proof record')
      }
    } catch (error) {
      console.error('Error creating payment proof record:', error)
    }

    console.log('Payment proof uploaded:', {
      fileId,
      orderId,
      filename: req.file.filename,
      size: req.file.size
    })

    res.json({
      status: 'success',
      message: 'Payment proof uploaded successfully',
      data: {
        fileId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        uploadedAt: metadata.uploadedAt
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err)
      })
    }
    
    res.status(500).json({
      status: 'error',
      message: 'File upload failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
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

    // Generate metadata for legacy uploads
    const fileId = uuidv4()
    const metadata = {
      id: fileId,
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
      type: 'legacy'
    }

    fileMetadata.push(metadata)

    res.json({
      ok: true,
      file: {
        id: fileId,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedAt: metadata.uploadedAt
      }
    })
  } catch (error) {
    console.error('Legacy upload error:', error)
    
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err)
      })
    }
    
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
    
    // Security: validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid filename'
      })
    }

    // Try payment proofs directory first, then general uploads
    let filePath = path.join(paymentProofsDir, filename)
    if (!fs.existsSync(filePath)) {
      filePath = path.join(uploadsDir, filename)
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      })
    }

    // Get file metadata
    const metadata = fileMetadata.find(meta => meta.filename === filename)
    
    // Set appropriate headers
    if (metadata) {
      res.setHeader('Content-Type', metadata.mimetype)
      res.setHeader('Content-Disposition', `inline; filename="${metadata.originalName}"`)
    }

    res.sendFile(path.resolve(filePath))
  } catch (error) {
    console.error('File retrieval error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve file'
    })
  }
})

// Get file metadata
router.get('/metadata/:fileId', (req, res) => {
  try {
    const { fileId } = req.params
    const metadata = fileMetadata.find(meta => meta.id === fileId)
    
    if (!metadata) {
      return res.status(404).json({
        status: 'error',
        message: 'File metadata not found'
      })
    }

    // Remove sensitive path information
    const safeMetadata = {
      ...metadata,
      path: undefined,
      hash: undefined
    }

    res.json({
      status: 'success',
      data: safeMetadata
    })
  } catch (error) {
    console.error('Get metadata error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve file metadata'
    })
  }
})

// Delete file (admin only - implement authentication middleware)
router.delete('/file/:fileId', (req, res) => {
  try {
    const { fileId } = req.params
    const metadataIndex = fileMetadata.findIndex(meta => meta.id === fileId)
    
    if (metadataIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      })
    }

    const metadata = fileMetadata[metadataIndex]
    
    // Delete physical file
    if (fs.existsSync(metadata.path)) {
      fs.unlinkSync(metadata.path)
    }
    
    // Remove metadata
    fileMetadata.splice(metadataIndex, 1)

    res.json({
      status: 'success',
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('File deletion error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete file'
    })
  }
})

// Get upload statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalFiles: fileMetadata.length,
      totalSize: fileMetadata.reduce((sum, meta) => sum + meta.size, 0),
      fileTypes: fileMetadata.reduce((types, meta) => {
        types[meta.mimetype] = (types[meta.mimetype] || 0) + 1
        return types
      }, {}),
      statusCounts: fileMetadata.reduce((counts, meta) => {
        counts[meta.status] = (counts[meta.status] || 0) + 1
        return counts
      }, {}),
      uploadsByDate: fileMetadata.reduce((dates, meta) => {
        const date = meta.uploadedAt.split('T')[0]
        dates[date] = (dates[date] || 0) + 1
        return dates
      }, {})
    }

    res.json({
      status: 'success',
      data: stats
    })
  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve statistics'
    })
  }
})

module.exports = router
