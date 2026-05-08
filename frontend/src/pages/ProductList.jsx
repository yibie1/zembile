import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { productsApi, categoriesApi } from '../services/api'

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedRating, setSelectedRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [onSaleOnly, setOnSaleOnly] = useState(searchParams.get('onSale') === 'true')
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular')
  const [viewMode, setViewMode] = useState('grid')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const limit = 12

  useEffect(() => {
    categoriesApi.getAll().then(r => setCategories(r.data || [])).catch(() => {})
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit, sort }
      if (query) params.search = query
      if (selectedCategory) params.category = selectedCategory
      if (priceRange[0] > 0) params.minPrice = priceRange[0]
      if (priceRange[1] < 10000) params.maxPrice = priceRange[1]
      if (selectedRating > 0) params.rating = selectedRating
      if (inStockOnly) params.inStock = 'true'
      if (onSaleOnly) params.onSale = 'true'

      const res = await productsApi.getAll(params)
      setProducts(res.data || [])
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 })
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }, [page, limit, sort, query, selectedCategory, priceRange, selectedRating, inStockOnly, onSaleOnly])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Reset page when filters change
  useEffect(() => { setPage(1) }, [query, selectedCategory, priceRange, selectedRating, inStockOnly, onSaleOnly, sort])

  const clearFilters = () => {
    setQuery(''); setSelectedCategory(''); setPriceRange([0, 10000])
    setSelectedRating(0); setInStockOnly(false); setOnSaleOnly(false); setSort('popular')
    setSearchParams({})
  }

  const hasActiveFilters = query || selectedCategory || priceRange[0] > 0 || priceRange[1] < 10000 || selectedRating > 0 || inStockOnly || onSaleOnly

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <span>Home</span><span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || 'Products' : 'All Products'}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`lg:w-72 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {hasActiveFilters && <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear All</button>}
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent text-sm" />
                  <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="cat" checked={!selectedCategory} onChange={() => setSelectedCategory('')} className="text-zembile-yellow focus:ring-zembile-yellow" />
                    <span className="text-sm text-gray-700">All Categories</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="cat" checked={selectedCategory === cat.slug} onChange={() => setSelectedCategory(cat.slug)} className="text-zembile-yellow focus:ring-zembile-yellow" />
                      <span className="text-sm text-gray-700 flex items-center gap-1"><span>{cat.icon}</span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range (ETB)</h4>
                <div className="flex items-center gap-2">
                  <input type="number" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-zembile-yellow" min={0} />
                  <span className="text-gray-500">—</span>
                  <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-zembile-yellow" min={0} />
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Min Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 0].map(r => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="rating" checked={selectedRating === r} onChange={() => setSelectedRating(r)} className="text-zembile-yellow focus:ring-zembile-yellow" />
                      <div className="flex items-center gap-1">
                        {r > 0 ? <>{[...Array(5)].map((_, i) => <svg key={i} className={`w-4 h-4 ${i < r ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}<span className="text-sm text-gray-600">& Up</span></> : <span className="text-sm text-gray-600">All Ratings</span>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="rounded border-gray-300 text-zembile-yellow focus:ring-zembile-yellow" />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={onSaleOnly} onChange={e => setOnSaleOnly(e.target.checked)} className="rounded border-gray-300 text-zembile-yellow focus:ring-zembile-yellow" />
                  <span className="text-sm text-gray-700">On Sale</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" /></svg>
                    Filters
                  </button>
                  <h1 className="text-xl font-bold text-gray-900">{selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || 'Products' : 'All Products'}</h1>
                  <span className="text-gray-500 text-sm">({pagination.total} products)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    {['grid', 'list'].map(m => (
                      <button key={m} onClick={() => setViewMode(m)} className={`p-2 ${viewMode === m ? 'bg-zembile-yellow text-zembile-gray' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                        {m === 'grid' ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>}
                      </button>
                    ))}
                  </div>
                  <select value={sort} onChange={e => setSort(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow text-sm">
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="discount">Biggest Discount</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(12)].map((_, i) => <div key={i} className="h-72 bg-gray-200 rounded-xl animate-pulse" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="bg-zembile-yellow text-zembile-gray px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {products.map(p => <ProductCard key={p._id} product={p} viewMode={viewMode} />)}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">Previous</button>
                    {[...Array(Math.min(pagination.pages, 7))].map((_, i) => {
                      const p = i + 1
                      return <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-lg text-sm font-medium ${page === p ? 'bg-zembile-yellow text-zembile-gray' : 'border border-gray-300 hover:bg-gray-50'}`}>{p}</button>
                    })}
                    <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">Next</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
