import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Header(){
  const { totalCount } = useCart()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="Zembile" className="w-10 h-10" />
            <span className="font-extrabold text-lg text-zembile-gray tracking-tight">Zembile</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm text-gray-700">
            <Link to="/products" className="hover:text-zembile-gray">Products</Link>
            <Link to="/about" className="hover:text-zembile-gray">About</Link>
            <Link to="/faq" className="hover:text-zembile-gray">FAQ</Link>
            <Link to="/contact" className="hover:text-zembile-gray">Contact</Link>
          </nav>
        </div>

        <div className="flex-1 hidden md:flex items-center justify-center">
          <div className="w-full max-w-xl">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </span>
              <input className="placeholder:italic placeholder:text-gray-400 block bg-white w-full border border-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-zembile-yellow" placeholder="Search products, e.g. coffee" type="text" name="search" />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative inline-flex items-center px-3 py-2 rounded-full bg-zembile-yellow text-zembile-gray font-semibold">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="20" r="1" fill="#2D2D2D"/>
              <circle cx="18" cy="20" r="1" fill="#2D2D2D"/>
            </svg>
            Cart
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">{totalCount}</span>
            )}
          </Link>

          <Link to="/account" className="hidden md:inline-flex items-center gap-2 text-sm text-gray-700">
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Account</span>
          </Link>

          <button className="md:hidden p-2 bg-gray-100 rounded-md">Menu</button>
        </div>
      </div>
    </header>
  )
}
