import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, CheckIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline'
import { productsApi } from '../services/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-800', approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' }

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [adminResponse, setAdminResponse] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 20 }
      if (statusFilter) params.status = statusFilter
      const res = await productsApi.getReviews(params)
      setReviews(res.data || [])
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 })
    } catch (err) { toast.error('Failed to load reviews') }
    finally { setLoading(false) }
  }, [page, statusFilter])

  useEffect(() => { fetchReviews() }, [fetchReviews])
  useEffect(() => { setPage(1) }, [statusFilter])

  const handleUpdate = async (status) => {
    if (!selected) return
    setUpdating(true)
    try {
      await productsApi.updateReview(selected._id, { status, adminResponse: adminResponse || undefined })
      toast.success(`Review ${status}!`)
      setSelected(null); setAdminResponse('')
      fetchReviews()
    } catch (err) { toast.error('Failed to update review') }
    finally { setUpdating(false) }
  }

  const Stars = ({ rating }) => (
    <div className="flex items-center">
      {[1,2,3,4,5].map(i => <svg key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
    </div>
  )

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Reviews</h1><p className="text-gray-600">Moderate customer reviews ({pagination.total} total)</p></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', ''].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && reviews.length === 0 ? (
        <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <StarIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-500">No reviews found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <motion.div key={r._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-semibold text-primary-600">{r.reviewerName?.charAt(0)?.toUpperCase()}</div>
                      <div>
                        <div className="font-medium text-gray-900">{r.reviewerName}</div>
                        <div className="flex items-center gap-2"><Stars rating={r.rating} />{r.isVerifiedPurchase && <span className="text-xs text-green-600">✓ Verified</span>}</div>
                      </div>
                      <span className="text-xs text-gray-500 ml-auto">{fmt(r.createdAt)}</span>
                    </div>
                    {r.title && <h4 className="font-semibold text-gray-900 mb-1">{r.title}</h4>}
                    <p className="text-gray-700 text-sm">{r.comment}</p>
                    {r.adminResponse && <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm"><span className="font-medium">Your response: </span>{r.adminResponse}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                    <button onClick={() => { setSelected(r); setAdminResponse(r.adminResponse || '') }} className="text-primary-600 hover:text-primary-700 text-sm font-medium">Manage</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <span className="text-sm text-gray-600">Page {page} of {pagination.pages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Manage Review</h2>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2"><Stars rating={selected.rating} /><span className="font-medium">{selected.reviewerName}</span></div>
                  {selected.title && <h4 className="font-semibold mb-1">{selected.title}</h4>}
                  <p className="text-gray-700 text-sm">{selected.comment}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Response (optional)</label>
                  <textarea value={adminResponse} onChange={e => setAdminResponse(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500" placeholder="Reply to this review..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleUpdate('approved')} disabled={updating} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-1">
                    <CheckIcon className="w-4 h-4" />Approve
                  </button>
                  <button onClick={() => handleUpdate('rejected')} disabled={updating} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-1">
                    <XMarkIcon className="w-4 h-4" />Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
