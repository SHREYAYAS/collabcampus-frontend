import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

// Simple auth guard using token presence in localStorage
export default function ProtectedRoute() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return token ? <Outlet /> : <Navigate to="/login" replace />
}
