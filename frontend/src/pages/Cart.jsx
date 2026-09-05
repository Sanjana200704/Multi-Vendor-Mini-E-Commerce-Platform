import React from 'react'
import { useCart } from '../contexts/CartContext'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total } = useCart()

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">Your Cart</h2>
      {items.length === 0 ? (
        <div className="mt-4">Cart is empty. <Link to="/">Browse products</Link></div>
      ) : (
        <div className="mt-4 space-y-4">
          {items.map(i => {
            const id = i.product._id || i.product.id
            return (
              <div key={id} className="card card-hover flex items-center justify-between">
                <div>
                  <div className="font-semibold">{i.product.title}</div>
                  <div className="text-sm text-gray-600">Rs {i.product.price} each</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQuantity(id, i.quantity - 1)} className="px-3 py-1 border rounded">-</button>
                  <div className="px-3">{i.quantity}</div>
                  <button onClick={() => updateQuantity(id, i.quantity + 1)} className="px-3 py-1 border rounded">+</button>
                  <div className="font-bold">Rs {(i.product.price * i.quantity).toFixed(2)}</div>
                  <button onClick={() => removeFromCart(id)} className="px-3 py-1 text-red-600">Remove</button>
                </div>
              </div>
            )
          })}
          <div className="text-right font-bold">Total: Rs {total.toFixed(2)}</div>
          <div className="text-right"><Link to="/checkout" className="btn-primary">Proceed to Checkout</Link></div>
        </div>
      )}
    </div>
  )
}
