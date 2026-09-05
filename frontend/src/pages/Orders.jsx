import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await api.get('/orders')
      setOrders(res.data)
    } catch (err) {
      console.error('load orders', err)
      alert(err.response?.data?.msg || 'Failed to load orders')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold">Orders</h2>
      <div className="mt-4 space-y-4">
        {orders.map(o => (
          <div key={o._id} className="card-hover card">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">Order</div>
                <div className="font-semibold break-words">{o._id}</div>
              </div>
              <div className="text-right">
                <div className={`badge ${o.status==='pending' ? 'bg-yellow-100 text-yellow-800' : ''}`}>{o.status}</div>
                <div className="text-sm text-gray-500 mt-1">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-sm text-gray-600">User: {o.user?.name || o.user}</div>
              <div className="mt-2 space-y-2">
                {o.items.map(it => (
                  <div key={it._id} className="flex justify-between">
                    <div className="text-sm">{it.product?.title || it.product} x {it.quantity}</div>
                    <div className="text-sm"> Rs {(it.price * it.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 font-bold">Total: Rs {o.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
