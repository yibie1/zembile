import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { CurrencyDollarIcon, ShoppingCartIcon, UsersIcon, CubeIcon, ArrowUpIcon, ArrowDownIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { analyticsApi, ordersApi } from '../services/api'
import { Link } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

export default function Dashboard() {
  const [period, setPeriod] = useState('30d')
  const [overview, setOverview] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [ordersData, setOrdersData] = useState({ byStatus: [], byDay: [] })
  const [topProducts, setTopProducts] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [ov, rev, ord, top, recent] = await Promise.all([
          analyticsApi.getOverview(period),
          analyticsApi.getRevenue(period),
          analyticsApi.getOrders(period),
          analyticsApi.getTopProducts(5),
          ordersApi.getAll({ limit: 5, page: 1 })
        ])
        setOverview(ov.data)
        setRevenueData(rev.data || [])
        setOrdersData(ord.data || { byStatus: [], byDay: [] })
        setTopProducts(top.data || [])
        setRecentOrders(recent.data || [])
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [period])

  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' } } } }

  const revChart = {
    labels: revenueData.map(d => d._id),
    datasets: [{ label: 'Revenue (ETB)', data: revenueData.map(d => d.revenue), borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.4, fill: true }]
  }

  const ordChart = {
    labels: ordersData.byDay?.map(d => d._id) || [],
    datasets: [{ label: 'Orders', data: ordersData.byDay?.map(d => d.count) || [], backgroundColor: '#f59e0b', borderColor: '#d97706', borderWidth: 1 }]
  }

  const statusColors = { pending_payment: '#f59e0b', paid: '#10b981', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#059669', cancelled: '#ef4444' }
  const statusChart = {
    labels: ordersData.byStatus?.map(s => s._id) || [],
    datasets: [{ data: ordersData.byStatus?.map(s => s.count) || [], backgroundColor: ordersData.byStatus?.map(s => statusColors[s._id] || '#9ca3af') || [], borderWidth: 0 }]
  }

  const statCards = overview ? [
    { title: 'Revenue', value: `ETB ${(overview.revenue?.value || 0).toLocaleString()}`, change: overview.revenue?.change, trend: overview.revenue?.trend, icon: CurrencyDollarIcon, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Orders', value: (overview.orders?.value || 0).toLocaleString(), change: overview.orders?.change, trend: overview.orders?.trend, icon: ShoppingCartIcon, color: 'text-blue-600', bg: 'bg-blue-50', badge: overview.orders?.pending > 0 ? `${overview.orders.pending} pending` : null },
    { title: 'New Customers', value: (overview.customers?.value || 0).toLocaleString(), change: overview.customers?.change, trend: overview.customers?.trend, icon: UsersIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Products', value: (overview.products?.total || 0).toLocaleString(), change: null, trend: null, icon: CubeIcon, color: 'text-orange-600', bg: 'bg-orange-50', badge: overview.products?.lowStock > 0 ? `${overview.products.lowStock} low stock` : null }
  ] : []

  const getStatusColor = (s) => ({ pending_payment: 'bg-yellow-100 text-yellow-800', paid: 'bg-green-100 text-green-800', processing: 'bg-blue-100 text-blue-800', shipped: 'bg-purple-100 text-purple-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' }[s] || 'bg-gray-100 text-gray-800')

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{[...Array(2)].map((_, i) => <div key={i} className="h-72 bg-gray-200 rounded-xl" />)}</div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Alerts */}
      {overview?.orders?.pendingPayments > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <span className="text-yellow-800 text-sm">{overview.orders.pendingPayments} payment proof(s) awaiting verification.</span>
          <Link to="/payments" className="ml-auto text-yellow-700 font-medium text-sm hover:text-yellow-900">Review →</Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{s.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{s.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${s.bg}`}><s.icon className={`w-6 h-6 ${s.color}`} /></div>
            </div>
            <div className="flex items-center mt-4 gap-2">
              {s.change !== null && s.change !== undefined ? (
                <>
                  {s.trend === 'up' ? <ArrowUpIcon className="w-4 h-4 text-green-500" /> : <ArrowDownIcon className="w-4 h-4 text-red-500" />}
                  <span className={`text-sm font-medium ${s.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{Math.abs(s.change)}%</span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </>
              ) : s.badge ? (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{s.badge}</span>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
          <div className="h-64">{revenueData.length > 0 ? <Line data={revChart} options={chartOpts} /> : <div className="h-full flex items-center justify-center text-gray-400">No data for this period</div>}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Orders</h3>
          <div className="h-64">{ordersData.byDay?.length > 0 ? <Bar data={ordChart} options={chartOpts} /> : <div className="h-full flex items-center justify-center text-gray-400">No data for this period</div>}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Orders by Status</h3>
          <div className="h-64">{ordersData.byStatus?.length > 0 ? <Doughnut data={statusChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } }} /> : <div className="h-full flex items-center justify-center text-gray-400">No orders yet</div>}</div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link to="/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400"><ClockIcon className="w-12 h-12 mx-auto mb-2" /><p>No orders yet</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>{['Order', 'Customer', 'Amount', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map(o => (
                    <tr key={o.orderId || o._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">#{(o.orderId || o._id || '').slice(-8)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{o.customerInfo?.firstName} {o.customerInfo?.lastName}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">ETB {(o.pricing?.total || o.total || 0).toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(o.status)}`}>{o.status?.replace(/_/g, ' ')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View all →</Link>
          </div>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p._id} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">#{i + 1}</div>
                <img src={p.images?.[0] || p.thumbnail || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=60&q=80'} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{p.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{p.category}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-gray-900">ETB {p.price?.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{p.soldCount || 0} sold</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
