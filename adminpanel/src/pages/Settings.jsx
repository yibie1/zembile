import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CogIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Settings() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your admin panel preferences</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
      >
        <CogIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Settings</h3>
        <p className="text-gray-600 mb-6">
          Comprehensive settings and configuration options coming soon.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-800">
              This feature is under development and will be available in the next update.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}