import axios from 'axios'
import Cookies from 'js-cookie'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const api = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use(config => {
  const token = Cookies.get('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      Cookies.remove('admin_token'); Cookies.remove('admin_user')
      window.location.href = '/auth/login'
    }
    return Promise.reject(err)
  }
)

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: (params = {}) => api.get('/products/admin/all', { params }).then(r => r.data),
  getById: (id) => api.get(`/products/${id}`).then(r => r.data),
  create: (data) => api.post('/products', data).then(r => r.data),
  update: (id, data) => api.put(`/products/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/products/${id}`).then(r => r.data),
  updateStock: (id, data) => api.patch(`/products/${id}/stock`, data).then(r => r.data),
  getReviews: (params = {}) => api.get('/products/admin/reviews', { params }).then(r => r.data),
  updateReview: (id, data) => api.put(`/products/admin/reviews/${id}`, data).then(r => r.data)
}

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => api.get('/categories').then(r => r.data),
  create: (data) => api.post('/categories', data).then(r => r.data),
  update: (id, data) => api.put(`/categories/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/categories/${id}`).then(r => r.data)
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export const ordersApi = {
  getAll: (params = {}) => api.get('/admin/orders', { params }).then(r => r.data),
  updateStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data).then(r => r.data)
}

// ─── Customers ────────────────────────────────────────────────────────────────
export const customersApi = {
  getAll: (params = {}) => api.get('/admin/users', { params }).then(r => r.data)
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentsApi = {
  getProofs: (params = {}) => api.get('/admin/payment-proofs', { params }).then(r => r.data),
  verify: (id, data) => api.post(`/admin/payment-proofs/${id}/verify`, data).then(r => r.data),
  getProofFile: (id) => `${BASE}/admin/payment-proofs/${id}/file`
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsApi = {
  getOverview: (period = '30d') => api.get('/analytics/overview', { params: { period } }).then(r => r.data),
  getRevenue: (period = '30d') => api.get('/analytics/revenue', { params: { period } }).then(r => r.data),
  getOrders: (period = '30d') => api.get('/analytics/orders', { params: { period } }).then(r => r.data),
  getTopProducts: (limit = 10) => api.get('/analytics/top-products', { params: { limit } }).then(r => r.data),
  getCategories: () => api.get('/analytics/categories').then(r => r.data),
  getCustomers: () => api.get('/analytics/customers').then(r => r.data)
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get('/admin/dashboard').then(r => r.data)
}

// ─── Admin (export data) ──────────────────────────────────────────────────────
export const adminApi = {
  exportData: (type = 'all') => api.get(`/admin/export?type=${type}`).then(r => r.data)
}

export default api
