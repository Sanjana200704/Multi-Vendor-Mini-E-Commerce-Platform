import React, { createContext, useContext, useState, useEffect } from 'react'
import api, { setAuthToken } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      setAuthToken(token)
      loadUser()
    }
  }, [token])

  async function loadUser() {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data)
    } catch (err) {
      console.error('loadUser', err)
      logout()
    }
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    return res.data
  }

  async function register(name, email, password, role='user') {
    const res = await api.post('/auth/register', { name, email, password, role })
    // If server returned a token (user/admin), save it. For vendor, server returns a message.
    if (res.data.token) {
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
    }
    return res.data
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setAuthToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
