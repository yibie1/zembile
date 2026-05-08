import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { categoriesApi, productsApi } from '../services/api'

export default function Header() {
  const { totalCount } = useCart()
  const { totalCount: wishlistCount, items: wishlistItems, removeItem: removeWishlistItem } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [showMobile, setShowMobile] = useState(false)
  const [showCats, setShowCats] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [categories, setCategories] = useState([])
  const searchRef = useRef(null)
  const wishlistRef = useRef(null)
  const accountRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    categoriesApi.getAll().then(r => setCategories(r.data || [])).catch(() => {})
  }, [])

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSearchResults([]); setShowSearch(false); return }
    const t = setTimeout(async () => {
      try {
        const res = await productsApi.getAll({ search: searchQuery, limit: 5 })
        setSearchResults(res.data || [])
        setShowSearch(true)
      } catch { setSearchResults([]) }
    }, 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false)
      if (wishlistRef.current && !wishlistRef.current.contains(e.target)) setShowWishlist(false)
      if (accountRef.current && !accountRef.current.contains(e.target)) setShowAccount(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false); setSearchQuery('')
    }
  }

  const goToProduct = (id) => { navigate(`/product/${id}`); setShowSearch(false); setSearchQuery('') }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-zembile-gray text-white text-center py-2 text-xs sm:text-sm">
        🚚 Free shipping on orders over 500 ETB &nbsp;|&nbsp; 📞 +251-11-123-4567
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo + Categories */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Zembile" className="w-10 h-10" onError={e => { e.target.style.display='none' }} />
              <div className="hidden sm:block">
                <div className="font-extrabold text-lg text-zembile-gray leading-none">Zembile</div>
                <div className="text-xs text-gray-500">Ethiopian Marketplace</div>
              </div>
            </Link>

            {/* Categories dropdown - desktop */}
            <div className="hidden lg:block relative">
              <button onClick={() => setShowCats(!showCats)} className="flex items-center gap-1.5 px-4 py-2 bg-zembile-yellow text-zembile-gray rounded-full font-medium hover:bg-yellow-400 transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                Categories
                <svg className={`w-3 h-3 transition-transform ${showCats ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showCats && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-3">
                    {categories.map(cat => (
                      <Link key={cat._id} to={`/products?category=${cat.slug}`} onClick={() => setShowCats(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-xl">{cat.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{cat.name}</div>
                          <div className="text-xs text-gray-500">{cat.description?.slice(0, 40)}</div>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link to="/products" onClick={() => setShowCats(false)} className="block text-center py-2 text-sm text-zembile-gray font-medium hover:text-gray-600">View All Products →</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 hidden md:block max-w-xl" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products, brands, categories..." className="w-full pl-11 pr-24 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-zembile-yellow bg-gray-50 text-sm" />
              <svg className="absolute left-4 top-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
              <button type="submit" className="absolute right-1.5 top-1.5 bg-zembile-yellow text-zembile-gray px-4 py-1.5 rounded-full font-medium text-sm hover:bg-yellow-400 transition-colors">Search</button>

              {showSearch && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <div className="p-2">
                    {searchResults.map(p => (
                      <button key={p._id} onClick={() => goToProduct(p._id)} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 text-left">
                        <img src={p.images?.[0] || p.thumbnail || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=60&q=80'} alt={p.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.price?.toLocaleString()} ETB</div>
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleSearch} className="w-full text-center py-2 text-sm text-zembile-gray font-medium hover:text-gray-600">View all results for "{searchQuery}"</button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Account - desktop */}
            {isAuthenticated() ? (
              <div className="hidden md:block relative" ref={accountRef}>
                <button onClick={() => setShowAccount(!showAccount)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-zembile-gray transition-colors rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-zembile-yellow rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-zembile-gray font-semibold text-sm">{user?.firstName?.charAt(0)?.toUpperCase() || 'U'}</span>
                  </div>
                  <span className="font-medium hidden lg:block">Hi, {user?.firstName || 'User'}</span>
                  <svg className={`w-3 h-3 transition-transform hidden lg:block ${showAccount ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showAccount && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    <div className="p-3 border-b border-gray-100">
                      <div className="font-semibold text-gray-900 text-sm">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                    </div>
                    <div className="py-1">
                      {[['My Account', '/account', '👤'], ['My Orders', '/orders', '📦'], ['Wishlist', '/wishlist', '❤️']].map(([label, path, icon]) => (
                        <Link key={path} to={path} onClick={() => setShowAccount(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <span>{icon}</span>{label}
                        </Link>
                      ))}
                      <hr className="my-1" />
                      <button onClick={() => { logout(); setShowAccount(false) }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <span>🚪</span>Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/auth/login" className="px-3 py-2 text-sm text-gray-700 hover:text-zembile-gray font-medium">Sign In</Link>
                <Link to="/auth/signup" className="px-4 py-2 bg-zembile-yellow text-zembile-gray rounded-full text-sm font-semibold hover:bg-yellow-400 transition-colors">Sign Up</Link>
              </div>
            )}

            {/* Wishlist */}
            <div className="relative" ref={wishlistRef}>
              <button onClick={() => setShowWishlist(!showWishlist)} className="relative p-2 text-gray-700 hover:text-zembile-gray transition-colors rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{wishlistCount > 9 ? '9+' : wishlistCount}</span>}
              </button>
              {showWishlist && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Wishlist ({wishlistItems.length})</h3>
                      <Link to="/wishlist" onClick={() => setShowWishlist(false)} className="text-xs text-zembile-gray font-medium">View All</Link>
                    </div>
                    {wishlistItems.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 text-sm">Your wishlist is empty</div>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {wishlistItems.slice(0, 4).map(item => {
                          const pid = item._id || item.id
                          return (
                            <div key={pid} className="flex items-center gap-3">
                              <img src={item.images?.[0] || item.thumbnail || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=60&q=80'} alt={item.name} className="w-12 h-12 object-cover rounded-lg cursor-pointer flex-shrink-0" onClick={() => { goToProduct(pid); setShowWishlist(false) }} />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-zembile-gray" onClick={() => { goToProduct(pid); setShowWishlist(false) }}>{item.name}</div>
                                <div className="text-xs text-gray-500">{item.price?.toLocaleString()} ETB</div>
                              </div>
                              <button onClick={() => removeWishlistItem(pid)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    <Link to="/wishlist" onClick={() => setShowWishlist(false)} className="block w-full mt-3 bg-zembile-yellow text-zembile-gray py-2 rounded-lg font-medium text-sm text-center hover:bg-yellow-400 transition-colors">View Wishlist</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center gap-1.5 px-3 py-2 rounded-full bg-zembile-yellow text-zembile-gray font-semibold hover:bg-yellow-400 transition-colors text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="20" r="1" fill="currentColor"/><circle cx="18" cy="20" r="1" fill="currentColor"/></svg>
              <span className="hidden sm:inline">Cart</span>
              {totalCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{totalCount > 9 ? '9+' : totalCount}</span>}
            </Link>

            {/* Mobile menu */}
            <button onClick={() => setShowMobile(!showMobile)} className="md:hidden p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-3">
          <form onSubmit={handleSearch} className="relative">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-zembile-yellow bg-gray-50 text-sm" />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
          </form>
        </div>

        {/* Mobile menu */}
        {showMobile && (
          <div className="md:hidden mt-3 bg-gray-50 rounded-xl p-4">
            <nav className="space-y-1">
              {isAuthenticated() ? (
                <>
                  <div className="flex items-center gap-3 py-2 border-b border-gray-200 mb-2">
                    <div className="w-10 h-10 bg-zembile-yellow rounded-full flex items-center justify-center"><span className="text-zembile-gray font-semibold">{user?.firstName?.charAt(0)?.toUpperCase()}</span></div>
                    <div><div className="font-medium text-gray-900 text-sm">{user?.firstName} {user?.lastName}</div><div className="text-xs text-gray-500">{user?.email}</div></div>
                  </div>
                  {[['My Account', '/account'], ['My Orders', '/orders'], ['Wishlist', '/wishlist']].map(([l, p]) => (
                    <Link key={p} to={p} onClick={() => setShowMobile(false)} className="block py-2.5 px-3 text-gray-700 hover:text-zembile-gray hover:bg-white rounded-lg text-sm font-medium">{l}</Link>
                  ))}
                  <hr className="border-gray-200 my-1" />
                  <button onClick={() => { logout(); setShowMobile(false) }} className="block w-full text-left py-2.5 px-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/auth/login" onClick={() => setShowMobile(false)} className="block py-2.5 px-3 text-gray-700 hover:text-zembile-gray text-sm font-medium">Sign In</Link>
                  <Link to="/auth/signup" onClick={() => setShowMobile(false)} className="block py-2.5 px-3 bg-zembile-yellow text-zembile-gray rounded-lg text-sm font-semibold text-center">Sign Up</Link>
                  <hr className="border-gray-200 my-1" />
                </>
              )}
              <Link to="/products" onClick={() => setShowMobile(false)} className="block py-2.5 px-3 text-gray-700 hover:text-zembile-gray text-sm font-medium">All Products</Link>
              {categories.slice(0, 6).map(cat => (
                <Link key={cat._id} to={`/products?category=${cat.slug}`} onClick={() => setShowMobile(false)} className="block py-2 px-3 text-gray-600 hover:text-zembile-gray text-sm">
                  {cat.icon} {cat.name}
                </Link>
              ))}
              <hr className="border-gray-200 my-1" />
              {[['About', '/about'], ['Contact', '/contact'], ['FAQ', '/faq']].map(([l, p]) => (
                <Link key={p} to={p} onClick={() => setShowMobile(false)} className="block py-2 px-3 text-gray-600 hover:text-zembile-gray text-sm">{l}</Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Overlay to close dropdowns */}
      {(showCats || showMobile) && <div className="fixed inset-0 z-40" onClick={() => { setShowCats(false); setShowMobile(false) }} />}
    </header>
  )
}
