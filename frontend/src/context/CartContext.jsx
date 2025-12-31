import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'zembile_cart_v1'

export function CartProvider({children}){
  const [items, setItems] = useState(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    }catch(e){ return [] }
  })

  useEffect(() => {
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }catch(e){}
  }, [items])

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const found = prev.find(p => p.id === product.id)
      if(found){
        return prev.map(p => p.id === product.id ? {...p, qty: p.qty + qty} : p)
      }
      return [...prev, {...product, qty}]
    })
  }

  const removeItem = (id) => setItems(prev => prev.filter(p=>p.id!==id))
  const updateQty = (id, qty) => setItems(prev => prev.map(p => p.id===id ? {...p, qty} : p))
  const clear = () => setItems([])

  const totalCount = items.reduce((s,i)=>s+i.qty,0)
  const totalPrice = items.reduce((s,i)=>s + (i.price * i.qty),0)

  return (
    <CartContext.Provider value={{items, addItem, removeItem, updateQty, clear, totalCount, totalPrice}}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(){
  const ctx = useContext(CartContext)
  if(!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

// TODO: add server-side cart sync for logged-in users
