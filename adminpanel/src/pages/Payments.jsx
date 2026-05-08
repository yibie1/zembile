import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline'
import { paymentsApi } from '../services/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const STATUS_COLORS = { pending_verification: 'bg-yellow-100 text-yellow-800', verified: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' }

export default function Payments() {
  const [proofs, setProofs] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [verifyNote, setVerifyNote] = useState('')
  const [verifying, setVerifying] = useState(false)

  const fetchProofs = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 20 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const res = await paymentsApi.getProofs(params)
      setProofs(res.data || [])
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 })
    } catch (err) { toast.error('Failed to load payment proofs') }
    finally { setLoading(false) }
  }, [page, search, statusFilter])

  useEffect(() => { fetchProofs() }, [fetchProofs])
  useEffect(() => { setPage(1) }, [search, statusFilter])

  const handleVerify = async (status) => {
    if (!selected) return
    setVerifying(true)
    try {
      await paymentsApi.verify(selected._id || selected.id, { status, notes: verifyNote })
      toast.success(`Payment proof ${status}!`)
      setSelected(null); setVerifyNote('')
      fetchProofs()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to verify proof') }
    finally { setVerifying(false) }
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

  // Stats
  const pending = proofs.filter(p => p.status === 'pending_verification').length
  const verified = proofs.filter(p => p.status === 'verified').length
  const rejected = proofs.filter(p => p.status === 'rejected').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Payment Proofs</h1><p className="text-gray-600">Verify bank transfer payment proofs</p></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{ label: 'Pending Review', value: pending, cls: 'bg-yellow-50 border-yellow-200 text-yellow-800' }, { label: 'Verified', value: verified, cls: 'bg-green-50 border-green-200 text-green-800' }, { label: 'Rejected', value: rejected, cls: 'bg-red-50 border-red-200 text-red-800' }].map(s => (
          <div key={s.label} className={`rounded-xl border p-6 ${s.cls}`}>
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-sm font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by order ID or transaction ref..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-primary-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500">
            <option value="">All Status</option>
            <option value="pending_verification">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading && proofs.length === 0 ? (
        <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
      ) : proofs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <div className="text-5xl mb-3">💳</div>
          <p className="text-sm text-gray-500">No payment proofs found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>{['Order ID', 'Transaction Ref', 'Amount', 'Bank', 'Date', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proofs.map((p, i) => (
                    <motion.tr key={p._id || p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">#{p.orderId?.slice(-8)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{p.transactionRef}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">ETB {p.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.bankId || '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{fmt(p.createdAt)}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-800'}`}>{p.status?.replace(/_/g, ' ')}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelected(p); setVerifyNote('') }} className="text-primary-600 hover:text-primary-900 p-1 rounded" title="View"><EyeIcon className="w-4 h-4" /></button>
                          {p.status === 'pending_verification' && (
                            <>
                              <button onClick={() => { setSelected(p); setVerifyNote('') }} className="text-green-600 hover:text-green-900 p-1 rounded" title="Verify"><CheckIcon className="w-4 h-4" /></button>
                              <button onClick={() => { setSelected(p); setVerifyNote('') }} className="text-red-600 hover:text-red-900 p-1 rounded" title="Reject"><XMarkIcon className="w-4 h-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {/* Verify Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Payment Proof Details</h2>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm mb-6">
                  {[['Order ID', selected.orderId], ['Transaction Ref', selected.transactionRef], ['Amount', `ETB ${selected.amount?.toLocaleString()}`], ['Bank', selected.bankId || '—'], ['Transaction Date', fmt(selected.transactionDate)], ['Submitted', fmt(selected.createdAt)], ['Status', selected.status?.replace(/_/g, ' ')]].map(([k, v]) => (
                    <div key={k} className="flex justify-between"><span className="text-gray-500">{k}:</span><span className="font-medium capitalize">{v}</span></div>
                  ))}
                </div>
                {selected.filename && (
                  <div className="mb-6">
                    <a href={paymentsApi.getProofFile(selected._id || selected.id)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
                      <EyeIcon className="w-4 h-4" />View Payment Proof File
                    </a>
                  </div>
                )}
                {selected.status === 'pending_verification' && (
                  <div className="space-y-3">
                    <textarea value={verifyNote} onChange={e => setVerifyNote(e.target.value)} placeholder="Add a note (optional)..." rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500" />
                    <div className="flex gap-3">
                      <button onClick={() => handleVerify('verified')} disabled={verifying} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        <CheckIcon className="w-4 h-4" />{verifying ? 'Processing...' : 'Verify Payment'}
                      </button>
                      <button onClick={() => handleVerify('rejected')} disabled={verifying} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        <XMarkIcon className="w-4 h-4" />Reject
                      </button>
                    </div>
                  </div>
                )}
                {selected.verificationNotes && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm">
                    <span className="font-medium text-gray-900">Admin Note: </span>{selected.verificationNotes}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
