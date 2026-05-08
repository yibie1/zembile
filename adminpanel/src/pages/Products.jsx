import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { productsApi, categoriesApi } from '../services/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const EMPTY_FORM = { name: '', description: '', shortDescription: '', category: '', subcategory: '', brand: '', sku: '', price: '', originalPrice: '', discount: 0, stock: 0, images: [''], isFeatured: false, isNew: true, tags: '', status: 'active', origin: 'Ethiopia' }

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => { categoriesApi.getAll().then(r => setCategories(r.data || [])).catch(() => {}) }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12 }
      if (search) params.search = search
      if (catFilter) params.category = catFilter
      if (statusFilter) params.status = statusFilter
      const res = await productsApi.getAll(params)
      setProducts(res.data || [])
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 })
    } catch (err) { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }, [page, search, catFilter, statusFilter])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { setPage(1) }, [search, catFilter, statusFilter])

  const openCreate = () => { setForm(EMPTY_FORM); setEditProduct(null); setShowModal(true) }
  const openEdit = (p) => {
    setForm({ ...EMPTY_FORM, ...p, tags: p.tags?.join(', ') || '', images: p.images?.length ? p.images : [''] })
    setEditProduct(p)
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category) { toast.error('Name, price, and category are required'); return }
    setSaving(true)
    try {
      const payload = { ...form, price: +form.price, originalPrice: form.originalPrice ? +form.originalPrice : undefined, discount: +form.discount, stock: +form.stock, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [], images: form.images.filter(Boolean) }
      if (editProduct) {
        await productsApi.update(editProduct._id, payload)
        toast.success('Product updated!')
      } else {
        await productsApi.create(payload)
        toast.success('Product created!')
      }
      setShowModal(false)
      fetchProducts()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save product') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await productsApi.delete(id)
      toast.success('Product deleted')
      setDeleteConfirm(null)
      fetchProducts()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete product') }
  }

  const statusColor = (s) => ({ active: 'bg-green-100 text-green-800', inactive: 'bg-gray-100 text-gray-800', draft: 'bg-yellow-100 text-yellow-800', out_of_stock: 'bg-red-100 text-red-800' }[s] || 'bg-gray-100 text-gray-800')

  const F = ({ label, children, required }) => (
    <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>{children}</div>
  )
  const inp = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Products</h1><p className="text-gray-600">Manage your product catalog ({pagination.total} total)</p></div>
        <button onClick={openCreate} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium">
          <PlusIcon className="w-5 h-5" /><span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-primary-500" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500">
            <option value="">All Status</option>
            {['active', 'inactive', 'draft', 'out_of_stock'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-sm font-medium text-gray-900">No products found</h3>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or add a new product.</p>
          <button onClick={openCreate} className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">Add Product</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {products.map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {p.images?.[0] || p.thumbnail ? (
                      <img src={p.images?.[0] || p.thumbnail} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><PhotoIcon className="w-12 h-12 text-gray-400" /></div>
                    )}
                    <div className="absolute top-2 right-2"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor(p.status)}`}>{p.status?.replace('_', ' ')}</span></div>
                    {p.isFeatured && <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">Featured</div>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{p.name}</h3>
                    <p className="text-xs text-gray-500 mb-2 capitalize">{p.category}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">ETB {p.price?.toLocaleString()}</span>
                      <span className={`text-sm font-medium ${p.stock === 0 ? 'text-red-600' : p.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {p.stock === 0 ? 'Out of stock' : p.stock < 10 ? `Low: ${p.stock}` : `${p.stock} in stock`}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        <PencilIcon className="w-4 h-4" /><span>Edit</span>
                      </button>
                      <button onClick={() => setDeleteConfirm(p)} className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg transition-colors">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <span className="text-sm text-gray-600">Page {page} of {pagination.pages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <F label="Product Name" required><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp} required /></F>
                    <F label="Category" required>
                      <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inp} required>
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                      </select>
                    </F>
                    <F label="Price (ETB)" required><input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className={inp} min={0} required /></F>
                    <F label="Original Price (ETB)"><input type="number" value={form.originalPrice} onChange={e => setForm(p => ({ ...p, originalPrice: e.target.value }))} className={inp} min={0} /></F>
                    <F label="Discount (%)"><input type="number" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} className={inp} min={0} max={100} /></F>
                    <F label="Stock"><input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} className={inp} min={0} /></F>
                    <F label="SKU"><input value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))} className={inp} /></F>
                    <F label="Brand"><input value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className={inp} /></F>
                    <F label="Status">
                      <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={inp}>
                        {['active', 'inactive', 'draft'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </F>
                    <F label="Origin"><input value={form.origin} onChange={e => setForm(p => ({ ...p, origin: e.target.value }))} className={inp} /></F>
                  </div>
                  <F label="Short Description"><input value={form.shortDescription} onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))} className={inp} placeholder="Brief product summary" /></F>
                  <F label="Description" required><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={inp} rows={4} required /></F>
                  <F label="Tags (comma separated)"><input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className={inp} placeholder="coffee, organic, premium" /></F>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (URLs)</label>
                    {form.images.map((img, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input value={img} onChange={e => { const imgs = [...form.images]; imgs[i] = e.target.value; setForm(p => ({ ...p, images: imgs })) }} className={inp} placeholder="https://..." />
                        {form.images.length > 1 && <button type="button" onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))} className="text-red-500 hover:text-red-700 px-2"><XMarkIcon className="w-4 h-4" /></button>}
                      </div>
                    ))}
                    <button type="button" onClick={() => setForm(p => ({ ...p, images: [...p.images, ''] }))} className="text-primary-600 hover:text-primary-700 text-sm font-medium">+ Add Image URL</button>
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} className="rounded text-primary-500" />
                      <span className="text-sm text-gray-700">Featured Product</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isNew} onChange={e => setForm(p => ({ ...p, isNew: e.target.checked }))} className="rounded text-primary-500" />
                      <span className="text-sm text-gray-700">New Arrival</span>
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button type="submit" disabled={saving} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                      {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirm._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors">Delete</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium py-2">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
