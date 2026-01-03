const express = require('express')
const { Chapa } = require('chapa-nodejs')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')
const validator = require('validator')
const DatabaseService = require('../services/database')
const router = express.Router()

// Initialize Chapa with API key
const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY || 'test_secret_key'
})

// Helper function to generate transaction reference
const generateTxRef = () => {
  return `zembile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper function to validate Ethiopian phone number
const validateEthiopianPhone = (phone) => {
  // Ethiopian phone number patterns: +251-9-XX-XX-XX-XX or 09XXXXXXXX
  const patterns = [
    /^\+251-?9-?\d{2}-?\d{2}-?\d{2}-?\d{2}$/,
    /^09\d{8}$/,
    /^9\d{8}$/,
    /^\+2519\d{8}$/
  ]
  return patterns.some(pattern => pattern.test(phone.replace(/\s/g, '')))
}

// Chapa Payment Initialization
router.post('/chapa/initialize', async (req, res) => {
  try {
    const {
      amount,
      currency = 'ETB',
      email,
      first_name,
      last_name,
      phone_number,
      tx_ref,
      callback_url,
      return_url,
      customization
    } = req.body

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid amount is required'
      })
    }

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid email is required'
      })
    }

    if (!first_name || !last_name) {
      return res.status(400).json({
        status: 'error',
        message: 'First name and last name are required'
      })
    }

    if (!phone_number || !validateEthiopianPhone(phone_number)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid Ethiopian phone number is required'
      })
    }

    // Generate transaction reference if not provided
    const transactionRef = tx_ref || generateTxRef()

    // Prepare Chapa payment data
    const paymentData = {
      amount: parseFloat(amount),
      currency: currency,
      email: email.toLowerCase(),
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      tx_ref: transactionRef,
      callback_url: callback_url || `${process.env.API_BASE_URL}/api/chapa/callback`,
      return_url: return_url || `${process.env.FRONTEND_URL}/payment/success`,
      customization: {
        title: 'Zembile Marketplace',
        description: 'Payment for your order',
        logo: `${process.env.FRONTEND_URL}/logo.svg`,
        ...customization
      }
    }

    // Store transaction record
    const transaction = {
      id: uuidv4(),
      tx_ref: transactionRef,
      amount: paymentData.amount,
      currency: paymentData.currency,
      email: paymentData.email,
      phone_number: paymentData.phone_number,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    transactions.push(transaction)

    // Initialize payment with Chapa
    if (process.env.CHAPA_SECRET_KEY && process.env.CHAPA_SECRET_KEY !== 'test_secret_key') {
      try {
        const chapaResponse = await chapa.initialize(paymentData)
        
        if (chapaResponse.status === 'success') {
          // Update transaction with Chapa response
          const txIndex = transactions.findIndex(tx => tx.tx_ref === transactionRef)
          if (txIndex !== -1) {
            transactions[txIndex].chapa_reference = chapaResponse.data.reference
            transactions[txIndex].checkout_url = chapaResponse.data.checkout_url
          }

          return res.json({
            status: 'success',
            message: 'Payment initialized successfully',
            data: {
              checkout_url: chapaResponse.data.checkout_url,
              tx_ref: transactionRef,
              reference: chapaResponse.data.reference
            }
          })
        } else {
          throw new Error(chapaResponse.message || 'Payment initialization failed')
        }
      } catch (chapaError) {
        console.error('Chapa API Error:', chapaError)
        
        // Return mock response for development
        const mockCheckoutUrl = `https://checkout.chapa.co/checkout/payment/${transactionRef}`
        
        return res.json({
          status: 'success',
          message: 'Payment initialized successfully (Mock Mode)',
          data: {
            checkout_url: mockCheckoutUrl,
            tx_ref: transactionRef,
            reference: `mock_${transactionRef}`
          },
          mock: true
        })
      }
    } else {
      // Mock response for development
      const mockCheckoutUrl = `https://checkout.chapa.co/checkout/payment/${transactionRef}`
      
      return res.json({
        status: 'success',
        message: 'Payment initialized successfully (Mock Mode)',
        data: {
          checkout_url: mockCheckoutUrl,
          tx_ref: transactionRef,
          reference: `mock_${transactionRef}`
        },
        mock: true
      })
    }
  } catch (error) {
    console.error('Payment initialization error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Payment initialization failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Chapa Payment Verification
router.get('/chapa/verify/:tx_ref', async (req, res) => {
  try {
    const { tx_ref } = req.params

    if (!tx_ref) {
      return res.status(400).json({
        status: 'error',
        message: 'Transaction reference is required'
      })
    }

    // Find transaction in our records
    const transaction = transactions.find(tx => tx.tx_ref === tx_ref)
    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      })
    }

    // Verify with Chapa if not in mock mode
    if (process.env.CHAPA_SECRET_KEY && process.env.CHAPA_SECRET_KEY !== 'test_secret_key') {
      try {
        const verification = await chapa.verify(tx_ref)
        
        if (verification.status === 'success') {
          // Update transaction status
          const txIndex = transactions.findIndex(tx => tx.tx_ref === tx_ref)
          if (txIndex !== -1) {
            transactions[txIndex].status = verification.data.status
            transactions[txIndex].chapa_data = verification.data
            transactions[txIndex].updated_at = new Date().toISOString()
          }

          return res.json({
            status: 'success',
            data: verification.data
          })
        } else {
          throw new Error(verification.message || 'Verification failed')
        }
      } catch (chapaError) {
        console.error('Chapa verification error:', chapaError)
        
        // Return mock verification for development
        return res.json({
          status: 'success',
          data: {
            tx_ref: tx_ref,
            status: 'success',
            amount: transaction.amount,
            currency: transaction.currency,
            created_at: transaction.created_at
          },
          mock: true
        })
      }
    } else {
      // Mock verification response
      return res.json({
        status: 'success',
        data: {
          tx_ref: tx_ref,
          status: 'success',
          amount: transaction.amount,
          currency: transaction.currency,
          created_at: transaction.created_at
        },
        mock: true
      })
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Payment verification failed'
    })
  }
})

// Chapa Payment Callback/Webhook
router.post('/chapa/callback', (req, res) => {
  try {
    const signature = req.headers['chapa-signature']
    const payload = JSON.stringify(req.body)
    
    // Verify webhook signature if webhook secret is configured
    if (process.env.CHAPA_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.CHAPA_WEBHOOK_SECRET)
        .update(payload)
        .digest('hex')
      
      if (signature !== expectedSignature) {
        console.warn('Invalid webhook signature')
        return res.status(401).json({
          status: 'error',
          message: 'Invalid signature'
        })
      }
    }

    const { tx_ref, status, reference, amount, currency } = req.body
    
    console.log('Chapa callback received:', { tx_ref, status, reference, amount, currency })
    
    // Find and update transaction
    const txIndex = transactions.findIndex(tx => tx.tx_ref === tx_ref)
    if (txIndex !== -1) {
      transactions[txIndex].status = status
      transactions[txIndex].chapa_reference = reference
      transactions[txIndex].callback_data = req.body
      transactions[txIndex].updated_at = new Date().toISOString()
    }
    
    // Find and update related order
    const orderIndex = orders.findIndex(order => order.tx_ref === tx_ref)
    if (orderIndex !== -1) {
      if (status === 'success') {
        orders[orderIndex].status = 'paid'
        orders[orderIndex].payment_reference = reference
        orders[orderIndex].paid_at = new Date().toISOString()
      } else if (status === 'failed') {
        orders[orderIndex].status = 'payment_failed'
      }
      orders[orderIndex].updated_at = new Date().toISOString()
    }
    
    res.json({ status: 'success' })
  } catch (error) {
    console.error('Chapa callback error:', error)
    res.status(500).json({ 
      status: 'error', 
      message: 'Callback processing failed' 
    })
  }
})

// Create Order (for both Chapa and bank transfer)
router.post('/orders', (req, res) => {
  try {
    const {
      items,
      customerInfo,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      selectedBank,
      tx_ref
    } = req.body

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Order items are required'
      })
    }

    if (!customerInfo || !customerInfo.email || !customerInfo.firstName) {
      return res.status(400).json({
        status: 'error',
        message: 'Customer information is required'
      })
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid total amount is required'
      })
    }

    if (!paymentMethod || !['chapa', 'bank_transfer'].includes(paymentMethod)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid payment method is required'
      })
    }

    const orderId = `ZMB${Date.now()}`
    const order = {
      id: orderId,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        selectedSize: item.selectedSize,
        subtotal: parseFloat(item.price) * parseInt(item.quantity)
      })),
      customerInfo: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email.toLowerCase(),
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        region: customerInfo.region
      },
      pricing: {
        subtotal: parseFloat(subtotal),
        shippingCost: parseFloat(shippingCost),
        total: parseFloat(total)
      },
      paymentMethod,
      selectedBank: paymentMethod === 'bank_transfer' ? selectedBank : null,
      tx_ref: tx_ref || null,
      status: paymentMethod === 'chapa' ? 'pending_payment' : 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    orders.push(order)

    res.json({
      status: 'success',
      orderId: orderId,
      message: 'Order created successfully',
      data: {
        orderId,
        status: order.status,
        total: order.pricing.total,
        paymentMethod: order.paymentMethod
      }
    })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Order creation failed'
    })
  }
})

// Get Order Details
router.get('/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params
    const order = orders.find(o => o.id === orderId)
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      })
    }

    // Include payment proof if exists
    const paymentProof = paymentProofs.find(proof => proof.orderId === orderId)

    res.json({
      status: 'success',
      data: {
        ...order,
        paymentProof: paymentProof || null
      }
    })
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve order'
    })
  }
})

// Payment Proof Upload (metadata only - file handled by uploads route)
router.post('/payment-proof', (req, res) => {
  try {
    const {
      orderId,
      transactionRef,
      transactionDate,
      bankId,
      amount,
      notes,
      filename
    } = req.body

    // Validation
    if (!orderId || !transactionRef || !transactionDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Order ID, transaction reference, and transaction date are required'
      })
    }

    // Find the order
    const orderIndex = orders.findIndex(o => o.id === orderId)
    if (orderIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      })
    }

    // Validate transaction date
    const txDate = new Date(transactionDate)
    const now = new Date()
    if (txDate > now) {
      return res.status(400).json({
        status: 'error',
        message: 'Transaction date cannot be in the future'
      })
    }

    // Create payment proof record
    const proofId = `PROOF${Date.now()}`
    const paymentProof = {
      id: proofId,
      orderId,
      transactionRef: transactionRef.trim(),
      transactionDate,
      bankId,
      amount: amount ? parseFloat(amount) : null,
      notes: notes ? notes.trim() : '',
      filename: filename || null,
      status: 'pending_verification',
      uploadedAt: new Date().toISOString(),
      verifiedAt: null,
      verifiedBy: null,
      verificationNotes: ''
    }

    paymentProofs.push(paymentProof)

    // Update order status
    orders[orderIndex].status = 'payment_proof_uploaded'
    orders[orderIndex].paymentProofId = proofId
    orders[orderIndex].updatedAt = new Date().toISOString()

    res.json({
      status: 'success',
      proofId: proofId,
      message: 'Payment proof uploaded successfully',
      data: {
        proofId,
        orderId,
        status: 'pending_verification'
      }
    })
  } catch (error) {
    console.error('Payment proof upload error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Payment proof upload failed'
    })
  }
})

// Get all orders (with pagination)
router.get('/orders', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const status = req.query.status
    const paymentMethod = req.query.paymentMethod

    let filteredOrders = [...orders]

    // Apply filters
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status)
    }
    if (paymentMethod) {
      filteredOrders = filteredOrders.filter(order => order.paymentMethod === paymentMethod)
    }

    // Sort by creation date (newest first)
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

    res.json({
      status: 'success',
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        pages: Math.ceil(filteredOrders.length / limit)
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve orders'
    })
  }
})

// Get all payment proofs (with pagination)
router.get('/payment-proofs', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const status = req.query.status

    let filteredProofs = [...paymentProofs]

    // Apply status filter
    if (status) {
      filteredProofs = filteredProofs.filter(proof => proof.status === status)
    }

    // Sort by upload date (newest first)
    filteredProofs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProofs = filteredProofs.slice(startIndex, endIndex)

    res.json({
      status: 'success',
      data: paginatedProofs,
      pagination: {
        page,
        limit,
        total: filteredProofs.length,
        pages: Math.ceil(filteredProofs.length / limit)
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

// Get transaction by reference
router.get('/transactions/:tx_ref', (req, res) => {
  try {
    const { tx_ref } = req.params
    const transaction = transactions.find(tx => tx.tx_ref === tx_ref)
    
    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      })
    }

    res.json({
      status: 'success',
      data: transaction
    })
  } catch (error) {
    console.error('Get transaction error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve transaction'
    })
  }
})

module.exports = router
