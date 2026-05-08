import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, ExclamationTriangleIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { productsApi } from '../services/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all, low, out
  const [page, setPage] = useState(1)
  const [updating, setUpdating] = useState(null)
  const [stockInputs, setStockInputs] = useState({})

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 20 }
      if (search) params.search = search
      if (filter === 'low') params.status = 'active' // will filter client-side
      if (filter === 'out') params.status = 'out_of_stock'
      const res = await productsApi.getAll(params)
      let data = res.data || []
      if (filter === 'low') data = data.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 10))
      setProducts(data)
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 })
    } catch { toast.error('Failed to load inventory') }
    finally { setLoading(false) }
  }, [page, search, filter])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { setPage(1) }, [search, filter])

  const handleStockUpdate = async (productId, operation) => {
    const val = parseInt(stockInputs[productId] || 0)
    if (!val || val <= 0) { toast.error('Enter a valid quantity'); return }
    setUpdating(productId)
    try {
      await productsApi.updateStock(productId, { stock: val, operation })
      toast.success('Stock updated!')
      setStockInputs(p => ({ ...p, [productId]: '' }))
      fetchProducts()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update stock') }
    finally { setUpdating(null) }
  }

  const stockStatus = (p) => {
    if (p.stock === 0) return { label: 'Out of Stock', cls: 'bg-red-100 text-red-800', icon: '🔴' }
    if (p.stock <= (p.lowStockThreshold || 10)) return { label: 'Low Stock', cls: 'bg-yellow-100 text-yellow-800', icon: '🟡' }
    return { label: 'In Stock', cls: 'bg-green-100 text-green-800', icon: '🟢' }
  }

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 10)).length
  const outOfStockCount = products.filter(p => p.stock === 0).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Inventory</h1><p className="text-gray-600">Track and manage product stock levels</p></div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Products', value: pagination.total, cls: 'bg-blue-50 border-blue-200 text-blue-800', icon: '📦' },
          { label: 'Low Stock', value: lowStockCount, cls: 'bg-yellow-50 border-yellow-200 text-yellow-800', icon: '⚠️' },
          { label: 'Out of Stock', value: outOfStockCount, cls: 'bg-red-50 border-red-200 text-red-800', icon: '🚫' }
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-6 ${s.cls}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{s.icon}</span>
              <div><div className="text-3xl font-bold">{s.value}</div><div className="text-sm font-medium">{s.label}</div></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-primary-500" />
          </div>
          <div className="flex gap-2">
            {[['all', 'All'], ['low', 'Low Stock'], ['out', 'Out of Stock']].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === v ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>{['Product', 'SKU', 'Category', 'Current Stock', 'Status', 'Adjust Stock'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((p, i) => {
                  const s = stockStatus(p)
                  return (
                    <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0] || p.thumbnail || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=40&q=80'} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="font-medium text-gray-900 text-sm line-clamp-1">{p.name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">{p.sku || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{p.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">{p.stock}</span>
                          {p.stock <= (p.lowStockThreshold || 10) && p.stock > 0 && <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />}
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${s.cls}`}>{s.icon} {s.label}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input type="number" value={stockInputs[p._id] || ''} onChange={e => setStockInputs(prev => ({ ...prev, [p._id]: e.target.value }))} placeholder="Qty" className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary-500" min={1} />
                          <button onClick={() => handleStockUpdate(p._id, 'increment')} disabled={updating === p._id} className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors" title="Add stock">
                            <ArrowUpIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleStockUpdate(p._id, 'decrement')} disabled={updating === p._id} className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors" title="Remove stock">
                            <ArrowDownIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleStockUpdate(p._id, 'set')} disabled={updating === p._id} className="px-2 py-1 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded text-xs font-medium transition-colors" title="Set exact stock">
                            Set
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {products.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400"><p>No products found</p></div>
          )}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">Previous</button>
          <span className="text-sm text-gray-600">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  )
}
