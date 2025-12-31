import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="bg-zembile-gray text-white border-t">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.svg" alt="Zembile" className="w-10 h-10" />
            <div>
              <div className="font-bold text-lg">Zembile</div>
              <div className="text-sm text-gray-200">Premium Ethiopian Marketplace</div>
            </div>
          </div>
          <p className="text-sm text-gray-200">Curated products from Ethiopian artisans and producers. Fast local delivery and trusted payment options.</p>
        </div>

        <div>
          <div className="font-semibold mb-3">Shop</div>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><Link to="/products" className="hover:underline">All Products</Link></li>
            <li><Link to="/products?category=coffee" className="hover:underline">Coffee</Link></li>
            <li><Link to="/products?category=food" className="hover:underline">Food</Link></li>
            <li><Link to="/products?category=home" className="hover:underline">Home</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/careers" className="hover:underline">Careers</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">Support</div>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><Link to="/shipping" className="hover:underline">Shipping</Link></li>
            <li><Link to="/returns" className="hover:underline">Returns</Link></li>
            <li><Link to="/payment-proof" className="hover:underline">Upload Payment Proof</Link></li>
            <li><Link to="/terms" className="hover:underline">Terms</Link></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-zembile-gray/70">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-300">
          <div>&copy; {new Date().getFullYear()} Zembile. All rights reserved.</div>
          <div className="mt-3 md:mt-0">Made with ❤️ in Ethiopia</div>
        </div>
      </div>
    </footer>
  )
}
