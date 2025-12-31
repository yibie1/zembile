import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <img
            src="/logo.svg"
            alt="Zembile"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-zembile-yellow text-zembile-gray px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="text-zembile-gray hover:text-gray-600 font-medium"
            >
              Browse Products
            </Link>
            <Link
              to="/contact"
              className="text-zembile-gray hover:text-gray-600 font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/products?category=coffee"
              className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-zembile-yellow hover:shadow-md transition-all"
            >
              <span className="text-2xl">☕</span>
              <span className="font-medium text-gray-700">Coffee</span>
            </Link>
            <Link
              to="/products?category=crafts"
              className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-zembile-yellow hover:shadow-md transition-all"
            >
              <span className="text-2xl">🎨</span>
              <span className="font-medium text-gray-700">Crafts</span>
            </Link>
            <Link
              to="/products?category=spices"
              className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-zembile-yellow hover:shadow-md transition-all"
            >
              <span className="text-2xl">🌶️</span>
              <span className="font-medium text-gray-700">Spices</span>
            </Link>
            <Link
              to="/products?category=textiles"
              className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-zembile-yellow hover:shadow-md transition-all"
            >
              <span className="text-2xl">🧵</span>
              <span className="font-medium text-gray-700">Textiles</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}