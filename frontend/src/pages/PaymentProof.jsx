import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

// Ethiopian Bank Accounts for Reference
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

export default function PaymentProof() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get order details from navigation state
  const orderDetails = location.state || {}
  const { orderId, bankAccount, amount } = orderDetails

  // Form states
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [transactionRef, setTransactionRef] = useState('')
  const [transactionDate, setTransactionDate] = useState('')
  const [notes, setNotes] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // Redirect if no order details
  useEffect(() => {
    if (!orderId) {
      toast.error('No order information found')
      navigate('/cart')
    }
  }, [orderId, navigate])

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please select an image (JPG, PNG, WebP) or PDF file')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (selectedFile.size > maxSize) {
      toast.error('File size must be less than 5MB')
      return
    }

    setFile(selectedFile)

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setFilePreview(e.target.result)
      reader.readAsDataURL(selectedFile)
    } else {
      setFilePreview(null)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      toast.error('Please select a payment proof file')
      return
    }

    if (!transactionRef.trim()) {
      toast.error('Please enter transaction reference number')
      return
    }

    if (!transactionDate) {
      toast.error('Please select transaction date')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('proof', file)
      formData.append('orderId', orderId)
      formData.append('transactionRef', transactionRef)
      formData.append('transactionDate', transactionDate)
      formData.append('bankId', bankAccount?.id || '')
      formData.append('amount', amount || '')
      formData.append('notes', notes)

      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/payment-proof', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Payment proof uploaded successfully! We will verify and process your order within 1-2 business days.')
        
        // Redirect to order confirmation or tracking page
        navigate('/account/orders', { 
          state: { 
            message: 'Payment proof uploaded successfully',
            orderId: orderId
          }
        })
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload payment proof. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!orderId) {
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
            <Link to="/checkout" className="hover:text-zembile-gray">Checkout</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Payment Proof</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Payment Proof</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Please upload your payment receipt or bank transfer confirmation. 
              We will verify your payment and process your order within 1-2 business days.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bank Account Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Bank Account Details</h2>
              
              {bankAccount ? (
                <div className="space-y-4">
                  <div className="bg-zembile-yellow bg-opacity-10 border border-zembile-yellow border-opacity-30 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{bankAccount.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Account Name:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{bankAccount.accountName}</span>
                          <button
                            onClick={() => copyToClipboard(bankAccount.accountName)}
                            className="text-zembile-gray hover:text-gray-600 p-1"
                            title="Copy to clipboard"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Account Number:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium font-mono">{bankAccount.accountNumber}</span>
                          <button
                            onClick={() => copyToClipboard(bankAccount.accountNumber)}
                            className="text-zembile-gray hover:text-gray-600 p-1"
                            title="Copy to clipboard"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Swift Code:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium font-mono">{bankAccount.swiftCode}</span>
                          <button
                            onClick={() => copyToClipboard(bankAccount.swiftCode)}
                            className="text-zembile-gray hover:text-gray-600 p-1"
                            title="Copy to clipboard"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Branch:</span>
                        <span className="font-medium">{bankAccount.branch}</span>
                      </div>
                    </div>
                  </div>

                  {amount && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-green-800 font-medium">Amount to Transfer:</span>
                        <span className="text-2xl font-bold text-green-900">
                          {amount.toLocaleString()} ETB
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Please transfer the payment to any of our bank accounts:
                  </p>
                  <div className="space-y-3">
                    {BANK_ACCOUNTS.map((bank) => (
                      <div key={bank.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="font-semibold text-gray-900">{bank.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Account: {bank.accountNumber} | Branch: {bank.branch}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium font-mono">{orderId}</span>
                  </div>
                  {amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">{amount.toLocaleString()} ETB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Payment Proof</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Receipt/Screenshot *
                  </label>
                  
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive
                        ? 'border-zembile-yellow bg-yellow-50'
                        : file
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {file ? (
                      <div className="space-y-3">
                        {filePreview ? (
                          <img
                            src={filePreview}
                            alt="Payment proof preview"
                            className="max-w-full max-h-32 mx-auto rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{file.name}</div>
                          <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null)
                            setFilePreview(null)
                          }}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium text-zembile-gray">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, WebP or PDF (max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction Reference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Reference Number *
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="Enter transaction reference from your bank receipt"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent"
                    required
                  />
                </div>

                {/* Transaction Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Date *
                  </label>
                  <input
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent"
                    required
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information about your payment..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isUploading || !file}
                  className="w-full bg-zembile-yellow text-zembile-gray py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-zembile-gray border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </div>
                  ) : (
                    'Submit Payment Proof'
                  )}
                </button>
              </form>

              {/* Help Text */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Tips for better verification:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure the receipt shows the exact amount transferred</li>
                  <li>• Include the transaction reference number clearly</li>
                  <li>• Make sure the image is clear and readable</li>
                  <li>• Upload the original receipt without editing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What happens next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📤</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Upload Proof</h3>
                <p className="text-sm text-gray-600">
                  Submit your payment receipt and transaction details
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🔍</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Verification</h3>
                <p className="text-sm text-gray-600">
                  Our team verifies your payment within 1-2 business days
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🚚</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Processing</h3>
                <p className="text-sm text-gray-600">
                  Once verified, we prepare and ship your order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
