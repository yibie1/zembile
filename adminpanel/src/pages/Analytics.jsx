import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 125430,
      totalOrders: 2847,
      totalCustomers: 1234,
      conversionRate: 3.2,
      avgOrderValue: 1850,
      returnCustomers: 68,
    },
    revenueData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [15000, 22000, 18000, 28000, 25000, 32000],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    },
    trafficData: {
      labels: ['Organic Search', 'Direct', 'Social Media', 'Email', 'Referral'],
      datasets: [
        {
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            '#f59e0b',
            '#10b981',
            '#3b82f6',
            '#8b5cf6',
            '#ef4444',
          ],
        },
      ],
    },
    topProducts: [
      { name: 'Traditional Habesha Dress', sales: 145, revenue: 362500 },
      { name: 'Ethiopian Coffee Set', sales: 98, revenue: 83300 },
      { name: 'Silver Jewelry Set', sales: 76, revenue: 91200 },
      { name: 'Handwoven Basket', sales: 54, revenue: 24300 },
      { name: 'Spice Collection', sales: 43, revenue: 12900 },
    ],
  }

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#f3f4f6',
        },
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          {
            title: 'Total Revenue',
            value: `ETB ${analyticsData.overview.totalRevenue.toLocaleString()}`,
            icon: CurrencyDollarIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            change: '+12.5%',
          },
          {
            title: 'Total Orders',
            value: analyticsData.overview.totalOrders.toLocaleString(),
            icon: ShoppingCartIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            change: '+8.2%',
          },
          {
            title: 'Customers',
            value: analyticsData.overview.totalCustomers.toLocaleString(),
            icon: UserGroupIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            change: '+15.3%',
          },
          {
            title: 'Conversion Rate',
            value: `${analyticsData.overview.conversionRate}%`,
            icon: ArrowTrendingUpIcon,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            change: '+0.8%',
          },
          {
            title: 'Avg Order Value',
            value: `ETB ${analyticsData.overview.avgOrderValue.toLocaleString()}`,
            icon: ChartBarIcon,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            change: '+5.1%',
          },
          {
            title: 'Return Customers',
            value: `${analyticsData.overview.returnCustomers}%`,
            icon: UserGroupIcon,
            color: 'text-pink-600',
            bgColor: 'bg-pink-50',
            change: '+3.2%',
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <span className="text-sm font-medium text-green-600">{metric.change}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
          <div className="h-80">
            <Line data={analyticsData.revenueData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
          <div className="h-80">
            <Doughnut 
              data={analyticsData.trafficData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }} 
            />
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Sales</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topProducts.map((product, index) => (
                <tr key={product.name} className="border-b border-gray-100">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{product.sales} units</td>
                  <td className="py-4 px-4 text-gray-600">ETB {product.revenue.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${(product.sales / analyticsData.topProducts[0].sales) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}