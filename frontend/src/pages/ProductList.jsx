import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products as allProducts, categories, brands, searchProducts } from '../data/products'

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State management
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  )
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedRating, setSelectedRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [onSaleOnly, setOnSaleOnly] = useState(searchParams.get('filter') === 'discounted')
  const [sort, setSort] = useState('popular')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // Price range calculations
  const priceStats = useMemo(() => {
    const prices = allProducts.map(p => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    }
  }, [])

  // Update price range when component mounts
  useEffect(() => {
    setPriceRange([priceStats.min, priceStats.max])
  }, [priceStats])

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let filtered = allProducts

    // Text search
    if (query.trim()) {
      filtered = searchProducts(query)
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category))
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand))
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter(p => p.rating >= selectedRating)
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock)
    }

    // Sale filter
    if (onSaleOnly) {
      filtered = filtered.filter(p => p.discount > 0)
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
          return b.id - a.id
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        case 'discount':
          return (b.discount || 0) - (a.discount || 0)
        default: // popular
          return (b.rating || 0) * (b.reviewCount || 0) - (a.rating || 0) * (a.reviewCount || 0)
      }
    })

    return filtered
  }, [query, selectedCategories, selectedBrands, priceRange, selectedRating, inStockOnly, onSaleOnly, sort])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [query, selectedCategories, selectedBrands, priceRange, selectedRating, inStockOnly, onSaleOnly, sort])

  // Helper functions
  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleBrand = (brandId) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(b => b !== brandId)
        : [...prev, brandId]
    )
  }

  const clearAllFilters = () => {
    setQuery('')
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([priceStats.min, priceStats.max])
    setSelectedRating(0)
    setInStockOnly(false)
    setOnSaleOnly(false)
    setSort('popular')
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...priceRange]
    newRange[index] = parseInt(value)
    
    // Ensure min <= max
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0]
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1]
    }
    
    setPriceRange(newRange)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Products</span>
            {selectedCategories.length === 1 && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">
                  {categories.find(c => c.id === selectedCategories[0])?.name}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-zembile-gray hover:text-gray-600 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, description..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => {
                    const count = allProducts.filter(p => p.category === category.id).length
                    return (
                      <label key={category.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="rounded border-gray-300 text-zembile-yellow focus:ring-zembile-yellow"
                        />
                        <span className="ml-3 text-sm text-gray-700 flex-1">
                          {category.icon} {category.name}
                        </span>
                        <span className="text-xs text-gray-500">({count})</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-zembile-yellow"
                      min={priceStats.min}
                      max={priceStats.max}
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-zembile-yellow"
                      min={priceStats.min}
                      max={priceStats.max}
                    />
                    <span className="text-sm text-gray-500">ETB</span>
                  </div>
                  
                  {/* Price Range Slider */}
                  <div className="relative pt-2 pb-6">
                    <div className="relative h-2">
                      {/* Track */}
                      <div className="absolute w-full h-2 bg-gray-200 rounded-lg"></div>
                      
                      {/* Active Range */}
                      <div 
                        className="absolute h-2 bg-zembile-yellow rounded-lg"
                        style={{
                          left: `${((priceRange[0] - priceStats.min) / (priceStats.max - priceStats.min)) * 100}%`,
                          width: `${((priceRange[1] - priceRange[0]) / (priceStats.max - priceStats.min)) * 100}%`
                        }}
                      ></div>
                      
                      {/* Min Range Slider */}
                      <input
                        type="range"
                        min={priceStats.min}
                        max={priceStats.max}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer range-slider"
                        style={{ zIndex: 1 }}
                      />
                      
                      {/* Max Range Slider */}
                      <input
                        type="range"
                        min={priceStats.min}
                        max={priceStats.max}
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer range-slider"
                        style={{ zIndex: 2 }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{priceStats.min} ETB</span>
                    <span>{priceStats.max} ETB</span>
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Brands</h4>
                <div className="space-y-2">
                  {brands.map(brand => {
                    const count = allProducts.filter(p => p.brand === brand.id).length
                    return (
                      <label key={brand.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.id)}
                          onChange={() => toggleBrand(brand.id)}
                          className="rounded border-gray-300 text-zembile-yellow focus:ring-zembile-yellow"
                        />
                        <span className="ml-3 text-sm text-gray-700 flex-1">{brand.name}</span>
                        <span className="text-xs text-gray-500">({count})</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Customer Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(rating)}
                        className="text-zembile-yellow focus:ring-zembile-yellow"
                      />
                      <div className="ml-3 flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">& Up</span>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === 0}
                      onChange={() => setSelectedRating(0)}
                      className="text-zembile-yellow focus:ring-zembile-yellow"
                    />
                    <span className="ml-3 text-sm text-gray-600">All Ratings</span>
                  </label>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-gray-300 text-zembile-yellow focus:ring-zembile-yellow"
                  />
                  <span className="ml-3 text-sm text-gray-700">In Stock Only</span>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onSaleOnly}
                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                    className="rounded border-gray-300 text-zembile-yellow focus:ring-zembile-yellow"
                  />
                  <span className="ml-3 text-sm text-gray-700">On Sale</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header with Results and Controls */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedCategories.length === 1 
                      ? categories.find(c => c.id === selectedCategories[0])?.name 
                      : 'All Products'
                    }
                  </h1>
                  <span className="text-gray-500">
                    ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'})
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    Filters
                  </button>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-zembile-yellow text-zembile-gray' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-zembile-yellow text-zembile-gray' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                    <option value="discount">Biggest Discount</option>
                  </select>

                  {/* Items Per Page */}
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent"
                  >
                    <option value={12}>12 per page</option>
                    <option value={24}>24 per page</option>
                    <option value={48}>48 per page</option>
                    <option value={96}>96 per page</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedRating > 0 || inStockOnly || onSaleOnly || query) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    
                    {query && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-zembile-yellow text-zembile-gray rounded-full text-sm">
                        Search: "{query}"
                        <button onClick={() => setQuery('')} className="ml-1 hover:text-gray-600">×</button>
                      </span>
                    )}
                    
                    {selectedCategories.map(categoryId => {
                      const category = categories.find(c => c.id === categoryId)
                      return (
                        <span key={categoryId} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {category?.name}
                          <button onClick={() => toggleCategory(categoryId)} className="ml-1 hover:text-blue-600">×</button>
                        </span>
                      )
                    })}
                    
                    {selectedBrands.map(brandId => {
                      const brand = brands.find(b => b.id === brandId)
                      return (
                        <span key={brandId} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {brand?.name}
                          <button onClick={() => toggleBrand(brandId)} className="ml-1 hover:text-green-600">×</button>
                        </span>
                      )
                    })}
                    
                    {selectedRating > 0 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {selectedRating}+ Stars
                        <button onClick={() => setSelectedRating(0)} className="ml-1 hover:text-yellow-600">×</button>
                      </span>
                    )}
                    
                    {inStockOnly && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        In Stock
                        <button onClick={() => setInStockOnly(false)} className="ml-1 hover:text-purple-600">×</button>
                      </span>
                    )}
                    
                    {onSaleOnly && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        On Sale
                        <button onClick={() => setOnSaleOnly(false)} className="ml-1 hover:text-red-600">×</button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid/List */}
            {paginatedProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
              }>
                {paginatedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.007-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2.306" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearAllFilters}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                    if (pageNum > totalPages) return null
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 border rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-zembile-yellow text-zembile-gray border-zembile-yellow'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-2">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
