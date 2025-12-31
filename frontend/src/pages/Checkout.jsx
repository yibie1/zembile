import React, {useState, useEffect} from 'react'
import { useCart } from '../context/CartContext'
import { useLocation } from 'react-router-dom'

export default function Checkout(){
  const { items, totalPrice, clear } = useCart()
  const [method, setMethod] = useState('telebirr')
  const [amount, setAmount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    // Pre-fill amount from cart or query param
    const params = new URLSearchParams(location.search)
    const productId = params.get('product')
    if(productId){
      const p = items.find(i => String(i.id) === String(productId))
      setAmount(p ? p.price * p.qty : totalPrice)
    }else{
      setAmount(totalPrice)
    }
  }, [items, totalPrice, location.search])

  const handlePay = (e) => {
    e.preventDefault()
    // TODO: Integrate with backend API to create payment/order
    alert('Proceed to pay with: ' + method + ' — Amount: ' + amount + ' ETB')
    // For now, clear cart after mock payment
    clear()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-semibold">Order summary</h3>
        <div className="mt-2 text-sm text-gray-600">
          {items.length === 0 ? <div>No items in cart. You can still pay an amount.</div> : (
            <ul className="space-y-2">
              {items.map(it => (
                <li key={it.id} className="flex items-center justify-between">
                  <div>{it.name} x {it.qty}</div>
                  <div className="font-semibold">{it.price * it.qty} ETB</div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 font-bold">Total: {totalPrice} ETB</div>
        </div>
      </div>

      <form onSubmit={handlePay} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select value={method} onChange={e => setMethod(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="telebirr">Telebirr</option>
            <option value="cbe_birr">CBE Birr</option>
            <option value="amole">Amole</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (ETB)</label>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value||0))} className="mt-1 block w-full rounded-md border-gray-300" />
        </div>

        <div>
          <button className="bg-zembile-yellow text-zembile-gray px-4 py-2 rounded-md font-semibold">Pay Now</button>
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-500">
        <p>After completing transfer, go to Upload Proof to submit receipt.</p>
      </div>
    </div>
  )
}
