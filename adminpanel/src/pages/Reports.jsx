import { useState } from 'react'
import { motion } from 'framer-motion'
import { DocumentArrowDownIcon, ChartBarIcon, ShoppingCartIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { adminApi } from '../services/api'
import toast from 'react-hot-toast'

export default function Reports() {
  const [exporting, setExporting] = useState(null)

  const handleExport = async (type, format) => {
    setExporting(`${type}-${format}`)
    try {
      if (format === 'json') {
        const res = await adminApi.exportData(type)
        const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `zembile-${type}-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
        toast.success(`${type} data exported!`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Export failed')
    } finally {
      setExporting(null)
    }
  }

  const reports = [
    {
      title: 'Sales Report',
      description: 'Complete sales data including orders, revenue, and payment methods',
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bg: 'bg-green-50',
      type: 'orders',
      metrics: ['Total Revenue', 'Order Count', 'Average Order Value', 'Payment Methods']
    },
    {
      title: 'Customer Report',
      description: 'Customer acquisition, retention, and spending patterns',
      icon: UsersIcon,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      type: 'all',
      metrics: ['Total Customers', 'New Customers', 'Top Spenders', 'Customer Locations']
    },
    {
      title: 'Payment Report',
      description: 'Payment proof submissions, verifications, and rejections',
      icon: ShoppingCartIcon,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      type: 'payments',
      metrics: ['Total Proofs', 'Verified', 'Rejected', 'Pending']
    },
    {
      title: 'Full Export',
      description: 'Complete data export including all orders, payments, and customers',
      icon: ChartBarIcon,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      type: 'all',
      metrics: ['All Orders', 'All Payments', 'All Customers', 'Full History']
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Exports</h1>
        <p className="text-gray-600">Generate and download business reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, i) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-xl ${report.bg} flex-shrink-0`}>
                <report.icon className={`w-6 h-6 ${report.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">Includes</div>
              <div className="flex flex-wrap gap-2">
                {report.metrics.map(m => (
                  <span key={m} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{m}</span>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleExport(report.type, 'json')}
              disabled={!!exporting}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              {exporting === `${report.type}-json` ? 'Exporting...' : 'Export JSON'}
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <h3 className="font-semibold text-blue-900 mb-2">📊 About Reports</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All exports are in JSON format with masked sensitive data (phone numbers, transaction refs)</li>
          <li>• Reports include data from the beginning of your store's operation</li>
          <li>• CSV export and scheduled reports coming in a future update</li>
          <li>• Data is exported in real-time from your MongoDB database</li>
        </ul>
      </motion.div>
    </div>
  )
}
