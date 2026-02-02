'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/')
      return
    }

    // Only super admin can access users page
    if (!authLoading && user?.email !== 'cnssreedhar2001@gmail.com') {
      router.push('/admin')
      return
    }

    if (authLoading) return

    // Note: This is a placeholder. In production, you'd need a backend endpoint to get all users
    // For now, we'll show a message that this requires super admin access
    setLoading(false)
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <p className="text-warm-gray">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-indigo mb-2">Manage Users</h1>
          <p className="text-warm-gray">View and manage user accounts</p>
        </div>

        {/* Info */}
        <div className="card bg-blue-50 border-2 border-blue-200 p-6">
          <h3 className="font-semibold text-indigo mb-2">User Management</h3>
          <p className="text-warm-gray mb-4">
            To search users and grant admin access, use the <strong>Super Admin Dashboard</strong>.
          </p>
          <a
            href="/superadmin"
            className="inline-block px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-80 transition"
          >
            Go to Super Admin Dashboard
          </a>
        </div>

        {/* User Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="text-warm-gray text-sm mb-2">Total Users</p>
            <p className="font-serif text-3xl font-bold text-terracotta">-</p>
            <p className="text-xs text-warm-gray mt-2">Use Super Admin to view</p>
          </div>
          <div className="card text-center">
            <p className="text-warm-gray text-sm mb-2">Admins</p>
            <p className="font-serif text-3xl font-bold text-indigo">-</p>
            <p className="text-xs text-warm-gray mt-2">Use Super Admin to grant</p>
          </div>
          <div className="card text-center">
            <p className="text-warm-gray text-sm mb-2">Artists</p>
            <p className="font-serif text-3xl font-bold text-purple-600">-</p>
            <p className="text-xs text-warm-gray mt-2">Approved users</p>
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-indigo mb-6">Admin Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-indigo mb-2">📦 Manage Products</h3>
              <p className="text-warm-gray text-sm mb-4">View all products, edit inventory, and manage listings.</p>
              <a href="/admin/products" className="text-terracotta font-semibold text-sm hover:underline">
                Go to Products →
              </a>
            </div>

            <div className="card">
              <h3 className="font-semibold text-indigo mb-2">📋 View Orders</h3>
              <p className="text-warm-gray text-sm mb-4">See all customer orders, payment status, and tracking.</p>
              <a href="/admin/orders" className="text-terracotta font-semibold text-sm hover:underline">
                Go to Orders →
              </a>
            </div>

            <div className="card">
              <h3 className="font-semibold text-indigo mb-2">👥 Grant Admin Access</h3>
              <p className="text-warm-gray text-sm mb-4">Search users and grant admin roles (Super Admin only).</p>
              <a href="/superadmin" className="text-terracotta font-semibold text-sm hover:underline">
                Go to Super Admin →
              </a>
            </div>

            <div className="card">
              <h3 className="font-semibold text-indigo mb-2">📊 View Analytics</h3>
              <p className="text-warm-gray text-sm mb-4">Check dashboard stats and payment analytics.</p>
              <a href="/admin" className="text-terracotta font-semibold text-sm hover:underline">
                Go to Dashboard →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
