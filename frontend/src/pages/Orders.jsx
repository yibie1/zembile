import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const STATUS_COLORS = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  payment_proof_uploaded: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  payment_rejected: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
}

const STATUS_LABELS = {
  pending_payment: 'Pending Payment',
  payment_proof_uploaded: 'Proof Uploaded',
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  payment_rejected: 'Payment Rejected',
  refunded: 'Refunded'
}

export default function Orders() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    if (!user && !token) { navigate('/auth/login'); return }
    if (location.state?.message) toast.success(location.state.message)
    fetchOrders()
  }, [user, token])

  const fetchOrders = async () => {
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`
      const res = await fetch(`${API}/orders`, { headers })
      const data = await res.json()
      if (data.status === 'success') setOrders(data.data || [])
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-zembile-gray">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">My Orders</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Link to="/products" className="bg-zembile-yellow text-zembile-gray px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors text-sm">Continue Shopping</Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
            <Link to="/products" className="bg-zembile-yellow text-zembile-gray px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const oid = order.orderId || order._id || order.id
              const isExpanded = expandedOrder === oid
              const total = order.pricing?.total || order.total || 0
              return (
                <div key={oid} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Order #{oid}</h3>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium self-start ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>

                    {/* Items preview */}
                    <div className="flex items-center gap-3 mb-4">
                      {order.items?.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">📦</div>
                          <div>
                            <div className="font-medium text-gray-900 text-xs line-clamp-1">{item.name}</div>
                            <div className="text-xs text-gray-500">×{item.quantity}</div>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 3 && <span className="text-sm text-gray-500">+{order.items.length - 3} more</span>}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-sm text-gray-600">
                        <span>Payment: </span>
                        <span className="font-medium">{order.paymentMethod === 'chapa' ? 'Chapa' : 'Bank Transfer'}</span>
                        <span className="mx-2">•</span>
                        <span className="font-bold text-gray-900">{total.toLocaleString()} ETB</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {order.status === 'pending_payment' && order.paymentMethod === 'bank_transfer' && (
                          <Link to="/payment-proof" state={{ orderId: oid, amount: total }} className="bg-zembile-yellow text-zembile-gray px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-sm">Upload Proof</Link>
                        )}
                        <button onClick={() => setExpandedOrder(isExpanded ? null : oid)} className="text-zembile-gray hover:text-gray-600 font-medium text-sm">
                          {isExpanded ? 'Hide Details ↑' : 'View Details ↓'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                          <div className="space-y-3">
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <div>
                                  <div className="font-medium text-gray-900">{item.name}</div>
                                  <div className="text-gray-500">×{item.quantity} @ {item.price?.toLocaleString()} ETB</div>
                                </div>
                                <div className="font-semibold">{(item.price * item.quantity)?.toLocaleString()} ETB</div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{(order.pricing?.subtotal || order.subtotal || 0).toLocaleString()} ETB</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{(order.pricing?.shippingCost || order.shippingCost || 0) === 0 ? 'Free' : `${order.pricing?.shippingCost || order.shippingCost} ETB`}</span></div>
                            <div className="flex justify-between font-bold text-base"><span>Total</span><span>{total.toLocaleString()} ETB</span></div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Delivery Address</h4>
                          {order.customerInfo && (
                            <div className="text-sm text-gray-700 space-y-1">
                              <div className="font-medium">{order.customerInfo.firstName} {order.customerInfo.lastName}</div>
                              <div>{order.customerInfo.address}</div>
                              <div>{order.customerInfo.city}{order.customerInfo.region ? `, ${order.customerInfo.region}` : ''}</div>
                              <div>{order.customerInfo.phone}</div>
                            </div>
                          )}
                          {order.statusHistory?.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-semibold text-gray-900 mb-2">Status History</h4>
                              <div className="space-y-2">
                                {order.statusHistory.slice(-3).map((h, i) => (
                                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="w-2 h-2 bg-zembile-yellow rounded-full flex-shrink-0" />
                                    <span className="capitalize">{STATUS_LABELS[h.status] || h.status}</span>
                                    <span className="text-gray-400">{new Date(h.updatedAt).toLocaleDateString()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
