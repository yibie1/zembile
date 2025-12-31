import React, {useState, useMemo} from 'react'
import ProductCard from '../components/ProductCard'
import { products as allProducts } from '../data/products'

export default function ProductList(){
  const [query, setQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('popular')

  const categories = useMemo(() => {
    const set = new Set(allProducts.map(p => p.category || 'other'))
    return Array.from(set)
  }, [])

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c=>c!==cat) : [...prev, cat])
  }

  const filtered = useMemo(() => {
    return allProducts
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .filter(p => selectedCategories.length ? selectedCategories.includes(p.category) : true)
      .filter(p => minPrice ? p.price >= Number(minPrice) : true)
      .filter(p => maxPrice ? p.price <= Number(maxPrice) : true)
      .sort((a,b) => {
        if(sort === 'price_asc') return a.price - b.price
        if(sort === 'price_desc') return b.price - a.price
        return a.id - b.id
      })
  }, [query, selectedCategories, minPrice, maxPrice, sort])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-3">Filters</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products" className="mt-1 block w-full border rounded-md px-3 py-2" />
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Category</div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => toggleCategory(cat)} className={`px-3 py-1 rounded-full text-sm border ${selectedCategories.includes(cat) ? 'bg-zembile-gray text-white' : 'bg-white text-gray-700'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Price</div>
            <div className="flex items-center gap-2">
              <input value={minPrice} onChange={e=>setMinPrice(e.target.value)} placeholder="Min" className="w-1/2 border rounded-md px-2 py-1" />
              <input value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="Max" className="w-1/2 border rounded-md px-2 py-1" />
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Sort</div>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="w-full border rounded-md px-2 py-1">
              <option value="popular">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { setSelectedCategories([]); setMinPrice(''); setMaxPrice(''); setQuery(''); setSort('popular') }} className="px-3 py-2 rounded-md bg-zembile-yellow text-zembile-gray font-semibold">Clear</button>
          </div>
        </div>
      </aside>

      <div className="lg:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="text-sm text-gray-500">{filtered.length} results</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
