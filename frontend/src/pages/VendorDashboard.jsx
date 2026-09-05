import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function VendorDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await api.get('/orders/vendor/stats')
        setStats(res.data)
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load vendor stats')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div>Loading vendor statistics...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vendor Dashboard</h2>
        <div className="space-x-2">
          <Link to="/vendor/products" className="px-3 py-1 btn-secondary">Products</Link>
          <Link to="/orders" className="px-3 py-1 btn-secondary">Orders</Link>
        </div>
      </div>

      {stats && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="text-sm text-gray-500">Total Products</div>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </div>
          <div className="stat-card">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <div className="text-sm text-gray-500">Total Sales</div>
            <div className="text-2xl font-bold">₹ {Number(stats.totalRevenue).toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="text-sm text-gray-500">Pending Orders</div>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <div className="mt-3 space-y-2">
          {stats && stats.recentOrders.length === 0 && <div className="text-gray-600">No recent orders</div>}
          {stats && stats.recentOrders.map(o => (
            <div key={o.id} className="card">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">Order: {o.id}</div>
                  <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold capitalize">{o.status}</div>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                {o.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div className="text-sm text-gray-700">{it.product} x {it.quantity}</div>
                    <div className="text-sm">₹ {Number(it.amount).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
