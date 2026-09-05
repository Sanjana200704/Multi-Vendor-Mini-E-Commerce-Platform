import React, { useEffect, useState } from 'react'
import api from '../services/api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/products')
        setProducts(res.data)
      } catch (err) {
        console.error('load products', err)
      }
    }
    load()
  }, [])

  return (
    <div>
      <div className="hero p-6 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Discover great products from trusted vendors</h1>
          <p className="mt-2 text-muted">Quality products, multiple vendors, one checkout.</p>
          <div className="mt-4 flex items-center space-x-3">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products (quick demo)" className="border p-2 rounded w-72" />
            <button onClick={() => { /* no-op: filtering is live */ }} className="btn-primary">Search</button>
          </div>
        </div>
        <div className="hidden md:block">
          <img src="/hero-shopping.svg" alt="shopping" style={{width:260}} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products
          .filter(p => {
            if (!query) return true
            const q = query.toLowerCase()
            return (p.title && p.title.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q))
          })
          .map(p => (
            <div key={p._id} className="card-hover">
              <ProductCard product={p} />
            </div>
          ))}
      </div>
    </div>
  )
}
