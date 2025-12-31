import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function Cart() {
  const { items, updateQty, removeItem, clear, totalCount, totalPrice } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()
  const [isClearing, setIsClearing] = useState(false)
  const navigate = useNavigate()

  // Calculate totals
  const subtotal = totalPrice
  const shippingCost = subtotal >= 500 ? 0 : 50 // Free shipping over 500 ETB
  const total = subtotal + shippingCost

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return
    updateQty(itemId, newQty)
    toast.success('Quantity updated', { duration: 1500 })
  }

  const handleRemoveItem = (item) => {
    removeItem(item.id)
    toast.success(`Removed ${item.name} from cart`, {
      icon: '🗑️',
      duration: 2000,
    })
  }

  const handleMoveToWishlist = (item) => {
    if (!isInWishlist(item.id)) {
      addToWishlist(item)
    }
    removeItem(item.id)
    toast.success(`Moved ${item.name} to wishlist`, {
      icon: '❤️',
      duration: 2000,
    })
  }

  const handleClearCart = () => {
    if (items.length === 0) return

    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Clear entire cart?</span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsClearing(true)
              clear()
              toast.dismiss(t.id)
              toast.success('Cart cleared')
              setIsClearing(false)
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

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    navigate('/checkout')
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
              <span className="text-gray-900 font-medium">Shopping Cart</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet. 
              Start shopping to fill it up!
            </p>
            <div className="space-y-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-zembile-yellow text-zembile-gray px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                Start Shopping
              </Link>
              <div>
                <Link
                  to="/wishlist"
                  className="text-zembile-gray hover:text-gray-600 font-medium text-sm"
                >
                  Or check your wishlist →
                </Link>
              </div>
            </div>
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
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            disabled={isClearing}
            className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
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

                        {/* Selected Options */}
                        {item.selectedSize && (
                          <div className="text-sm text-gray-600 mt-1">
                            Size: {item.selectedSize}
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-lg font-bold text-gray-900">
                            {item.price.toLocaleString()} ETB
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {item.originalPrice.toLocaleString()} ETB
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center space-x-2 mt-2">
                          {item.inStock ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-600 font-medium">In Stock</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="text-right ml-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-end mb-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                            className="w-8 h-8 border border-gray-300 rounded-l-lg flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-8 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-zembile-yellow"
                            min="1"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                            className="w-8 h-8 border border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-lg font-bold text-gray-900 mb-3">
                          {(item.price * item.qty).toLocaleString()} ETB
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            className="w-full text-sm text-zembile-gray hover:text-gray-600 font-medium"
                          >
                            Move to Wishlist
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item)}
                            className="w-full text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                {/* Items Count */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({totalCount})</span>
                  <span className="font-medium">{subtotal.toLocaleString()} ETB</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `${shippingCost} ETB`
                    )}
                  </span>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 500 && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Add {(500 - subtotal).toLocaleString()} ETB more for free shipping
                  </div>
                )}

                <hr className="border-gray-200" />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{total.toLocaleString()} ETB</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-zembile-yellow text-zembile-gray py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors mt-6"
              >
                Proceed to Checkout
              </button>

              {/* Security Notice */}
              <div className="mt-4 text-xs text-gray-500 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure Checkout
                </div>
                <p>Your payment information is protected</p>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6 text-center">
                <Link
                  to="/products"
                  className="text-zembile-gray hover:text-gray-600 font-medium text-sm"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Recommended products will be shown here</p>
            <Link to="/products" className="text-zembile-gray hover:text-gray-600 font-medium">
              Browse all products →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
