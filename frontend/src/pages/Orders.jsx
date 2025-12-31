import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Orders() {
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Show success message if redirected from payment proof upload
    if (location.state?.message) {
      toast.success(location.state.message)
    }
    
    fetchOrders()
  }, [location.state])

  const fetchOrders = async () => {
    try {
      // TODO: Replace with actual user-specific orders API
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.status === 'success') {
        setOrders(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800'
      case 'payment_proof_uploaded':
        return 'bg-blue-100 text-blue-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_payment':
        return 'Pending Payment'
      case 'payment_proof_uploaded':
        return 'Payment Proof Uploaded'
      case 'paid':
        return 'Paid'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-zembile-gray">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/account" className="hover:text-zembile-gray">Account</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Orders</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Link
            to="/products"
            className="bg-zembile-yellow text-zembile-gray px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-zembile-yellow text-zembile-gray px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          Qty: {item.quantity} × {item.price?.toLocaleString()} ETB
                        </div>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {(item.price * item.quantity)?.toLocaleString()} ETB
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-200 mb-4" />

                {/* Order Summary */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    <div>Payment Method: {order.paymentMethod === 'chapa' ? 'Chapa Payment' : 'Bank Transfer'}</div>
                    {order.selectedBank && (
                      <div>Bank: {order.selectedBank}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      Total: {order.total?.toLocaleString()} ETB
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  {order.status === 'pending_payment' && order.paymentMethod === 'bank_transfer' && (
                    <Link
                      to="/payment-proof"
                      state={{
                        orderId: order.id,
                        amount: order.total,
                        bankAccount: order.selectedBank
                      }}
                      className="bg-zembile-yellow text-zembile-gray px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                    >
                      Upload Payment Proof
                    </Link>
                  )}
                  
                  <button className="text-zembile-gray hover:text-gray-600 font-medium">
                    View Details
                  </button>
                  
                  {(order.status === 'shipped' || order.status === 'delivered') && (
                    <button className="text-zembile-gray hover:text-gray-600 font-medium">
                      Track Package
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}