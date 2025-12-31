import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.inStock) {
      toast.error('This product is currently out of stock')
      return
    }
    
    addItem(product, 1)
    toast.success(`Added ${product.name} to cart!`, {
      icon: '🛒',
      duration: 2000,
    })
  }

  const handleQuickBuy = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.inStock) {
      toast.error('This product is currently out of stock')
      return
    }
    
    const loadingToast = toast.loading('Adding to cart...')
    
    setTimeout(() => {
      addItem(product, 1)
      toast.dismiss(loadingToast)
      toast.success('Redirecting to checkout...', {
        icon: '🛒',
        duration: 1500,
      })
      setTimeout(() => {
        window.location.href = `/checkout?product=${product.id}`
      }, 500)
    }, 500)
  }

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product)
  }

  const nextImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  const currentImage = product.images?.[currentImageIndex] || product.image || `https://source.unsplash.com/collection/190727/800x600?sig=${product.id}`

  // List View Layout
  if (viewMode === 'list') {
    return (
      <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        <Link to={`/product/${product.id}`} className="block">
          <div className="flex p-4 gap-4">
            {/* Image */}
            <div className="relative w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{product.discount}%
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
              >
                {isInWishlist(product.id) ? (
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>

              <img 
                src={currentImage} 
                alt={product.name}
                className={`object-cover w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
              
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {/* Brand */}
                  {product.brand && (
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                      {product.brand.replace('-', ' ')}
                    </div>
                  )}

                  {/* Product Name */}
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-zembile-gray transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.shortDescription || product.description}
                  </p>

                  {/* Features */}
                  {product.features && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.features.slice(0, 4).map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="text-right ml-4">
                  <div className="mb-3">
                    <div className="text-xl font-bold text-gray-900">
                      {product.price.toLocaleString()} ETB
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-sm text-gray-500 line-through">
                        {product.originalPrice.toLocaleString()} ETB
                      </div>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-3">
                    {product.inStock ? (
                      <span className="text-sm text-green-600 font-medium">
                        {product.stockCount && product.stockCount < 10 
                          ? `Only ${product.stockCount} left` 
                          : 'In Stock'
                        }
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className="w-full bg-zembile-gray text-white px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={handleQuickBuy}
                      disabled={!product.inStock}
                      className="w-full bg-zembile-yellow text-zembile-gray px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  // Grid View Layout (existing code with minor improvements)
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container with Hover Effects */}
        <div className="relative h-64 bg-gray-50 overflow-hidden">
          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            {isInWishlist(product.id) ? (
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute top-3 right-12 z-10 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-full">
              Out of Stock
            </div>
          )}

          {/* Image with Navigation */}
          <div className="relative w-full h-full">
            <img 
              src={currentImage} 
              alt={product.name}
              className={`object-cover w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              </div>
            )}

            {/* Image Navigation */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {product.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Quick Action Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleQuickBuy}
                  disabled={!product.inStock}
                  className="bg-zembile-yellow text-zembile-gray px-4 py-2 rounded-full font-medium shadow-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Quick Buy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          {product.brand && (
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
              {product.brand.replace('-', ' ')}
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-zembile-gray transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.rating} ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.shortDescription || product.description}
          </p>

          {/* Features/Tags */}
          {product.features && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold text-gray-900">
                {product.price.toLocaleString()} ETB
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-sm text-gray-500 line-through">
                  {product.originalPrice.toLocaleString()} ETB
                </div>
              )}
            </div>

            {/* Stock Indicator */}
            {product.inStock && product.stockCount && (
              <div className="text-xs text-gray-500">
                {product.stockCount < 10 ? `Only ${product.stockCount} left` : 'In Stock'}
              </div>
            )}
          </div>

          {/* Action Buttons - Mobile */}
          <div className="mt-4 flex space-x-2 md:hidden">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-zembile-gray text-white px-3 py-2 rounded-full font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleQuickBuy}
              disabled={!product.inStock}
              className="flex-1 bg-zembile-yellow text-zembile-gray px-3 py-2 rounded-full font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}
