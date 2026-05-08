import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { analyticsApi } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

export default function Analytics() {
  const [period, setPeriod] = useState('30d')
  const [revenue, setRevenue] = useState([])
  const [orders, setOrders] = useState({ byStatus: [], byDay: [] })
  const [topProducts, setTopProducts] = useState([])
  const [customers, setCustomers] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [rev, ord, top, cust] = await Promise.all([
          analyticsApi.getRevenue(period),
          analyticsApi.getOrders(period),
          analyticsApi.getTopProducts(10),
          analyticsApi.getCustomers()
        ])
        setRevenue(rev.data || [])
        setOrders(ord.data || { byStatus: [], byDay: [] })
        setTopProducts(top.data || [])
        setCustomers(cust.data || null)
      } catch (err) { console.error('Analytics error:', err) }
      finally { setLoading(false) }
    }
    load()
  }, [period])

  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' } } } }

  const revChart = {
    labels: revenue.map(d => d._id),
    datasets: [{ label: 'Revenue (ETB)', data: revenue.map(d => d.revenue), borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.4, fill: true }]
  }

  const ordChart = {
    labels: orders.byDay?.map(d => d._id) || [],
    datasets: [{ label: 'Orders', data: orders.byDay?.map(d => d.count) || [], backgroundColor: '#3b82f6', borderColor: '#2563eb', borderWidth: 1 }]
  }

  const statusColors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#6b7280']
  const statusChart = {
    labels: orders.byStatus?.map(s => s._id?.replace(/_/g, ' ')) || [],
    datasets: [{ data: orders.byStatus?.map(s => s.count) || [], backgroundColor: statusColors, borderWidth: 0 }]
  }

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Analytics</h1><p className="text-gray-600">Detailed insights into your store performance</p></div>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Over Time</h3>
        <div className="h-80">{revenue.length > 0 ? <Line data={revChart} options={{ ...chartOpts, plugins: { ...chartOpts.plugins, legend: { display: true } } }} /> : <div className="h-full flex items-center justify-center text-gray-400">No revenue data for this period</div>}</div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Day */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Orders by Day</h3>
          <div className="h-64">{orders.byDay?.length > 0 ? <Bar data={ordChart} options={chartOpts} /> : <div className="h-full flex items-center justify-center text-gray-400">No order data</div>}</div>
        </motion.div>

        {/* Orders by Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Orders by Status</h3>
          <div className="h-64">{orders.byStatus?.length > 0 ? <Doughnut data={statusChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { font: { size: 11 } } } } }} /> : <div className="h-full flex items-center justify-center text-gray-400">No orders yet</div>}</div>
        </motion.div>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>{['Rank', 'Product', 'Category', 'Price', 'Sold', 'Rating'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topProducts.map((p, i) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-bold text-primary-600">#{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0] || p.thumbnail || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=40&q=80'} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{p.category}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">ETB {p.price?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{p.soldCount || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">⭐ {p.rating?.toFixed(1) || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Customer Stats */}
      {customers && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{customers.totalCustomers || 0}</div>
                <div className="text-sm text-blue-600 mt-1">Total Customers</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{customers.newThisMonth || 0}</div>
                <div className="text-sm text-green-600 mt-1">New This Month</div>
              </div>
            </div>
            {customers.topCustomers?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Top Customers by Spend</h4>
                <div className="space-y-2">
                  {customers.topCustomers.slice(0, 5).map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-primary-600 font-bold w-5">#{i + 1}</span>
                        <span className="text-gray-900 font-medium">{c.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">ETB {c.totalSpent?.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{c.totalOrders} orders</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
