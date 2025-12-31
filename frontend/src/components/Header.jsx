import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { categories, searchProducts } from '../data/products'

export default function Header() {
  const { totalCount } = useCart()
  const { totalCount: wishlistCount } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false)
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const searchRef = useRef(null)
  const wishlistRef = useRef(null)
  const accountRef = useRef(null)
  const navigate = useNavigate()

  // Handle search
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const results = searchProducts(searchQuery).slice(0, 5)
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchQuery])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
      if (wishlistRef.current && !wishlistRef.current.contains(event.target)) {
        setShowWishlistDropdown(false)
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearchResults(false)
      setSearchQuery('')
    }
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
    setShowSearchResults(false)
    setSearchQuery('')
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-zembile-gray text-white text-center py-2 text-sm">
        <span>🚚 Free shipping on orders over 500 ETB | 📞 Call: +251-11-123-4567</span>
      </div>

      <div className="container mx-auto px-4 py-4">
        {/* Main Header */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <img src="/logo.svg" alt="Zembile" className="w-12 h-12" />
              <div className="hidden sm:block">
                <span className="font-extrabold text-xl text-zembile-gray tracking-tight">Zembile</span>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Ethiopian Marketplace</div>
              </div>
            </Link>

            {/* Categories Dropdown - Desktop */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-zembile-yellow text-zembile-gray rounded-full font-medium hover:bg-yellow-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Categories
                <svg className={`w-4 h-4 transition-transform ${showCategoriesMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Categories Dropdown Menu */}
              {showCategoriesMenu && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Shop by Category</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/products?category=${category.id}`}
                          onClick={() => setShowCategoriesMenu(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{category.name}</div>
                            <div className="text-xs text-gray-500">{category.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 hidden md:flex items-center justify-center max-w-2xl mx-4" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands, categories..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-zembile-yellow focus:border-transparent bg-gray-50"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <div className="bg-zembile-yellow text-zembile-gray px-6 py-2 rounded-full font-medium hover:bg-yellow-400 transition-colors">
                    Search
                  </div>
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <div className="p-2">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <img
                          src={product.images?.[0] || product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.price.toLocaleString()} ETB</div>
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-center py-2 text-sm text-zembile-gray hover:text-gray-600 font-medium"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Account - Desktop */}
            {isAuthenticated() ? (
              <div className="hidden md:block relative" ref={accountRef}>
                <button
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-zembile-gray transition-colors"
                >
                  <div className="w-8 h-8 bg-zembile-yellow rounded-full flex items-center justify-center">
                    <span className="text-zembile-gray font-semibold text-sm">
                      {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="font-medium">Hi, {user?.firstName || 'User'}</span>
                  <svg className={`w-4 h-4 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Account Dropdown */}
                {showAccountDropdown && (
                  <AccountDropdown 
                    user={user} 
                    onClose={() => setShowAccountDropdown(false)} 
                    onLogout={logout}
                  />
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm text-gray-700 hover:text-zembile-gray transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-4 py-2 bg-zembile-yellow text-zembile-gray rounded-full text-sm font-semibold hover:bg-yellow-400 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Wishlist */}
            <div className="relative" ref={wishlistRef}>
              <button
                onClick={() => setShowWishlistDropdown(!showWishlistDropdown)}
                className="relative inline-flex items-center px-4 py-2 text-sm text-gray-700 hover:text-zembile-gray transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden sm:inline font-medium">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </button>

              {/* Wishlist Dropdown */}
              {showWishlistDropdown && (
                <WishlistDropdown onClose={() => setShowWishlistDropdown(false)} />
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative inline-flex items-center px-4 py-2 rounded-full bg-zembile-yellow text-zembile-gray font-semibold hover:bg-yellow-400 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="20" r="1" fill="currentColor"/>
                <circle cx="18" cy="20" r="1" fill="currentColor"/>
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {totalCount > 99 ? '99+' : totalCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-zembile-yellow bg-gray-50"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 bg-gray-50 rounded-xl p-4">
            <nav className="space-y-3">
              {/* Auth Section for Mobile */}
              {isAuthenticated() ? (
                <>
                  <div className="flex items-center gap-3 py-2 border-b border-gray-200 mb-3">
                    <div className="w-10 h-10 bg-zembile-yellow rounded-full flex items-center justify-center">
                      <span className="text-zembile-gray font-semibold">
                        {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setShowMobileMenu(false)}
                    className="block py-2 text-gray-700 hover:text-zembile-gray font-medium"
                  >
                    My Account
                  </Link>
                  <Link
                    to="/account/orders"
                    onClick={() => setShowMobileMenu(false)}
                    className="block py-2 text-gray-700 hover:text-zembile-gray"
                  >
                    My Orders
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="block py-2 text-gray-700 hover:text-zembile-gray font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/signup"
                    onClick={() => setShowMobileMenu(false)}
                    className="block py-2 bg-zembile-yellow text-zembile-gray rounded-lg text-center font-semibold"
                  >
                    Sign Up
                  </Link>
                  <hr className="border-gray-200" />
                </>
              )}
              
              <Link
                to="/products"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 text-gray-700 hover:text-zembile-gray font-medium"
              >
                All Products
              </Link>
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-2 text-gray-700 hover:text-zembile-gray"
                >
                  {category.icon} {category.name}
                </Link>
              ))}
              <hr className="border-gray-200" />
              <Link
                to="/wishlist"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center justify-between py-2 text-gray-700 hover:text-zembile-gray font-medium"
              >
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/about"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 text-gray-700 hover:text-zembile-gray"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 text-gray-700 hover:text-zembile-gray"
              >
                Contact
              </Link>
              
              {/* Logout for mobile */}
              {isAuthenticated() && (
                <>
                  <hr className="border-gray-200" />
                  <button
                    onClick={() => {
                      logout()
                      setShowMobileMenu(false)
                    }}
                    className="block w-full text-left py-2 text-red-600 hover:text-red-700 font-medium"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showCategoriesMenu || showMobileMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowCategoriesMenu(false)
            setShowMobileMenu(false)
          }}
        />
      )}
    </header>
  )
}

// Wishlist Dropdown Component
function WishlistDropdown({ onClose }) {
  const { items, removeItem } = useWishlist()
  const navigate = useNavigate()

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
    onClose()
  }

  const handleViewAll = () => {
    navigate('/wishlist')
    onClose()
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Wishlist</h3>
          <span className="text-sm text-gray-500">({items.length} items)</span>
        </div>

        {items.length > 0 ? (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg cursor-pointer"
                    onClick={() => handleProductClick(item.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="font-medium text-sm text-gray-900 truncate cursor-pointer hover:text-zembile-gray"
                      onClick={() => handleProductClick(item.id)}
                    >
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600">{item.price.toLocaleString()} ETB</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            {items.length > 3 && (
              <div className="text-center mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">+{items.length - 3} more items</p>
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={handleViewAll}
                className="w-full bg-zembile-yellow text-zembile-gray py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
              >
                View All Wishlist Items
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-500 text-sm mb-3">Your wishlist is empty</p>
            <button
              onClick={() => {
                navigate('/products')
                onClose()
              }}
              className="text-zembile-gray hover:text-gray-600 font-medium text-sm"
            >
              Start Shopping →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Account Dropdown Component
function AccountDropdown({ user, onClose, onLogout }) {
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  }

  const handleLogout = () => {
    onLogout()
    onClose()
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-12 h-12 bg-zembile-yellow rounded-full flex items-center justify-center">
            <span className="text-zembile-gray font-semibold text-lg">
              {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-sm text-gray-500 truncate">{user?.email}</div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="py-3 space-y-1">
          <button
            onClick={() => handleNavigation('/account')}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>My Profile</span>
          </button>

          <button
            onClick={() => handleNavigation('/account/orders')}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>My Orders</span>
          </button>

          <button
            onClick={() => handleNavigation('/wishlist')}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Wishlist</span>
          </button>

          <button
            onClick={() => handleNavigation('/account/settings')}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="pt-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
