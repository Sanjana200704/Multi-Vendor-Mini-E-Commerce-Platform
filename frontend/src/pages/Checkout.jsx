import React, { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handlePlaceOrder() {
    setLoading(true)
    try {
      const payload = { items: items.map(i => ({ productId: i.product._id, quantity: i.quantity })) }
      await api.post('/orders', payload)
      clearCart()
      navigate('/orders')
    } catch (err) {
      console.error('place order', err)
      alert(err.response?.data?.msg || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">Checkout</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.product._id} className="flex justify-between">
              <div>{i.product.title} x {i.quantity}</div>
              <div>Rs {(i.product.price * i.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 font-bold">Total: Rs {total.toFixed(2)}</div>
        <div className="mt-4">
          <button onClick={handlePlaceOrder} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">{loading ? 'Placing...' : 'Place Order (dummy)'}</button>
        </div>
      </div>
    </div>
  )
}
