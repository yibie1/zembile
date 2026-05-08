import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { productsApi } from '../services/api'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [reviews, setReviews] = useState([])
  const [imgIdx, setImgIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('description')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '', reviewerName: user?.firstName ? `${user.firstName} ${user.lastName}` : '', reviewerEmail: user?.email || '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await productsApi.getById(id)
        const p = res.data
        setProduct(p)
        setRelated(p.related || [])
        setReviews(p.reviews || [])
        if (p.variants?.find(v => v.name === 'Size')?.options?.length) {
          setSelectedSize(p.variants.find(v => v.name === 'Size').options[0])
        }
      } catch (err) {
        toast.error('Product not found')
        navigate('/products')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  if (loading) return <Skeleton />
  if (!product) return null

  const pid = product._id || product.id
  const inStock = product.stock > 0
  const norm = { ...product, id: pid, _id: pid, inStock }
  const img = product.images?.[imgIdx] || product.thumbnail || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80'
  const sizeOptions = product.variants?.find(v => v.name === 'Size')?.options || []

  const handleAddToCart = () => {
    if (!inStock) { toast.error('Out of stock'); return }
    addItem({ ...norm, selectedSize }, qty)
    toast.success(`Added ${qty}× ${product.name} to cart!`, { icon: '🛒' })
  }

  const handleBuyNow = () => {
    if (!inStock) { toast.error('Out of stock'); return }
    addItem({ ...norm, selectedSize }, qty)
    navigate('/checkout')
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewForm.comment.trim() || !reviewForm.reviewerName.trim()) {
      toast.error('Name and comment are required')
      return
    }
    setSubmittingReview(true)
    try {
      await productsApi.addReview(pid, reviewForm)
      toast.success('Review submitted! It will appear after approval.')
      setReviewForm(prev => ({ ...prev, comment: '', title: '' }))
    } catch (err) {
      toast.error(err.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const Stars = ({ rating, interactive = false, onRate }) => (
    <div className="flex items-center">
      {[1,2,3,4,5].map(i => (
        <svg key={i} onClick={() => interactive && onRate(i)}
          className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600 flex flex-wrap gap-1">
            <Link to="/" className="hover:text-zembile-gray">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-zembile-gray">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-zembile-gray capitalize">{product.category}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg group aspect-square cursor-zoom-in" onClick={() => setShowModal(true)}>
              <img src={img} alt={product.name} className="w-full h-full object-cover" />
              {product.discount > 0 && <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">-{product.discount}% OFF</div>}
              {product.images?.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setImgIdx(p => (p - 1 + product.images.length) % product.images.length) }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setImgIdx(p => (p + 1) % product.images.length) }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-zembile-yellow' : 'border-gray-200 hover:border-gray-300'}`}>
                    <img src={image} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {product.brand && <div className="text-sm text-zembile-gray font-medium uppercase tracking-wide">{product.brand}</div>}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            {product.rating > 0 && (
              <div className="flex items-center gap-3">
                <Stars rating={product.rating} />
                <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
                <button onClick={() => setTab('reviews')} className="text-sm text-zembile-gray underline">Read Reviews</button>
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">{product.price?.toLocaleString()} ETB</span>
                {product.originalPrice > product.price && <span className="text-xl text-gray-400 line-through">{product.originalPrice?.toLocaleString()} ETB</span>}
              </div>
              {product.discount > 0 && <div className="text-sm text-green-600 font-medium">You save {(product.originalPrice - product.price)?.toLocaleString()} ETB ({product.discount}% off)</div>}
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                {inStock ? (product.stock < 10 ? `Only ${product.stock} left in stock` : 'In Stock') : 'Out of Stock'}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">{product.shortDescription || product.description?.slice(0, 200)}</p>
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{tag}</span>)}
              </div>
            )}
            {sizeOptions.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Size:</h3>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-lg font-medium transition-colors ${selectedSize === size ? 'border-zembile-yellow bg-zembile-yellow text-zembile-gray' : 'border-gray-300 hover:border-gray-400'}`}>{size}</button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quantity:</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 text-lg font-medium">-</button>
                <span className="w-12 text-center font-medium text-lg">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 text-lg font-medium">+</button>
              </div>
            </div>
            <div className="space-y-3">
              <button onClick={handleBuyNow} disabled={!inStock} className="w-full bg-zembile-yellow text-zembile-gray py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Buy Now — {(product.price * qty)?.toLocaleString()} ETB
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleAddToCart} disabled={!inStock} className="bg-zembile-gray text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50">Add to Cart</button>
                <button onClick={() => toggleItem(norm)} className={`border-2 py-3 rounded-xl font-semibold transition-colors ${isInWishlist(pid) ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}>
                  {isInWishlist(pid) ? '❤️ Wishlisted' : '🤍 Wishlist'}
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
              {[['✅', 'Free shipping on orders over 500 ETB'], ['⏱️', 'Same-day delivery in Addis Ababa'], ['↩️', '30-day return policy'], ['🔒', 'Secure Chapa payment']].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-2"><span>{icon}</span><span>{text}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-12">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {[{ id: 'description', label: 'Description' }, { id: 'specs', label: 'Specifications' }, { id: 'reviews', label: `Reviews (${reviews.length})` }, { id: 'shipping', label: 'Shipping & Returns' }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${tab === t.id ? 'border-zembile-yellow text-zembile-gray' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.label}</button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {tab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
                {product.origin && <p className="mt-4 text-sm text-gray-500">🇪🇹 Origin: {product.origin}</p>}
              </div>
            )}
            {tab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[['SKU', product.sku], ['Category', product.category], ['Brand', product.brand], ['Origin', product.origin], ['Weight', product.weight ? `${product.weight}g` : null]].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-900">{k}:</span>
                    <span className="text-gray-700 capitalize">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'reviews' && (
              <div className="space-y-8">
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((r, i) => (
                      <div key={i} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zembile-yellow rounded-full flex items-center justify-center font-bold text-zembile-gray">{r.reviewerName?.charAt(0)?.toUpperCase()}</div>
                            <div>
                              <div className="font-medium text-gray-900">{r.reviewerName}</div>
                              {r.isVerifiedPurchase && <span className="text-xs text-green-600">✓ Verified Purchase</span>}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Stars rating={r.rating} />
                        {r.title && <h4 className="font-semibold text-gray-900 mt-2">{r.title}</h4>}
                        <p className="text-gray-700 mt-1">{r.comment}</p>
                        {r.adminResponse && <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm"><span className="font-medium text-gray-900">Seller Response: </span>{r.adminResponse}</div>}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500">No reviews yet. Be the first to review!</p>}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <Stars rating={reviewForm.rating} interactive onRate={r => setReviewForm(p => ({ ...p, rating: r }))} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                        <input value={reviewForm.reviewerName} onChange={e => setReviewForm(p => ({ ...p, reviewerName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" value={reviewForm.reviewerEmail} onChange={e => setReviewForm(p => ({ ...p, reviewerEmail: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
                      <input value={reviewForm.title} onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent" placeholder="Summarize your experience" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Review *</label>
                      <textarea value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent" placeholder="Share your experience with this product..." required />
                    </div>
                    <button type="submit" disabled={submittingReview} className="bg-zembile-gray text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </div>
            )}
            {tab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Shipping Information</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    {['Free shipping on orders over 500 ETB', 'Same-day delivery in Addis Ababa', '2-3 business days for major cities', '5-7 business days for remote areas', 'Tracking number provided after dispatch'].map(t => <li key={t}>• {t}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Return Policy</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    {['30-day return window', 'Items must be in original condition', 'Free returns for defective items', 'Customer pays return shipping for size/color changes', 'Refunds processed within 5-7 business days'].map(t => <li key={t}>• {t}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
              <Link to={`/products?category=${product.category}`} className="text-zembile-gray hover:text-gray-600 font-medium">View All →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center z-10">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={img} alt={product.name} className="max-w-full max-h-full object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          <div className="space-y-6">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-48" />
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="grid grid-cols-2 gap-3"><div className="h-12 bg-gray-200 rounded-xl" /><div className="h-12 bg-gray-200 rounded-xl" /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
