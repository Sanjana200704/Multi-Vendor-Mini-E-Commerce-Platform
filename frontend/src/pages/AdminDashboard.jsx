import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [uRes, vRes, pRes, oRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/vendors'),
        api.get('/products'),
        api.get('/orders')
      ])
      setUsers(uRes.data)
      setVendors(vRes.data)
      setProducts(pRes.data)
      setOrders(oRes.data)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'Failed to load admin data')
    } finally { setLoading(false) }
  }

  async function approveVendor(id) {
    try { await api.patch(`/admin/vendors/${id}/approve`); load() }
    catch (err) { alert(err.response?.data?.msg || 'Failed') }
  }

  async function blockVendor(id) {
    try { await api.patch(`/admin/vendors/${id}/block`); load() }
    catch (err) { alert(err.response?.data?.msg || 'Failed') }
  }

  async function deleteProduct(id) {
    if (!confirm('Delete product?')) return
    try { await api.delete(`/products/${id}`); load() }
    catch (err) { alert(err.response?.data?.msg || 'Failed') }
  }

  if (!user || user.role !== 'admin') return <div className="text-red-600">Access denied</div>

  return (
    <div>
      <h2 className="text-xl font-bold">Admin Dashboard</h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{users.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500">Total Vendors</div>
          <div className="text-2xl font-bold">{vendors.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500">Total Products</div>
          <div className="text-2xl font-bold">{products.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className="text-2xl font-bold">{orders.length}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold">All Users</h3>
          <div className="mt-2 space-y-2">
            {users.map(u => (
              <div key={u._id} className="bg-white p-3 rounded shadow flex justify-between">
                <div>
                  <div className="font-semibold">{u.name}</div>
                  <div className="text-sm text-gray-600">{u.email} — {u.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Vendors</h3>
          <div className="mt-2 space-y-2">
            {vendors.map(v => (
              <div key={v._id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-semibold">{v.name}</div>
                  <div className="text-sm text-gray-600">{v.email} — Approved: {v.isApproved ? 'Yes' : 'No'}</div>
                </div>
                <div className="space-x-2">
                  {!v.isApproved && <button onClick={() => approveVendor(v._id)} className="px-2 py-1 bg-green-600 text-white rounded">Approve</button>}
                  {v.isApproved && <button onClick={() => blockVendor(v._id)} className="px-2 py-1 bg-red-600 text-white rounded">Block</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Products</h3>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p._id} className="card flex justify-between items-center">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-600">Rs {p.price} — {p.vendor?.name}</div>
              </div>
              <div className="space-x-2">
                <button onClick={() => deleteProduct(p._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Orders</h3>
        <div className="mt-2 space-y-2">
          {orders.map(o => (
            <div key={o._id} className="card">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">Order: {o._id}</div>
                  <div className="text-sm text-gray-600">{o.user?.name} — {new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">{o.status}</div>
              </div>
              <div className="mt-2">
                {o.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>{it.product?.title || it.product} x {it.quantity}</div>
                    <div>Rs {Number(it.price * it.quantity).toLocaleString()}</div>
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
