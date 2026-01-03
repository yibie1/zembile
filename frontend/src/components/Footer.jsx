import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-zembile-gray text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.svg" alt="Zembile" className="w-12 h-12 filter brightness-0 invert" />
              <div>
                <div className="font-bold text-xl">Zembile</div>
                <div className="text-sm text-gray-300">Ethiopian Marketplace</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Connecting you with authentic Ethiopian products, supporting local artisans and communities across Ethiopia. Quality guaranteed, culture celebrated.
            </p>
            
            {/* Social Media Links */}
            <div className="flex flex-wrap gap-3">
              {/* X (Twitter) */}
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" title="Follow us on X">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* Facebook */}
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" title="Follow us on Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* Telegram */}
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" title="Join us on Telegram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              
              {/* YouTube */}
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-red-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" title="Subscribe to our YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              
              {/* TikTok */}
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" title="Follow us on TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" title="Follow us on Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link to="/products" className="hover:text-zembile-yellow transition-colors">All Products</Link></li>
              <li><Link to="/products?category=coffee" className="hover:text-zembile-yellow transition-colors">Coffee & Beverages</Link></li>
              <li><Link to="/products?category=food" className="hover:text-zembile-yellow transition-colors">Food & Spices</Link></li>
              <li><Link to="/products?category=home" className="hover:text-zembile-yellow transition-colors">Home & Living</Link></li>
              <li><Link to="/products?category=fashion" className="hover:text-zembile-yellow transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=crafts" className="hover:text-zembile-yellow transition-colors">Arts & Crafts</Link></li>
              <li><Link to="/products?filter=discounted" className="hover:text-zembile-yellow transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link to="/about" className="hover:text-zembile-yellow transition-colors">About Zembile</Link></li>
              <li><Link to="/careers" className="hover:text-zembile-yellow transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-zembile-yellow transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-zembile-yellow transition-colors">FAQ</Link></li>
              <li><a href="#" className="hover:text-zembile-yellow transition-colors">Press & Media</a></li>
              <li><a href="#" className="hover:text-zembile-yellow transition-colors">Investor Relations</a></li>
              <li><a href="#" className="hover:text-zembile-yellow transition-colors">Sustainability</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Support</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link to="/shipping" className="hover:text-zembile-yellow transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-zembile-yellow transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/payment-proof" className="hover:text-zembile-yellow transition-colors">Payment Proof Upload</Link></li>
              <li><Link to="/terms" className="hover:text-zembile-yellow transition-colors">Terms of Service</Link></li>
              <li><a href="#" className="hover:text-zembile-yellow transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-zembile-yellow transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-zembile-yellow transition-colors">Size Guide</a></li>
            </ul>

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="font-medium text-white mb-3">Get in Touch</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+251-11-123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>hello@zembile.et</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Addis Ababa, Ethiopia<br />Bole Sub-City</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Certifications */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-4 text-lg">Accepted Payment Methods</h4>
              <div className="flex flex-wrap items-center gap-4">
                {/* Chapa */}
                <div className="bg-white rounded-lg p-3 flex items-center justify-center min-w-[80px] h-12 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-blue-600 font-bold text-sm">CHAPA</div>
                </div>
                
                {/* Telebirr */}
                <div className="bg-white rounded-lg p-3 flex items-center justify-center min-w-[80px] h-12 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-orange-600 font-bold text-sm">telebirr</div>
                </div>
                
                {/* CBE Birr */}
                <div className="bg-white rounded-lg p-3 flex items-center justify-center min-w-[80px] h-12 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-green-700 font-bold text-xs">CBE BIRR</div>
                </div>
                
                {/* M-Birr */}
                <div className="bg-white rounded-lg p-3 flex items-center justify-center min-w-[80px] h-12 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-purple-600 font-bold text-sm">M-BIRR</div>
                </div>
                
                {/* Bank Transfer */}
                <div className="bg-white rounded-lg p-3 flex items-center justify-center min-w-[80px] h-12 shadow-sm hover:shadow-md transition-shadow">
                  <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                
                {/* Cash on Delivery */}
                <div className="bg-white rounded-lg p-3 flex items-center justify-center min-w-[80px] h-12 shadow-sm hover:shadow-md transition-shadow">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-400">
                Secure payments powered by Ethiopian financial institutions
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <h4 className="font-semibold text-white mb-4 text-lg">Security & Trust</h4>
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  SSL Secured
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Licensed Business
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Trusted by 10K+
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 bg-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-300 gap-4">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex items-center gap-2">
                &copy; {currentYear} Zembile Marketplace. All rights reserved.
              </div>
              <div className="hidden md:block text-gray-600">|</div>
              <div className="flex items-center gap-2">
                Made with <span className="text-red-400 animate-pulse">❤️</span> in Ethiopia
                <img src="https://flagcdn.com/w20/et.png" alt="Ethiopia" className="w-5 h-3 ml-1" />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <Link to="/terms" className="hover:text-zembile-yellow transition-colors duration-200">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-zembile-yellow transition-colors duration-200">Privacy Policy</Link>
              <Link to="/cookies" className="hover:text-zembile-yellow transition-colors duration-200">Cookie Policy</Link>
              <Link to="/accessibility" className="hover:text-zembile-yellow transition-colors duration-200">Accessibility</Link>
            </div>
          </div>
          
          {/* Additional Footer Info */}
          <div className="mt-4 pt-4 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-400">
              Supporting Ethiopian artisans and communities • Authentic products • Worldwide shipping
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
