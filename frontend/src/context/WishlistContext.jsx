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

  const addItem = (product) => {
    setItems(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        toast.error('Item already in wishlist')
        return prev
      }
      
      const newItems = [...prev, { ...product, addedAt: new Date().toISOString() }]
      toast.success('Added to wishlist', {
        icon: '❤️',
        duration: 2000,
      })
      return newItems
    })
  }

  const removeItem = (productId) => {
    setItems(prev => {
      const newItems = prev.filter(p => p.id !== productId)
      toast.success('Removed from wishlist', {
        icon: '💔',
        duration: 2000,
      })
      return newItems
    })
  }

  const isInWishlist = (productId) => {
    return items.some(p => p.id === productId)
  }

  const toggleItem = (product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
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