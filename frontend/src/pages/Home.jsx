import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { productsApi, categoriesApi } from '../services/api'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [saleProducts, setSaleProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [email, setEmail] = useState('')
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 12 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feat, arrivals, sellers, sale, cats] = await Promise.all([
          productsApi.getFeatured(8),
          productsApi.getNewArrivals(6),
          productsApi.getBestSellers(6),
          productsApi.getOnSale(6),
          categoriesApi.getAll()
        ])
        setFeaturedProducts(feat.data || [])
        setNewArrivals(arrivals.data || [])
        setBestSellers(sellers.data || [])
        setSaleProducts(sale.data || [])
        setCategories(cats.data || [])
      } catch (err) {
        console.error('Failed to load home data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev
        if (seconds > 0) seconds--
        else if (minutes > 0) { minutes--; seconds = 59 }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59 }
        else { hours = 23; minutes = 59; seconds = 59 }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Banner carousel
  const banners = [
    { title: 'Premium Ethiopian Coffee', subtitle: 'Discover authentic flavors from highland farms', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80', cta: 'Shop Coffee', link: '/products?category=coffee', bgColor: 'from-amber-900 to-amber-700', badge: 'Best Seller' },
    { title: 'Handcrafted Artisan Goods', subtitle: 'Support local Ethiopian artisans and craftspeople', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80', cta: 'Explore Crafts', link: '/products?category=crafts', bgColor: 'from-emerald-900 to-emerald-700', badge: 'New Collection' },
    { title: 'Traditional Spices & Foods', subtitle: 'Authentic Ethiopian flavors for your kitchen', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80', cta: 'Shop Food', link: '/products?category=food', bgColor: 'from-red-900 to-red-700', badge: 'Up to 30% Off' }
  ]

  useEffect(() => {
    const t = setInterval(() => setCurrentBannerIndex(p => (p + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [banners.length])

  const fmt = (n) => n.toString().padStart(2, '0')

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-96 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <div key={i} className="h-72 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Trust Bar */}
      <section className="bg-zembile-yellow py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-zembile-gray">
            {[
              { icon: '🚚', text: 'Free shipping over 500 ETB' },
              { icon: '🔒', text: 'Secure Chapa payment' },
              { icon: '↩️', text: 'Easy returns' },
              { icon: '🇪🇹', text: '100% Ethiopian authentic' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
        {banners.map((banner, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} opacity-80`} />
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div className="max-w-4xl px-6">
                <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">{banner.badge}</div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{banner.title}</h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">{banner.subtitle}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to={banner.link} className="bg-zembile-yellow text-zembile-gray px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg">{banner.cta}</Link>
                  <Link to="/products" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors">Browse All</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrentBannerIndex(i)} className={`w-3 h-3 rounded-full transition-colors ${i === currentBannerIndex ? 'bg-white' : 'bg-white/50'}`} />
          ))}
        </div>
        <button onClick={() => setCurrentBannerIndex(p => (p - 1 + banners.length) % banners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={() => setCurrentBannerIndex(p => (p + 1) % banners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </section>

      {/* Flash Sale Banner */}
      {saleProducts.length > 0 && (
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-2xl font-bold">⚡ Flash Sale</h3>
              <p className="text-white/90">Up to 50% off on selected Ethiopian products</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2 text-center">
                {[{ v: fmt(timeLeft.hours), l: 'Hours' }, { v: fmt(timeLeft.minutes), l: 'Mins' }, { v: fmt(timeLeft.seconds), l: 'Secs' }].map(({ v, l }) => (
                  <div key={l} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px]">
                    <div className="text-2xl font-bold">{v}</div>
                    <div className="text-xs opacity-80">{l}</div>
                  </div>
                ))}
              </div>
              <Link to="/products?onSale=true" className="bg-white/90 hover:bg-white text-gray-900 px-6 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg">Shop Now</Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/products" className="text-zembile-gray hover:text-gray-600 font-medium">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat._id} to={`/products?category=${cat.slug}`} className="group bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg hover:border-zembile-yellow transition-all duration-300">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-600">{cat.description?.slice(0, 40)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Special Offers</h2>
              <p className="text-gray-600 mt-1">Limited time deals on premium products</p>
            </div>
            <Link to="/products?onSale=true" className="text-zembile-gray hover:text-gray-600 font-medium">View All Deals →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saleProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
              <p className="text-gray-600 mt-1">Fresh products just added to our collection</p>
            </div>
            <Link to="/products?sort=newest" className="text-zembile-gray hover:text-gray-600 font-medium">View All New →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map(p => (
              <div key={p._id} className="relative">
                <div className="absolute top-2 left-2 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">NEW</div>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
              <p className="text-gray-600 mt-1">Most popular products loved by our customers</p>
            </div>
            <Link to="/products?sort=popular" className="text-zembile-gray hover:text-gray-600 font-medium">View All Popular →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map((p, i) => (
              <div key={p._id} className="relative">
                {i < 3 && <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">#{i + 1} BESTSELLER</div>}
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 mt-1">Handpicked premium Ethiopian goods</p>
            </div>
            <Link to="/products" className="text-zembile-gray hover:text-gray-600 font-medium">View All Products →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied customers who trust Zembile for authentic Ethiopian products.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Meron Tadesse', city: 'Addis Ababa', text: 'Amazing quality coffee! The authentic Ethiopian taste brings back memories of home. Fast delivery too!' },
            { name: 'Daniel Bekele', city: 'Bahir Dar', text: 'Beautiful handcrafted items that support local artisans. The quality is exceptional and shipping was quick.' },
            { name: 'Sara Mohammed', city: 'Dire Dawa', text: 'Excellent customer service and authentic spices. Zembile has become my go-to for Ethiopian products.' }
          ].map((t, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, j) => <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
              </div>
              <p className="text-gray-600 mb-4 italic">"{t.text}"</p>
              <div className="font-semibold text-gray-900">{t.name}</div>
              <div className="text-sm text-gray-500">{t.city}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-200">
          {[{ v: '10K+', l: 'Happy Customers' }, { v: '500+', l: 'Products' }, { v: '50+', l: 'Partner Artisans' }, { v: '4.8★', l: 'Average Rating' }].map(({ v, l }) => (
            <div key={l} className="text-center">
              <div className="text-3xl font-bold text-zembile-gray mb-2">{v}</div>
              <div className="text-sm text-gray-600">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-zembile-gray to-gray-800 text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">Get the latest deals, new arrivals, and Ethiopian culture stories delivered to your inbox.</p>
        <form onSubmit={(e) => { e.preventDefault(); setEmail(''); alert('Thank you for subscribing!') }} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-zembile-yellow" />
          <button type="submit" className="bg-zembile-yellow text-zembile-gray px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors">Subscribe</button>
        </form>
      </section>
    </div>
  )
}
