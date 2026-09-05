import React from 'react'
import { useCart } from '../contexts/CartContext'

export default function ProductCard({ product }) {
  const { items, addToCart, updateQuantity } = useCart()

  const id = product._id || product.id
  const cartItem = items.find(i => (i.product._id || i.product.id) === id)
  const qty = cartItem ? cartItem.quantity : 0

  function handleIncrease() { addToCart(product, 1) }
  function handleDecrease() { updateQuantity(id, qty - 1) }

  return (
    <div className="card hover:shadow-lg transition-shadow flex flex-col">
      <div className="w-full h-44 mb-3 overflow-hidden rounded-md flex items-center justify-center bg-gray-50">
        <img
          src={product.images?.[0] || product.image || product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg leading-tight">{product.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-3">{product.description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xl font-bold">₹ {product.price}</div>
        <div className="flex items-center space-x-2">
          {qty > 0 ? (
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button onClick={handleDecrease} className="px-3 py-1 bg-white text-gray-700">-</button>
              <div className="px-4">{qty}</div>
              <button onClick={handleIncrease} className="px-3 py-1 bg-white text-gray-700">+</button>
            </div>
          ) : (
            <button onClick={handleIncrease} className="btn-primary">Add to cart</button>
          )}
        </div>
      </div>
    </div>
  )
}
