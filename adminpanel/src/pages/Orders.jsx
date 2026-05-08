import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, EyeIcon, XMarkIcon, TruckIcon, CheckIcon, ClockIcon } from '@heroicons/react/24/outline'
import { ordersApi } from '../services/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const STATUS_COLORS = { pending_payment: 'bg-yellow-100 text-yellow-800', payment_proof_uploaded: 'bg-blue-100 text-blue-800', paid: 'bg-green-100 text-green-800', processing: 'bg-indigo-100 text-indigo-800', shipped: 'bg-purple-100 text-purple-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800', payment_rejected: 'bg-red-100 text-red-800', refunded: 'bg-gray-100 text-gray-800' }
const VALID_STATUSES = ['pending_payment', 'payment_proof_uploaded', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusNote, setStatusNote] = useState('')

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 20 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const res = await ordersApi.getAll(params)
      setOrders(res.data || [])
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 })
    } catch (err) { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }, [page, search, statusFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])
  useEffect(() => { setPage(1) }, [search, statusFilter])

  const handleStatusUpdate = async () => {
    if (!newStatus || !selected) return
    setUpdatingStatus(true)
    try {
      const oid = selected.orderId || selected._id
      await ordersApi.updateStatus(oid, { status: newStatus, notes: statusNote })
      toast.success('Order status updated!')
      setSelected(null); setNewStatus(''); setStatusNote('')
      fetchOrders()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update status') }
    finally { setUpdatingStatus(false) }
  }

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (loading && orders.length === 0) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Orders</h1><p className="text-gray-600">Manage customer orders ({pagination.total} total)</p></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by order ID, customer name or email..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-primary-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500">
            <option value="">All Status</option>
            {VALID_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>{['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'Date', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {orders.map((o, i) => {
                  const oid = o.orderId || o._id
                  const total = o.pricing?.total || o.total || 0
                  return (
                    <motion.tr key={oid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">#{oid?.slice(-8)}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{o.customerInfo?.firstName} {o.customerInfo?.lastName}</div>
                        <div className="text-xs text-gray-500">{o.customerInfo?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{o.items?.length || 0} item(s)</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">ETB {total.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-800'}`}>{o.status?.replace(/_/g, ' ')}</span></td>
                      <td className="px-4 py-3 text-xs text-gray-600">{o.paymentMethod === 'chapa' ? 'Chapa' : 'Bank Transfer'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{fmt(o.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setSelected(o); setNewStatus(o.status) }} className="text-primary-600 hover:text-primary-900 p-1 rounded"><EyeIcon className="w-4 h-4" /></button>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {orders.length === 0 && !loading && (
          <div className="text-center py-12"><ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" /><p className="text-sm text-gray-500">No orders found</p></div>
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">Previous</button>
          <span className="text-sm text-gray-600">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">Next</button>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Order #{(selected.orderId || selected._id)?.slice(-8)}</h2>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Customer</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                        {[['Name', `${selected.customerInfo?.firstName} ${selected.customerInfo?.lastName}`], ['Email', selected.customerInfo?.email], ['Phone', selected.customerInfo?.phone], ['Address', `${selected.customerInfo?.address}, ${selected.customerInfo?.city}`]].map(([k, v]) => (
                          <div key={k}><span className="text-gray-500">{k}:</span><span className="ml-2 font-medium">{v}</span></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                      <div className="space-y-3">
                        <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500">
                          {VALID_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                        </select>
                        <textarea value={statusNote} onChange={e => setStatusNote(e.target.value)} placeholder="Optional note..." rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500" />
                        <button onClick={handleStatusUpdate} disabled={updatingStatus || newStatus === selected.status} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
                          {updatingStatus ? 'Updating...' : 'Update Status'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {selected.items?.map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📦</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm truncate">{item.name}</div>
                            <div className="text-xs text-gray-500">×{item.quantity} @ ETB {item.price?.toLocaleString()}</div>
                          </div>
                          <div className="font-semibold text-sm">ETB {(item.price * item.quantity)?.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 bg-primary-50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{(selected.pricing?.subtotal || 0).toLocaleString()} ETB</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{(selected.pricing?.shippingCost || 0) === 0 ? 'Free' : `${selected.pricing?.shippingCost} ETB`}</span></div>
                      <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-primary-600">ETB {(selected.pricing?.total || selected.total || 0).toLocaleString()}</span></div>
                    </div>
                    {selected.statusHistory?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Status History</h4>
                        <div className="space-y-2">
                          {selected.statusHistory.map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                              <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0" />
                              <span className="capitalize font-medium">{h.status?.replace(/_/g, ' ')}</span>
                              <span className="text-gray-400">{fmt(h.updatedAt)}</span>
                              {h.notes && <span className="text-gray-500 italic">— {h.notes}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
