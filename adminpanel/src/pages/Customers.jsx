import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Mock data
  const mockCustomers = [
    {
      id: 1,
      name: 'Almaz Tadesse',
      email: 'almaz@example.com',
      phone: '+251911234567',
      address: 'Addis Ababa, Ethiopia',
      joinDate: '2023-12-15T10:30:00Z',
      totalOrders: 5,
      totalSpent: 12500,
      lastOrder: '2024-01-02T10:30:00Z',
      status: 'active',
      avatar: null,
    },
    {
      id: 2,
      name: 'Dawit Bekele',
      email: 'dawit@example.com',
      phone: '+251922345678',
      address: 'Bahir Dar, Ethiopia',
      joinDate: '2023-11-20T14:15:00Z',
      totalOrders: 3,
      totalSpent: 4200,
      lastOrder: '2024-01-02T08:15:00Z',
      status: 'active',
      avatar: null,
    },
    {
      id: 3,
      name: 'Hanan Mohammed',
      email: 'hanan@example.com',
      phone: '+251933456789',
      address: 'Dire Dawa, Ethiopia',
      joinDate: '2023-10-05T09:45:00Z',
      totalOrders: 8,
      totalSpent: 18900,
      lastOrder: '2024-01-01T16:45:00Z',
      status: 'active',
      avatar: null,
    },
    {
      id: 4,
      name: 'Yonas Girma',
      email: 'yonas@example.com',
      phone: '+251944567890',
      address: 'Mekelle, Ethiopia',
      joinDate: '2023-09-12T11:20:00Z',
      totalOrders: 2,
      totalSpent: 1800,
      lastOrder: '2023-12-20T12:20:00Z',
      status: 'inactive',
      avatar: null,
    },
    {
      id: 5,
      name: 'Meron Haile',
      email: 'meron@example.com',
      phone: '+251955678901',
      address: 'Hawassa, Ethiopia',
      joinDate: '2023-08-30T16:10:00Z',
      totalOrders: 12,
      totalSpent: 28750,
      lastOrder: '2024-01-01T14:30:00Z',
      status: 'active',
      avatar: null,
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomers(mockCustomers)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchQuery)
    )
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getCustomerTier = (totalSpent) => {
    if (totalSpent >= 20000) return { tier: 'VIP', color: 'text-purple-600 bg-purple-100' }
    if (totalSpent >= 10000) return { tier: 'Gold', color: 'text-yellow-600 bg-yellow-100' }
    if (totalSpent >= 5000) return { tier: 'Silver', color: 'text-gray-600 bg-gray-100' }
    return { tier: 'Bronze', color: 'text-orange-600 bg-orange-100' }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Total: {filteredCustomers.length} customers
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Customers',
            value: customers.length,
            icon: UserIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
          },
          {
            title: 'Active Customers',
            value: customers.filter(c => c.status === 'active').length,
            icon: UserIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
          },
          {
            title: 'Total Revenue',
            value: `ETB ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}`,
            icon: ShoppingBagIcon,
            color: 'text-primary-600',
            bgColor: 'bg-primary-50',
          },
          {
            title: 'Avg. Order Value',
            value: `ETB ${Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)).toLocaleString()}`,
            icon: ShoppingBagIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCustomers.map((customer, index) => {
            const tier = getCustomerTier(customer.totalSpent)
            
            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedCustomer(customer)}
              >
                {/* Customer Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-lg">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${tier.color}`}>
                        {tier.tier}
                      </span>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Joined {formatDate(customer.joinDate)}</span>
                  </div>
                </div>

                {/* Customer Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Orders:</span>
                      <p className="font-semibold text-gray-900">{customer.totalOrders}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Spent:</span>
                      <p className="font-semibold text-gray-900">ETB {customer.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500 text-sm">Last Order:</span>
                    <p className="font-semibold text-gray-900 text-sm">{formatDate(customer.lastOrder)}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? 'Try adjusting your search criteria.'
              : 'Customers will appear here when they create accounts.'}
          </p>
        </div>
      )}

      {/* Customer Details Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCustomer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Profile */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-2xl">
                        {selectedCustomer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCustomer.status)}`}>
                          {selectedCustomer.status}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCustomerTier(selectedCustomer.totalSpent).color}`}>
                          {getCustomerTier(selectedCustomer.totalSpent).tier} Customer
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPinIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{selectedCustomer.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Statistics */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Order Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</div>
                        <div className="text-sm text-blue-600">Total Orders</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">
                          ETB {selectedCustomer.totalSpent.toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600">Total Spent</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          ETB {Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toLocaleString()}
                        </div>
                        <div className="text-sm text-purple-600">Avg. Order Value</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-orange-600">
                          {formatDate(selectedCustomer.lastOrder)}
                        </div>
                        <div className="text-sm text-orange-600">Last Order</div>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Customer ID:</span>
                        <span className="font-medium">#{selectedCustomer.id.toString().padStart(6, '0')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Join Date:</span>
                        <span className="font-medium">{formatDate(selectedCustomer.joinDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Customer Tier:</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCustomerTier(selectedCustomer.totalSpent).color}`}>
                          {getCustomerTier(selectedCustomer.totalSpent).tier}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 pt-4">
                    <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      View Orders
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                      Send Email
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}