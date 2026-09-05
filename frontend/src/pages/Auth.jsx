import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Auth() {
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      // Basic validation
      if (!form.email || !form.password || (isRegister && !form.name)) return setError('Please fill all fields')
      setError(null)
      setSuccess(null)
      if (isRegister) {
        const res = await register(form.name, form.email, form.password, form.role)
        if (res.msg) {
          // Vendor flow: server returns a message
          setSuccess(res.msg)
          return
        }
      } else {
        await login(form.email, form.password)
      }
      window.location.href = '/'
    } catch (err) {
      setError(err.response?.data?.msg || 'Authentication failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold">{isRegister ? 'Register' : 'Login'}</h2>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {isRegister && (
          <>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" />
            <div className="mt-2">
              <div className="text-sm font-medium mb-1">Account Type</div>
              <label className="mr-4"><input type="radio" name="role" value="user" checked={form.role==='user'} onChange={handleChange} /> <span className="ml-1">User</span></label>
              <label><input type="radio" name="role" value="vendor" checked={form.role==='vendor'} onChange={handleChange} /> <span className="ml-1">Vendor</span></label>
            </div>
          </>
        )}
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full border p-2 rounded" />
        <div className="flex items-center justify-between">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">{isRegister ? 'Register' : 'Login'}</button>
          <button type="button" onClick={() => { setIsRegister(!isRegister); setError(null); setSuccess(null); }} className="text-sm text-gray-600">{isRegister ? 'Have an account? Login' : 'Need an account? Register'}</button>
        </div>
        {success && <div className="text-green-600">{success}</div>}
      </form>
    </div>
  )
}
