import React, { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'zembile_wishlist_v1'

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e)
    }
  }, [items])

  // Normalize id: support both _id (MongoDB) and id (legacy)
  const getId = (product) => product._id || product.id

  const addItem = (product) => {
    const pid = getId(product)
    setItems(prev => {
      const exists = prev.find(p => (p._id || p.id) === pid)
      if (exists) { toast.error('Item already in wishlist'); return prev }
      toast.success('Added to wishlist', { icon: '❤️', duration: 2000 })
      return [...prev, { ...product, id: pid, _id: pid, addedAt: new Date().toISOString() }]
    })
  }

  const removeItem = (productId) => {
    setItems(prev => {
      toast.success('Removed from wishlist', { icon: '💔', duration: 2000 })
      return prev.filter(p => (p._id || p.id) !== productId)
    })
  }

  const isInWishlist = (productId) => items.some(p => (p._id || p.id) === productId)

  const toggleItem = (product) => {
    const pid = getId(product)
    if (isInWishlist(pid)) removeItem(pid)
    else addItem(product)
  }

  const clear = () => {
    setItems([])
    toast.success('Wishlist cleared')
  }

  const totalCount = items.length

  return (
    <WishlistContext.Provider value={{
      items,
      addItem,
      removeItem,
      isInWishlist,
      toggleItem,
      clear,
      totalCount
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}