import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { categoriesApi } from '../services/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const EMPTY = { name: '', description: '', icon: '📦', sortOrder: 0 }

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await categoriesApi.getAll()
      setCategories(res.data || [])
    } catch (err) { toast.error('Failed to load categories') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCategories() }, [])

  const openCreate = () => { setForm(EMPTY); setEditCat(null); setShowModal(true) }
  const openEdit = (c) => { setForm({ name: c.name, description: c.description || '', icon: c.icon || '📦', sortOrder: c.sortOrder || 0 }); setEditCat(c); setShowModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name) { toast.error('Category name is required'); return }
    setSaving(true)
    try {
      if (editCat) {
        await categoriesApi.update(editCat._id, form)
        toast.success('Category updated!')
      } else {
        await categoriesApi.create(form)
        toast.success('Category created!')
      }
      setShowModal(false)
      fetchCategories()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save category') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await categoriesApi.delete(id)
      toast.success('Category deleted')
      setDeleteConfirm(null)
      fetchCategories()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete category') }
  }

  const inp = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Categories</h1><p className="text-gray-600">Manage product categories ({categories.length} total)</p></div>
        <button onClick={openCreate} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <PlusIcon className="w-5 h-5" />Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <div className="text-5xl mb-3">📂</div>
          <p className="text-sm text-gray-500">No categories yet. Add your first category.</p>
          <button onClick={openCreate} className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">Add Category</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {categories.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl">{c.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{c.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(c)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteConfirm(c)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                </div>
                {c.description && <p className="text-sm text-gray-600 mb-3">{c.description}</p>}
                {c.subcategories?.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">Subcategories ({c.subcategories.length})</div>
                    <div className="flex flex-wrap gap-1">
                      {c.subcategories.slice(0, 4).map(s => <span key={s.slug} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{s.name}</span>)}
                      {c.subcategories.length > 4 && <span className="text-xs text-gray-500">+{c.subcategories.length - 4} more</span>}
                    </div>
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  {c.productCount || 0} products • Sort order: {c.sortOrder || 0}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{editCat ? 'Edit Category' : 'Add Category'}</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                    <input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className={inp} placeholder="📦" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={inp} rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: +e.target.value }))} className={inp} min={0} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50">
                      {saving ? 'Saving...' : editCat ? 'Update' : 'Create'}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">Cancel</button>
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Category</h3>
              <p className="text-gray-600 mb-6">Delete <strong>{deleteConfirm.name}</strong>? This will fail if products exist in this category.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirm._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm">Delete</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium py-2 text-sm">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
