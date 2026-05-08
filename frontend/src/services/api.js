const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Get auth token from localStorage
const getToken = () => {
  try {
    const auth = localStorage.getItem('zembile_auth_v1')
    if (auth) return JSON.parse(auth).token
  } catch {}
  return null
}

// Core fetch wrapper
const request = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`)
  return data
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/products${qs ? '?' + qs : ''}`)
  },
  getById: (id) => request(`/products/${id}`),
  getFeatured: (limit = 8) => request(`/products/featured?limit=${limit}`),
  getNewArrivals: (limit = 8) => request(`/products/new-arrivals?limit=${limit}`),
  getBestSellers: (limit = 8) => request(`/products/best-sellers?limit=${limit}`),
  getOnSale: (limit = 8) => request(`/products/on-sale?limit=${limit}`),
  addReview: (productId, reviewData) => request(`/products/${productId}/reviews`, {
    method: 'POST', body: JSON.stringify(reviewData)
  }),
  // Admin
  adminGetAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/products/admin/all${qs ? '?' + qs : ''}`)
  },
  create: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  updateStock: (id, data) => request(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminReviews: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/products/admin/reviews${qs ? '?' + qs : ''}`)
  },
  updateReview: (reviewId, data) => request(`/products/admin/reviews/${reviewId}`, {
    method: 'PUT', body: JSON.stringify(data)
  })
}

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => request('/categories'),
  getBySlug: (slug) => request(`/categories/${slug}`),
  create: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' })
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  verify: () => request('/auth/verify'),
  getProfile: () => request('/auth/profile'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (data) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' })
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export const ordersApi = {
  create: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getById: (orderId) => request(`/orders/${orderId}`),
  getMyOrders: () => request('/orders'),
  initChapa: (data) => request('/chapa/initialize', { method: 'POST', body: JSON.stringify(data) }),
  verifyChapa: (txRef) => request(`/chapa/verify/${txRef}`)
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => request('/admin/dashboard'),
  getOrders: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/admin/orders${qs ? '?' + qs : ''}`)
  },
  updateOrderStatus: (orderId, data) => request(`/admin/orders/${orderId}/status`, {
    method: 'PUT', body: JSON.stringify(data)
  }),
  getPaymentProofs: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/admin/payment-proofs${qs ? '?' + qs : ''}`)
  },
  verifyPaymentProof: (proofId, data) => request(`/admin/payment-proofs/${proofId}/verify`, {
    method: 'POST', body: JSON.stringify(data)
  }),
  getUsers: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/admin/users${qs ? '?' + qs : ''}`)
  },
  exportData: (type = 'all') => request(`/admin/export?type=${type}`)
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsApi = {
  getOverview: (period = '30d') => request(`/analytics/overview?period=${period}`),
  getRevenue: (period = '30d') => request(`/analytics/revenue?period=${period}`),
  getOrders: (period = '30d') => request(`/analytics/orders?period=${period}`),
  getTopProducts: (limit = 10) => request(`/analytics/top-products?limit=${limit}`),
  getCategories: () => request('/analytics/categories'),
  getCustomers: () => request('/analytics/customers')
}

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadApi = {
  uploadPaymentProof: async (file, orderId) => {
    const token = getToken()
    const formData = new FormData()
    formData.append('paymentProof', file)
    formData.append('orderId', orderId)

    const headers = {}
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch(`${BASE_URL}/uploads/payment-proof`, {
      method: 'POST', headers, body: formData
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Upload failed')
    return data
  }
}

export default { productsApi, categoriesApi, authApi, ordersApi, adminApi, analyticsApi, uploadApi }
