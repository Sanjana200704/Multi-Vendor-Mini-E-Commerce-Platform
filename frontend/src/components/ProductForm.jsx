import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function ProductForm({ onSaved, editing, setEditing }) {
  const [form, setForm] = useState({ title: '', description: '', price: 0, category: '', stock: 0, imageUrl: '' })

  useEffect(() => {
    if (editing) setForm({
      title: editing.title || '',
      description: editing.description || '',
      price: editing.price || 0,
      category: editing.category || '',
      stock: editing.stock || 0,
      imageUrl: (editing.images && editing.images[0]) || ''
    })
  }, [editing])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      // Basic validation
      if (!form.title || !form.price) return alert('Title and price are required')
      if (Number(form.price) <= 0) return alert('Price must be greater than 0')

      // Build payload and ensure images is an array when provided
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        images: form.imageUrl ? [form.imageUrl] : []
      }

      if (editing) {
        await api.put(`/products/${editing._id}`, payload)
        setEditing(null)
      } else {
        await api.post('/products', payload)
      }
      setForm({ title: '', description: '', price: 0, category: '', stock: 0, imageUrl: '' })
      onSaved && onSaved()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'Failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="grid grid-cols-1 gap-3">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        <div className="grid grid-cols-2 gap-3">
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL (optional)" className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        </div>
        <div className="flex space-x-2">
          <button className="btn-primary">{editing ? 'Update' : 'Add Product'}</button>
          {editing && <button type="button" onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>}
        </div>
      </div>
    </form>
  )
}
