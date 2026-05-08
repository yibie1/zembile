import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'

// Ethiopian Bank Accounts for Manual Transfer
const BANK_ACCOUNTS = [
  {
    id: 'cbe',
    name: 'Commercial Bank of Ethiopia (CBE)',
    accountNumber: '1000123456789',
    accountName: 'Zembile Marketplace PLC',
    swiftCode: 'CBETETAA',
    branch: 'Addis Ababa Main Branch'
  },
  {
    id: 'dashen',
    name: 'Dashen Bank',
    accountNumber: '0012345678901',
    accountName: 'Zembile Marketplace PLC',
    swiftCode: 'DASHETET',
    branch: 'Bole Branch'
  },
  {
    id: 'awash',
    name: 'Awash Bank',
    accountNumber: '01320000123456',
    accountName: 'Zembile Marketplace PLC',
    swiftCode: 'AWASETET',
    branch: 'Kazanchis Branch'
  },
  {
    id: 'boa',
    name: 'Bank of Abyssinia',
    accountNumber: '123456789012',
    accountName: 'Zembile Marketplace PLC',
    swiftCode: 'ABYSETAA',
    branch: 'Piazza Branch'
  }
]

export default function Checkout() {
  const { items, totalPrice, clear } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Form states
  const [paymentMethod, setPaymentMethod] = useState('chapa')
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: ''
  })
  const [selectedBank, setSelectedBank] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderAmount, setOrderAmount] = useState(0)

  // Calculate totals
  const subtotal = totalPrice
  const shippingCost = subtotal >= 500 ? 0 : 50
  const total = subtotal + shippingCost

  useEffect(() => {
    // Handle direct product checkout
    const params = new URLSearchParams(location.search)
    const productId = params.get('product')
    
    if (productId && items.length === 0) {
      // Redirect to product page if no items in cart
      navigate(`/product/${productId}`)
      return
    }
    
    setOrderAmount(total)
  }, [items, total, location.search, navigate])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      navigate('/cart')
    }
  }, [items.length, navigate])

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city']
    const missing = required.filter(field => !customerInfo[field].trim())
    
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(', ')}`)
      return false
    }

    if (paymentMethod === 'bank_transfer' && !selectedBank) {
      toast.error('Please select a bank for transfer')
      return false
    }

    return true
  }

  const handleChapaPayment = async (orderData) => {
    try {
      // Normalize phone: strip spaces, dashes, parentheses
      const normalizedPhone = customerInfo.phone.replace(/[\s\-\(\)]/g, '')

      // Initialize Chapa payment
      const chapaResponse = await fetch('/api/chapa/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: orderAmount,
          currency: 'ETB',
          email: customerInfo.email,
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          phone_number: normalizedPhone,
          tx_ref: `zembile_${Date.now()}`,
          callback_url: `${window.location.origin}/payment/callback`,
          return_url: `${window.location.origin}/payment/success`,
          customization: {
            title: 'Zembile Marketplace',
            description: 'Payment for your order'
          }
        })
      })

      const chapaData = await chapaResponse.json()

      if (chapaData.status === 'success') {
        // Redirect to Chapa checkout
        window.location.href = chapaData.data.checkout_url
      } else {
        throw new Error(chapaData.message || 'Payment initialization failed')
      }
    } catch (error) {
      console.error('Chapa payment error:', error)
      toast.error('Payment initialization failed. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleBankTransfer = async (orderData) => {
    try {
      // Create order for bank transfer
      const token = (() => { try { return JSON.parse(localStorage.getItem('zembile_auth_v1'))?.token } catch { return null } })()
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...orderData,
          paymentMethod: 'bank_transfer',
          selectedBank: selectedBank,
          status: 'pending_payment'
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Clear cart and redirect to payment proof upload
        clear()
        toast.success('Order created! Please complete your bank transfer and upload payment proof.')
        navigate('/payment-proof', { 
          state: { 
            orderId: result.orderId,
            bankAccount: BANK_ACCOUNTS.find(bank => bank.id === selectedBank),
            amount: orderAmount
          }
        })
      } else {
        throw new Error(result.message || 'Order creation failed')
      }
    } catch (error) {
      console.error('Bank transfer order error:', error)
      toast.error('Order creation failed. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsProcessing(true)

    const orderData = {
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        selectedSize: item.selectedSize
      })),
      customerInfo,
      subtotal,
      shippingCost,
      total: orderAmount,
      paymentMethod
    }

    try {
      if (paymentMethod === 'chapa') {
        await handleChapaPayment(orderData)
      } else if (paymentMethod === 'bank_transfer') {
        await handleBankTransfer(orderData)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Checkout failed. Please try again.')
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  if (items.length === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-zembile-gray">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/cart" className="hover:text-zembile-gray">Cart</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information & Payment */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="0912345678 or +251912345678"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                    <select
                      value={customerInfo.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent"
                    >
                      <option value="">Select Region</option>
                      <option value="addis-ababa">Addis Ababa</option>
                      <option value="oromia">Oromia</option>
                      <option value="amhara">Amhara</option>
                      <option value="tigray">Tigray</option>
                      <option value="snnp">SNNP</option>
                      <option value="somali">Somali</option>
                      <option value="afar">Afar</option>
                      <option value="benishangul">Benishangul-Gumuz</option>
                      <option value="gambela">Gambela</option>
                      <option value="harari">Harari</option>
                      <option value="dire-dawa">Dire Dawa</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  {/* Chapa Payment */}
                  <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="chapa"
                      checked={paymentMethod === 'chapa'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Chapa Payment Gateway</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Pay securely with Telebirr, CBE Birr, or other mobile money services
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Instant</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Secure</span>
                      </div>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Bank Transfer</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Transfer to our bank account and upload payment proof
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Manual Verification</span>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">1-2 Days</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Bank Selection for Bank Transfer */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Select Bank Account</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {BANK_ACCOUNTS.map((bank) => (
                        <label
                          key={bank.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedBank === bank.id
                              ? 'border-zembile-yellow bg-yellow-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="selectedBank"
                            value={bank.id}
                            checked={selectedBank === bank.id}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="sr-only"
                          />
                          <div className="font-semibold text-gray-900">{bank.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            <div>Account: {bank.accountNumber}</div>
                            <div>Branch: {bank.branch}</div>
                          </div>
                          {selectedBank === bank.id && (
                            <div className="mt-3 p-3 bg-white rounded border">
                              <div className="text-xs space-y-1">
                                <div className="flex justify-between">
                                  <span>Account Name:</span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(bank.accountName)}
                                    className="text-zembile-gray hover:text-gray-600"
                                  >
                                    {bank.accountName} 📋
                                  </button>
                                </div>
                                <div className="flex justify-between">
                                  <span>Account Number:</span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(bank.accountNumber)}
                                    className="text-zembile-gray hover:text-gray-600"
                                  >
                                    {bank.accountNumber} 📋
                                  </button>
                                </div>
                                <div className="flex justify-between">
                                  <span>Swift Code:</span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(bank.swiftCode)}
                                    className="text-zembile-gray hover:text-gray-600"
                                  >
                                    {bank.swiftCode} 📋
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-1">{item.name}</div>
                        <div className="text-xs text-gray-600">
                          Qty: {item.qty} × {item.price.toLocaleString()} ETB
                        </div>
                      </div>
                      <div className="font-semibold text-sm">
                        {(item.price * item.qty).toLocaleString()} ETB
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-200 mb-4" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{subtotal.toLocaleString()} ETB</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `${shippingCost} ETB`
                      )}
                    </span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{total.toLocaleString()} ETB</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-zembile-yellow text-zembile-gray py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-zembile-gray border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Place Order - ${total.toLocaleString()} ETB`
                  )}
                </button>

                {/* Security Notice */}
                <div className="mt-4 text-xs text-gray-500 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure Checkout
                  </div>
                  <p>Your information is protected with SSL encryption</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
