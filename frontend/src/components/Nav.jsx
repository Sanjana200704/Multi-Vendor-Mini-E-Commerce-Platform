import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Nav() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-extrabold">MVE</div>
          <div className="hidden md:block text-sm opacity-90">Multi-Vendor Marketplace</div>
        </div>
        <div className="space-x-3 flex items-center">
          <Link to="/" className="text-white hover:opacity-90">Home</Link>
          {/* Products link removed - products are shown on Home */}
          <Link to="/cart" className="relative inline-flex items-center text-white hover:opacity-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" /></svg>
            <span className="hidden sm:inline">Cart</span>
            <span className="ml-2 inline-flex items-center justify-center bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5">{items.length}</span>
          </Link>
          <Link to="/orders" className="text-white hover:opacity-90">Orders</Link>
          {user && user.role === 'vendor' && <Link to="/vendor/dashboard" className="text-white hover:opacity-90">Vendor</Link>}
          {user && user.role === 'admin' && <Link to="/admin" className="text-white hover:opacity-90">Admin</Link>}
          {!user && <Link to="/auth" className="text-white hover:opacity-90">Login</Link>}
          {user && <div className="px-3 py-1 bg-white bg-opacity-10 rounded">{user.name}</div>}
          {user && <button onClick={logout} className="ml-2 btn-secondary text-sm">Logout</button>}
        </div>
      </div>
    </nav>
  )
}
