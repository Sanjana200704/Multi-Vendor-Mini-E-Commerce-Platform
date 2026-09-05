import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  function addToCart(product, quantity = 1) {
    setItems(prev => {
      const id = product._id || product.id
      const found = prev.find(i => (i.product._id || i.product.id) === id)
      if (found) {
        return prev.map(i => ((i.product._id || i.product.id) === id) ? { ...i, quantity: i.quantity + quantity } : i)
      }
      return [...prev, { product, quantity }]
    })
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => (i.product._id || i.product.id) !== productId))
  }

  function updateQuantity(productId, quantity) {
    setItems(prev => {
      const id = productId
      if (quantity <= 0) {
        return prev.filter(i => (i.product._id || i.product.id) !== id)
      }
      return prev.map(i => ((i.product._id || i.product.id) === id ? { ...i, quantity } : i))
    })
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((s, it) => s + it.product.price * it.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
