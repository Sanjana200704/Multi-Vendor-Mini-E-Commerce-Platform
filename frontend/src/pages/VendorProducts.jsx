import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import ProductForm from '../components/ProductForm'

export default function VendorProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await api.get('/products')
      const my = res.data.filter(p => p.vendor && p.vendor._id === user?._id)
      setProducts(my)
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete product?')) return
    await api.delete(`/products/${id}`)
    load()
  }

  return (
    <div>
      <h2 className="text-xl font-bold">My Products</h2>
      <div className="mt-4">
        <ProductForm onSaved={load} editing={editing} setEditing={setEditing} />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-gray-600">Rs {p.price}</div>
            <div className="mt-2 flex space-x-2">
              <button onClick={() => setEditing(p)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
