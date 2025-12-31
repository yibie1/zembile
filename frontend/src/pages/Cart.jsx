import React from 'react'
import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart(){
  const { items, updateQty, removeItem, clear, totalCount, totalPrice } = useCart()
  const navigate = useNavigate()

  if(items.length === 0) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Your cart is empty</h2>
      <p className="mt-4">Browse products to add items.</p>
      <div className="mt-6"><Link to="/products" className="bg-zembile-gray text-white px-4 py-2 rounded-md">Browse</Link></div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">{item.price} ETB</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="number" value={item.qty} min={1} onChange={e => updateQty(item.id, Math.max(1, Number(e.target.value||1)))} className="w-16 border rounded-md px-2 py-1" />
              <div className="font-semibold">{item.price * item.qty} ETB</div>
              <button onClick={() => removeItem(item.id)} className="text-sm text-red-600">Remove</button>
            </div>
          </div>
        ))}

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Items: {totalCount}</div>
            <div className="text-lg font-bold">Total: {totalPrice} ETB</div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => clear()} className="px-4 py-2 rounded-md border">Clear</button>
            <button onClick={() => navigate('/checkout')} className="px-4 py-2 rounded-md bg-zembile-yellow text-zembile-gray font-semibold">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  )
}
