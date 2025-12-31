import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({product}){
  const { addItem } = useCart()

  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`}> 
        <div className="h-56 bg-gray-50 flex items-center justify-center">
          <img src={product.image || `https://source.unsplash.com/collection/190727/800x600?sig=${product.id}`} alt={product.name} className="object-cover h-full w-full" />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xl font-bold">{product.price} ETB</div>
          <div className="flex items-center gap-2">
            <button onClick={() => addItem(product, 1)} className="bg-zembile-gray text-white px-3 py-2 rounded-full font-semibold">Add</button>
            <Link to={`/checkout?product=${product.id}`} className="bg-zembile-yellow text-zembile-gray px-4 py-2 rounded-full font-semibold">Buy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
