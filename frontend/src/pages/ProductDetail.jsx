import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { products } from '../data/products'

export default function ProductDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find(p => String(p.id) === String(id))
  if(!product) return <div>Product not found</div>

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <img src={product.image || `https://source.unsplash.com/collection/190727/1200x900?sig=${product.id}`} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-4 text-gray-600">{product.description}</p>
        <div className="mt-6 text-2xl font-bold">{product.price} ETB</div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={() => navigate(`/checkout?product=${product.id}`)} className="bg-zembile-yellow text-zembile-gray px-5 py-3 rounded-full font-semibold">Buy Now</button>
          <button className="px-5 py-3 rounded-full border" onClick={() => alert('Added to wishlist (placeholder)')}>Wishlist</button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Shipping and returns: Local delivery available. // TODO: add shipping integration</p>
        </div>
      </div>
    </div>
  )
}
