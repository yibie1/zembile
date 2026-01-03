import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  // Mock data
  const mockCategories = [
    {
      id: 1,
      name: 'Traditional Clothing',
      description: 'Authentic Ethiopian traditional dresses and clothing',
      productCount: 45,
      status: 'active',
      image: '/api/placeholder/200/150',
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      name: 'Jewelry',
      description: 'Handcrafted Ethiopian jewelry and accessories',
      productCount: 28,
      status: 'active',
      image: '/api/placeholder/200/150',
      createdAt: '2024-01-01',
    },
    {
      id: 3,
      name: 'Home & Kitchen',
      description: 'Traditional Ethiopian home and kitchen items',
      productCount: 32,
      status: 'active',
      image: '/api/placeholder/200/150',
      createdAt: '2024-01-01',
    },
    {
      id: 4,
      name: 'Art & Crafts',
      description: 'Handmade Ethiopian art and craft items',
      productCount: 19,
      status: 'active',
      image: '/api/placeholder/200/150',
      createdAt: '2024-01-01',
    },
    {
      id: 5,
      name: 'Spices',
      description: 'Authentic Ethiopian spices and seasonings',
      productCount: 15,
      status: 'active',
      image: '/api/placeholder/200/150',
      createdAt: '2024-01-01',
    },
  ]

  useEffect(() => {
    setTimeout(() => {
      setCategories(mockCategories)
      setIsLoading(false)
    }, 1000)
  }, [])

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
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Organize your products into categories</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Category Image */}
              <div className="aspect-video bg-gray-100 relative">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.status)}`}>
                    {category.status}
                  </span>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                  <TagIcon className="w-5 h-5 text-gray-400" />
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {category.productCount} products
                  </span>
                  <span className="text-sm text-gray-500">
                    Created {category.createdAt}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                    <span>View Products</span>
                  </button>
                  <button className="bg-primary-100 hover:bg-primary-200 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first product category.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}