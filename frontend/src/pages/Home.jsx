import React from 'react'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'

export default function Home(){
  return (
    <div>
      <section className="bg-gradient-to-r from-white to-zembile-yellow/10 rounded-lg p-8 mb-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight">Zembile — Premium Ethiopian Marketplace</h1>
            <p className="mt-4 text-gray-700">Discover premium coffee, artisan crafts and fresh foods sourced from local Ethiopian producers.</p>
            <div className="mt-6">
              <a href="/products" className="bg-zembile-gray text-white px-5 py-3 rounded-md font-semibold">Browse Products</a>
              <a href="/checkout" className="ml-4 bg-zembile-yellow text-zembile-gray px-5 py-3 rounded-md font-semibold">Quick Checkout</a>
            </div>
          </div>

          <div className="hidden md:block">
            <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80&auto=format&fit=crop" alt="Ethiopian goods" className="rounded-lg shadow-lg object-cover w-full h-64" />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <p className="text-gray-500">Premium Ethiopian goods</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
