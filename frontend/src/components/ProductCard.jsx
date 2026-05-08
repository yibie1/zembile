import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)

  // Normalize: support MongoDB (_id, stock) and legacy (id, inStock)
  const pid = product._id || product.id
  const inStock = product.stock > 0 || product.inStock === true
  const norm = { ...product, id: pid, _id: pid, inStock }

  const addToCart = (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!inStock) { toast.error('Out of stock'); return }
    addItem(norm, 1)
    toast.success(`Added to cart!`, { icon: '🛒', duration: 2000 })
  }

  const buyNow = (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!inStock) { toast.error('Out of stock'); return }
    addItem(norm, 1)
    setTimeout(() => { window.location.href = '/checkout' }, 300)
  }

  const toggleWishlist = (e) => {
    e.preventDefault(); e.stopPropagation()
    toggleItem(norm)
  }

  const img = product.images?.[imgIdx] || product.thumbnail || product.image ||
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80'

  const Stars = ({ rating }) => (
    <div className="flex items-center">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )

  if (viewMode === 'list') {
    return (
      <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        <Link to={`/product/${pid}`} className="flex p-4 gap-4">
          <div className="relative w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
            {product.discount > 0 && <div className="absolute top-1 left-1 z-10 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{product.discount}%</div>}
            <button onClick={toggleWishlist} className="absolute top-1 right-1 z-10 w-7 h-7 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow">
              <svg className={`w-4 h-4 ${isInWishlist(pid) ? 'text-red-500' : 'text-gray-400'}`} fill={isInWishlist(pid) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
            <img src={img} alt={product.name} className={`object-cover w-full h-full transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImageLoaded(true)} />
            {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
          </div>
          <div className="flex-1 min-w-0 flex justify-between">
            <div className="flex-1">
              {product.brand && <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.brand}</div>}
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
              {product.rating > 0 && <div className="flex items-center gap-1 mb-2"><Stars rating={product.rating} /><span className="text-xs text-gray-500">({product.reviewCount || 0})</span></div>}
              <p className="text-sm text-gray-600 line-clamp-2">{product.shortDescription || product.description}</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <div className="text-xl font-bold text-gray-900">{product.price?.toLocaleString()} ETB</div>
              {product.originalPrice > product.price && <div className="text-sm text-gray-400 line-through">{product.originalPrice?.toLocaleString()} ETB</div>}
              <div className={`text-sm font-medium mt-1 ${inStock ? 'text-green-600' : 'text-red-600'}`}>{inStock ? (product.stock < 10 ? `Only ${product.stock} left` : 'In Stock') : 'Out of Stock'}</div>
              <div className="mt-3 space-y-2">
                <button onClick={addToCart} disabled={!inStock} className="w-full bg-zembile-gray text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors">Add to Cart</button>
                <button onClick={buyNow} disabled={!inStock} className="w-full bg-zembile-yellow text-zembile-gray px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-yellow-400 transition-colors">Buy Now</button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${pid}`} className="block">
        <div className="relative h-64 bg-gray-50 overflow-hidden">
          {product.discount > 0 && <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{product.discount}%</div>}
          {!inStock && <div className="absolute top-3 right-3 z-10 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">Out of Stock</div>}
          <button onClick={toggleWishlist} className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all">
            <svg className={`w-4 h-4 ${isInWishlist(pid) ? 'text-red-500' : 'text-gray-400'}`} fill={isInWishlist(pid) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
          <img src={img} alt={product.name} className={`object-cover w-full h-full transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImageLoaded(true)} />
          {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
          {product.images?.length > 1 && (
            <>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIdx(p => (p - 1 + product.images.length) % product.images.length) }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIdx(p => (p + 1) % product.images.length) }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-4">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={addToCart} disabled={!inStock} className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm">Add to Cart</button>
              <button onClick={buyNow} disabled={!inStock} className="bg-zembile-yellow text-zembile-gray px-4 py-2 rounded-full font-medium shadow-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 text-sm">Buy Now</button>
            </div>
          </div>
        </div>
        <div className="p-4">
          {product.brand && <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.brand}</div>}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-zembile-gray transition-colors">{product.name}</h3>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Stars rating={product.rating} />
              <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
            </div>
          )}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.shortDescription || product.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900">{product.price?.toLocaleString()} ETB</span>
              {product.originalPrice > product.price && <span className="text-sm text-gray-400 line-through ml-2">{product.originalPrice?.toLocaleString()} ETB</span>}
            </div>
            {inStock && product.stock < 10 && <span className="text-xs text-orange-600 font-medium">Only {product.stock} left</span>}
          </div>
          <div className="mt-3 flex gap-2 md:hidden">
            <button onClick={addToCart} disabled={!inStock} className="flex-1 bg-zembile-gray text-white py-2 rounded-full text-sm font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors">Add to Cart</button>
            <button onClick={buyNow} disabled={!inStock} className="flex-1 bg-zembile-yellow text-zembile-gray py-2 rounded-full text-sm font-medium disabled:opacity-50 hover:bg-yellow-400 transition-colors">Buy Now</button>
          </div>
        </div>
      </Link>
    </div>
  )
}
