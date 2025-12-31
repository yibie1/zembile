const express = require('express')
const router = express.Router()

// Mock database - In production, use a real database
let orders = []
let paymentProofs = []

// Chapa Payment Integration
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

    // TODO: Replace with actual Chapa API integration
    // const chapaResponse = await fetch('https://api.chapa.co/v1/transaction/initialize', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     amount,
    //     currency,
    //     email,
    //     first_name,
    //     last_name,
    //     phone_number,
    //     tx_ref,
    //     callback_url,
    //     return_url,
    //     customization
    //   })
    // })

    // Mock Chapa response for development
    const mockChapaResponse = {
      status: 'success',
      message: 'Payment initialized successfully',
      data: {
        checkout_url: `https://checkout.chapa.co/checkout/payment/${tx_ref}`,
        tx_ref: tx_ref
      }
    }

    res.json(mockChapaResponse)
  } catch (error) {
    console.error('Chapa initialization error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Payment initialization failed'
    })
  }
})

// Chapa Payment Callback/Webhook
router.post('/chapa/callback', (req, res) => {
  try {
    const { tx_ref, status, reference } = req.body
    
    // TODO: Verify webhook signature with Chapa
    // TODO: Update order status in database
    
    console.log('Chapa callback received:', { tx_ref, status, reference })
    
    if (status === 'success') {
      // Update order status to paid
      const orderIndex = orders.findIndex(order => order.tx_ref === tx_ref)
      if (orderIndex !== -1) {
        orders[orderIndex].status = 'paid'
        orders[orderIndex].payment_reference = reference
      }
    }
    
    res.json({ status: 'success' })
  } catch (error) {
    console.error('Chapa callback error:', error)
    res.status(500).json({ status: 'error', message: 'Callback processing failed' })
  }
})

// Create Order (for bank transfer)
router.post('/orders', (req, res) => {
  try {
    const {
      items,
      customerInfo,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      selectedBank
    } = req.body

    const orderId = `ZMB${Date.now()}`
    const order = {
      id: orderId,
      items,
      customerInfo,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      selectedBank,
      status: 'pending_payment',
      createdAt: new Date().toISOString()
    }

    orders.push(order)

    res.json({
      status: 'success',
      orderId: orderId,
      message: 'Order created successfully'
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

    res.json({
      status: 'success',
      data: order
    })
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve order'
    })
  }
})

// Payment Proof Upload
router.post('/payment-proof', (req, res) => {
  try {
    const {
      orderId,
      transactionRef,
      transactionDate,
      bankId,
      amount,
      notes
    } = req.body

    // Find the order
    const orderIndex = orders.findIndex(o => o.id === orderId)
    if (orderIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      })
    }

    // Create payment proof record
    const proofId = `PROOF${Date.now()}`
    const paymentProof = {
      id: proofId,
      orderId,
      transactionRef,
      transactionDate,
      bankId,
      amount,
      notes,
      status: 'pending_verification',
      uploadedAt: new Date().toISOString()
    }

    paymentProofs.push(paymentProof)

    // Update order status
    orders[orderIndex].status = 'payment_proof_uploaded'
    orders[orderIndex].paymentProofId = proofId

    res.json({
      status: 'success',
      proofId: proofId,
      message: 'Payment proof uploaded successfully'
    })
  } catch (error) {
    console.error('Payment proof upload error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Payment proof upload failed'
    })
  }
})

// Get all orders (for admin)
router.get('/orders', (req, res) => {
  res.json({
    status: 'success',
    data: orders
  })
})

// Get all payment proofs (for admin)
router.get('/payment-proofs', (req, res) => {
  res.json({
    status: 'success',
    data: paymentProofs
  })
})

module.exports = router
