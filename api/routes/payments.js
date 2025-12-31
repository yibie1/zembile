const express = require('express')
const router = express.Router()

// TODO: Implement Telebirr/CBE/Amole integration

// Placeholder: create payment
router.post('/create', (req,res) => {
  const {method, amount} = req.body
  // TODO: call real payment provider
  res.json({ok:true, method, amount, message: 'Payment creation endpoint (placeholder)'} )
})

// Placeholder: callback / webhook from provider
router.post('/callback', (req,res) => {
  // TODO: validate signature and update order
  res.json({ok:true})
})

module.exports = router
