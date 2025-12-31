import React from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const { items, removeItem, clear } = useWishlist()
  const { addItem } = useCart()

  const handleAddToCart = (product) => {
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

  const handleRemoveFromWishlist = (productId) => {
    removeItem(productId)
  }

  const handleClearWishlist = () => {
    if (items.length === 0) return
    
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Clear entire wishlist?</span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              clear()
              toast.dismiss(t.id)
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium"
          >
            Clear
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="text-sm text-gray-600">
              <Link to="/" className="hover:text-zembile-gray">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Wishlist</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">
              Save items you love by clicking the heart icon on any product. 
              We'll keep them safe here for you!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-zembile-yellow text-zembile-gray px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-zembile-gray">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
          </div>
          
          <button
            onClick={handleClearWishlist}
            className="text-red-600 hover:text-red-700 font-medium text-sm"
          >
            Clear All
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-6">
                {/* Product Image */}
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Brand */}
                      {item.brand && (
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                          {item.brand.replace('-', ' ')}
                        </div>
                      )}

                      {/* Product Name */}
                      <Link
                        to={`/product/${item.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-zembile-gray transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      {/* Rating */}
                      {item.rating && (
                        <div className="flex items-center mt-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            {item.rating} ({item.reviewCount} reviews)
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="text-xl font-bold text-gray-900">
                          {item.price.toLocaleString()} ETB
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {item.originalPrice.toLocaleString()} ETB
                          </span>
                        )}
                        {item.discount > 0 && (
                          <span className="text-sm text-green-600 font-medium">
                            ({item.discount}% off)
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="flex items-center space-x-2 mt-2">
                        {item.inStock ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600 font-medium">
                              {item.stockCount && item.stockCount < 10 
                                ? `Only ${item.stockCount} left in stock` 
                                : 'In Stock'
                              }
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                          </>
                        )}
                      </div>

                      {/* Added Date */}
                      {item.addedAt && (
                        <div className="text-xs text-gray-500 mt-2">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                        className="bg-zembile-yellow text-zembile-gray px-4 py-2 rounded-lg font-medium text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                      
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-zembile-gray hover:text-gray-600 font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}