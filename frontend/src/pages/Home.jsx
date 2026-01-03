import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products, categories, getFeaturedProducts, getDiscountedProducts, getProductsByCategory } from '../data/products'

export default function Home() {
  const [featuredProducts] = useState(getFeaturedProducts().slice(0, 8))
  const [discountedProducts] = useState(getDiscountedProducts().slice(0, 6))
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0)
  const [newArrivals] = useState(products.slice(0, 6))
  const [bestSellers] = useState(products.filter(p => p.rating >= 4.5).slice(0, 6))
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  
  // Flash Sale Timer State
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 12
  })

  // Dynamic promotional banners
  const promoBanners = [
    {
      id: 1,
      type: 'flash_sale',
      title: '⚡ Flash Sale',
      subtitle: 'Up to 50% off on selected Ethiopian products',
      badge: 'Limited Time',
      bgColor: 'from-red-600 to-red-700',
      textColor: 'text-white',
      link: '/products?filter=sale',
      cta: 'Shop Now',
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      active: true
    },
    {
      id: 2,
      type: 'christmas',
      title: '🎄 Christmas Special',
      subtitle: 'Perfect Ethiopian gifts for the holiday season',
      badge: 'Holiday Deals',
      bgColor: 'from-green-600 to-red-600',
      textColor: 'text-white',
      link: '/products?category=crafts',
      cta: 'Shop Gifts',
      endTime: new Date('2024-12-25'),
      active: true
    },
    {
      id: 3,
      type: 'new_year',
      title: '🎊 New Year Sale',
      subtitle: 'Start 2024 with authentic Ethiopian flavors',
      badge: 'New Year Special',
      bgColor: 'from-purple-600 to-pink-600',
      textColor: 'text-white',
      link: '/products?category=food',
      cta: 'Explore Now',
      endTime: new Date('2024-01-15'),
      active: true
    },
    {
      id: 4,
      type: 'coffee_week',
      title: '☕ Ethiopian Coffee Week',
      subtitle: 'Celebrate the birthplace of coffee with premium beans',
      badge: 'Coffee Special',
      bgColor: 'from-amber-700 to-amber-900',
      textColor: 'text-white',
      link: '/products?category=coffee',
      cta: 'Shop Coffee',
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      active: true
    },
    {
      id: 5,
      type: 'free_shipping',
      title: '🚚 Free Shipping Weekend',
      subtitle: 'Free delivery on all orders - no minimum required',
      badge: 'This Weekend Only',
      bgColor: 'from-blue-600 to-blue-700',
      textColor: 'text-white',
      link: '/products',
      cta: 'Shop All',
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      active: true
    }
  ]

  // Dynamic trust indicators that rotate
  const trustIndicatorSets = [
    [
      { icon: "🚚", text: "Free shipping over 500 ETB", highlight: true },
      { icon: "🔒", text: "Secure payment", highlight: false },
      { icon: "↩️", text: "Easy returns", highlight: false },
      { icon: "📞", text: "24/7 support", highlight: false }
    ],
    [
      { icon: "⚡", text: "Same-day delivery in Addis", highlight: true },
      { icon: "🏆", text: "Premium quality guaranteed", highlight: false },
      { icon: "🇪🇹", text: "100% Ethiopian authentic", highlight: false },
      { icon: "💝", text: "Gift wrapping available", highlight: false }
    ],
    [
      { icon: "🌟", text: "4.8★ customer rating", highlight: true },
      { icon: "👥", text: "10,000+ happy customers", highlight: false },
      { icon: "🤝", text: "Supporting local artisans", highlight: false },
      { icon: "📦", text: "Careful packaging", highlight: false }
    ]
  ]

  const [currentTrustSet, setCurrentTrustSet] = useState(0)

  // Get active promotional banners
  const activePromoBanners = promoBanners.filter(banner => {
    if (!banner.active) return false
    return new Date() < new Date(banner.endTime)
  })

  // Banner carousel
  const banners = [
    {
      title: "Premium Ethiopian Coffee",
      subtitle: "Discover authentic flavors from highland farms",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80&auto=format&fit=crop",
      cta: "Shop Coffee",
      link: "/products?category=coffee",
      bgColor: "from-amber-900 to-amber-700",
      badge: "Best Seller"
    },
    {
      title: "Handcrafted Artisan Goods",
      subtitle: "Support local Ethiopian artisans and craftspeople",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop",
      cta: "Explore Crafts",
      link: "/products?category=crafts",
      bgColor: "from-emerald-900 to-emerald-700",
      badge: "New Collection"
    },
    {
      title: "Traditional Spices & Foods",
      subtitle: "Authentic Ethiopian flavors for your kitchen",
      image: "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=1200&q=80&auto=format&fit=crop",
      cta: "Shop Food",
      link: "/products?category=food",
      bgColor: "from-red-900 to-red-700",
      badge: "Up to 30% Off"
    }
  ]

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    
    setIsSubscribing(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubscribing(false)
      setEmail('')
      // Show success message (you can add toast here)
      alert('Thank you for subscribing!')
    }, 1000)
  }

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else {
          // Reset timer when it reaches 0
          hours = 23
          minutes = 59
          seconds = 59
        }
        
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Banner carousel effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  // Promotional banner rotation
  useEffect(() => {
    if (activePromoBanners.length > 1) {
      const timer = setInterval(() => {
        setCurrentPromoIndex((prev) => (prev + 1) % activePromoBanners.length)
      }, 8000) // Change every 8 seconds
      return () => clearInterval(timer)
    }
  }, [activePromoBanners.length])

  // Trust indicators rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTrustSet((prev) => (prev + 1) % trustIndicatorSets.length)
    }, 6000) // Change every 6 seconds
    return () => clearInterval(timer)
  }, [trustIndicatorSets.length])

  // Format time with leading zeros
  const formatTime = (time) => time.toString().padStart(2, '0')

  return (
    <div className="space-y-12">
      {/* Dynamic Trust Indicators Bar */}
      <section className="bg-zembile-yellow py-3 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-zembile-gray transition-all duration-500">
            {trustIndicatorSets[currentTrustSet].map((indicator, index) => (
              <div 
                key={`${currentTrustSet}-${index}`} 
                className={`flex items-center gap-2 transition-all duration-300 ${
                  indicator.highlight ? 'scale-110 font-bold' : ''
                }`}
              >
                <span className="text-lg">{indicator.icon}</span>
                <span>{indicator.text}</span>
                {indicator.highlight && (
                  <span className="bg-zembile-gray text-zembile-yellow px-2 py-1 rounded-full text-xs font-bold ml-1">
                    NEW
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Banner Carousel */}
      <section className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} opacity-80`}></div>
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div className="max-w-4xl px-6">
                {/* Badge */}
                <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  {banner.badge}
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                  {banner.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {banner.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to={banner.link}
                    className="bg-zembile-yellow text-zembile-gray px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg"
                  >
                    {banner.cta}
                  </Link>
                  <Link
                    to="/products"
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors"
                  >
                    Browse All
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Banner Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBannerIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Banner Navigation Arrows */}
        <button
          onClick={() => setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % banners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Dynamic Promotional Banners */}
      {activePromoBanners.length > 0 && (
        <section className="relative">
          {activePromoBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`transition-all duration-1000 ${
                index === currentPromoIndex ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none'
              }`}
            >
              <div className={`bg-gradient-to-r ${banner.bgColor} ${banner.textColor} rounded-2xl p-6 md:p-8`}>
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <h3 className="text-2xl font-bold">{banner.title}</h3>
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                        {banner.badge}
                      </span>
                    </div>
                    <p className="text-white/90 mb-2">{banner.subtitle}</p>
                    {banner.type === 'flash_sale' && (
                      <p className="text-xs text-white/70">
                        Hurry! Limited quantities available
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Working Countdown Timer for Flash Sale */}
                    {banner.type === 'flash_sale' && (
                      <div className="flex gap-2 text-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px]">
                          <div className="text-2xl font-bold">{formatTime(timeLeft.hours)}</div>
                          <div className="text-xs opacity-80">Hours</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px]">
                          <div className="text-2xl font-bold">{formatTime(timeLeft.minutes)}</div>
                          <div className="text-xs opacity-80">Mins</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px]">
                          <div className="text-2xl font-bold">{formatTime(timeLeft.seconds)}</div>
                          <div className="text-xs opacity-80">Secs</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Static Timer for Other Promotions */}
                    {banner.type !== 'flash_sale' && (
                      <div className="text-center">
                        <div className="text-sm opacity-80 mb-1">Ends in</div>
                        <div className="text-lg font-bold">
                          {Math.ceil((new Date(banner.endTime) - new Date()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </div>
                    )}
                    
                    <Link
                      to={banner.link}
                      className="bg-white/90 hover:bg-white text-gray-900 px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      {banner.cta}
                    </Link>
                  </div>
                </div>
                
                {/* Progress bar for urgency */}
                {banner.type === 'flash_sale' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Sale Progress</span>
                      <span>67% claimed</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-2/3 transition-all duration-300"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Promotional Banner Indicators */}
          {activePromoBanners.length > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {activePromoBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPromoIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPromoIndex ? 'bg-gray-800 w-6' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <Link to="/products" className="text-zembile-gray hover:text-gray-600 font-medium">
            View All Categories →
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg hover:border-zembile-yellow transition-all duration-300"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-xs text-gray-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offers */}
      {discountedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Special Offers</h2>
              <p className="text-gray-600 mt-1">Limited time deals on premium products</p>
            </div>
            <Link to="/products?filter=discounted" className="text-zembile-gray hover:text-gray-600 font-medium">
              View All Deals →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {discountedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
            <p className="text-gray-600 mt-1">Fresh products just added to our collection</p>
          </div>
          <Link to="/products?sort=newest" className="text-zembile-gray hover:text-gray-600 font-medium">
            View All New →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newArrivals.map((product) => (
            <div key={product.id} className="relative">
              <div className="absolute top-2 left-2 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                NEW
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
            <p className="text-gray-600 mt-1">Most popular products loved by our customers</p>
          </div>
          <Link to="/products?sort=popular" className="text-zembile-gray hover:text-gray-600 font-medium">
            View All Popular →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map((product, index) => (
            <div key={product.id} className="relative">
              {index < 3 && (
                <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  #{index + 1} BESTSELLER
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 mt-1">Handpicked premium Ethiopian goods</p>
          </div>
          <Link to="/products" className="text-zembile-gray hover:text-gray-600 font-medium">
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Zembile for authentic Ethiopian products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4 italic">
              "Amazing quality coffee! The authentic Ethiopian taste brings back memories of home. Fast delivery too!"
            </p>
            <div className="font-semibold text-gray-900">Meron Tadesse</div>
            <div className="text-sm text-gray-500">Addis Ababa</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4 italic">
              "Beautiful handcrafted items that support local artisans. The quality is exceptional and shipping was quick."
            </p>
            <div className="font-semibold text-gray-900">Daniel Bekele</div>
            <div className="text-sm text-gray-500">Bahir Dar</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4 italic">
              "Excellent customer service and authentic spices. Zembile has become my go-to for Ethiopian products."
            </p>
            <div className="font-semibold text-gray-900">Sara Mohammed</div>
            <div className="text-sm text-gray-500">Dire Dawa</div>
          </div>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-zembile-gray mb-2">10K+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-zembile-gray mb-2">500+</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-zembile-gray mb-2">50+</div>
            <div className="text-sm text-gray-600">Partner Artisans</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-zembile-gray mb-2">4.8★</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>
      </section>

      {/* Blog/Content Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Ethiopian Culture & Stories</h2>
            <p className="text-gray-600 mt-1">Discover the rich heritage behind our products</p>
          </div>
          <Link to="/blog" className="text-zembile-gray hover:text-gray-600 font-medium">
            Read More Stories →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&q=80&auto=format&fit=crop"
              alt="Ethiopian Coffee Ceremony"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="text-sm text-gray-500 mb-2">Culture</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The Ethiopian Coffee Ceremony</h3>
              <p className="text-gray-600 text-sm mb-4">
                Discover the ancient tradition of Ethiopian coffee ceremony and its cultural significance...
              </p>
              <Link to="/blog/coffee-ceremony" className="text-zembile-gray hover:text-gray-600 font-medium text-sm">
                Read More →
              </Link>
            </div>
          </article>

          <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80&auto=format&fit=crop"
              alt="Ethiopian Textiles"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="text-sm text-gray-500 mb-2">Crafts</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Traditional Ethiopian Textiles</h3>
              <p className="text-gray-600 text-sm mb-4">
                Learn about the intricate weaving techniques passed down through generations...
              </p>
              <Link to="/blog/textiles" className="text-zembile-gray hover:text-gray-600 font-medium text-sm">
                Read More →
              </Link>
            </div>
          </article>

          <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format&fit=crop"
              alt="Ethiopian Spices"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="text-sm text-gray-500 mb-2">Food</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The Art of Ethiopian Spice Blending</h3>
              <p className="text-gray-600 text-sm mb-4">
                Explore the complex flavors and health benefits of traditional Ethiopian spices...
              </p>
              <Link to="/blog/spices" className="text-zembile-gray hover:text-gray-600 font-medium text-sm">
                Read More →
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Why Choose Zembile */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Zembile?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to bringing you the finest Ethiopian products while supporting local communities and artisans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-zembile-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zembile-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentic Quality</h3>
            <p className="text-gray-600">
              Every product is carefully sourced and verified for authenticity and quality by our local experts.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-zembile-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zembile-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Local Delivery</h3>
            <p className="text-gray-600">
              Quick and reliable delivery across Ethiopia with same-day service available in major cities.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-zembile-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zembile-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Supporting Artisans</h3>
            <p className="text-gray-600">
              Your purchases directly support Ethiopian artisans, farmers, and small businesses across the country.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-zembile-gray text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Get notified about new products, special offers, and Ethiopian cultural events. Join our community of Ethiopian culture enthusiasts.
        </p>
        
        <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-zembile-yellow"
            required
          />
          <button 
            type="submit"
            disabled={isSubscribing}
            className="bg-zembile-yellow text-zembile-gray px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        
        <p className="text-sm text-gray-400 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </section>
    </div>
  )
}
