import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'

export default function App(){
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
