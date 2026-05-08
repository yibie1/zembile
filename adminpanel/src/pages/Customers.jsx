import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, UserIcon, EnvelopeIcon, PhoneIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { customersApi } from '../services/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 20, role: 'customer' }
      if (search) params.search = search
      const res = await customersApi.getAll(params)
      setCustomers(res.data || [])
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 })
    } catch (err) { toast.error('Failed to load customers') }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])
  useEffect(() => { setPage(1) }, [search])

  const tier = (spent) => {
    if (spent >= 20000) return { label: 'VIP', cls: 'text-purple-600 bg-purple-100' }
    if (spent >= 10000) return { label: 'Gold', cls: 'text-yellow-600 bg-yellow-100' }
    if (spent >= 5000) return { label: 'Silver', cls: 'text-gray-600 bg-gray-100' }
    return { label: 'Bronze', cls: 'text-orange-600 bg-orange-100' }
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

  if (loading && customers.length === 0) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Customers</h1><p className="text-gray-600">Manage your customer base ({pagination.total} total)</p></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search by name, email or phone..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-primary-500" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-500">{search ? 'No customers match your search.' : 'No customers yet.'}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {customers.map((c, i) => {
                const t = tier(0) // We don't have totalSpent from the API yet
                const initials = `${c.firstName?.charAt(0) || ''}${c.lastName?.charAt(0) || ''}`.toUpperCase()
                return (
                  <motion.div key={c._id || c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(c)}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-lg">{initials || '?'}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{c.firstName} {c.lastName}</h3>
                          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${c.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{c.isActive !== false ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 flex-shrink-0" /><span className="truncate">{c.email}</span></div>
                      <div className="flex items-center gap-2"><PhoneIcon className="w-4 h-4 flex-shrink-0" /><span>{c.phone}</span></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>Joined</span><span className="font-medium text-gray-900">{fmt(c.createdAt)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 mt-1">
                        <span>Role</span><span className="font-medium text-gray-900 capitalize">{c.role}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
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

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-2xl">{`${selected.firstName?.charAt(0) || ''}${selected.lastName?.charAt(0) || ''}`.toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selected.firstName} {selected.lastName}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selected.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{selected.isActive !== false ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                  {[['Email', selected.email], ['Phone', selected.phone], ['Role', selected.role], ['Verified', selected.isVerified ? 'Yes' : 'No'], ['Joined', fmt(selected.createdAt)], ['Last Login', fmt(selected.lastLogin)]].map(([k, v]) => (
                    <div key={k} className="flex justify-between"><span className="text-gray-500">{k}:</span><span className="font-medium capitalize">{v || '—'}</span></div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
