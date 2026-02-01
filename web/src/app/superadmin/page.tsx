'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

interface Analytics {
  totalUsers: number
  adminCount: number
  artistCount: number
  regularUsers: number
  ordersByUsers: number
}

interface PaymentAnalytics {
  completedPayments: number
  completedRevenue: number
  pendingPayments: number
  pendingRevenue: number
  failedPayments: number
  totalTransactions: number
  successRate: number
}

interface DashboardStats {
  totalUsers: number
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  totalRevenue: number
  totalProducts: number
  averageOrderValue: number
}

export default function SuperAdminDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'analytics'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [paymentAnalytics, setPaymentAnalytics] = useState<PaymentAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [grantingAdmin, setGrantingAdmin] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && user?.email !== 'cnssreedhar2001@gmail.com') {
      router.push('/')
      return
    }

    if (authLoading) return

    loadDashboardData()
  }, [user, authLoading])

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats()
    } else if (activeTab === 'users') {
      searchUsers()
    } else if (activeTab === 'orders') {
      fetchAllOrders()
    } else if (activeTab === 'analytics') {
      fetchAnalytics()
    }
  }, [activeTab])

  const loadDashboardData = async () => {
    fetchStats()
    fetchAnalytics()
    fetchPaymentAnalytics()
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/analytics/overview')
      setStats(res.data)
    } catch (error: any) {
      console.error('Error fetching stats:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      })
      toast.error(`Failed to load stats: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics/users')
      setAnalytics(res.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const fetchPaymentAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics/payments')
      setPaymentAnalytics(res.data)
    } catch (error) {
      console.error('Error fetching payment analytics:', error)
    }
  }

  const searchUsers = async (query: string = '') => {
    try {
      setLoading(true)
      const res = await api.get('/admin/users/search', { params: { query } })
      setUsers(res.data.items || [])
    } catch (error) {
      console.error('Error searching users:', error)
      toast.error('Failed to search users')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/orders/all')
      setOrders(res.data.items || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    searchUsers(query)
  }

  const grantAdminAccess = async (userId: string) => {
    try {
      setGrantingAdmin(userId)
      await api.post(`/admin/users/${userId}/grant-admin`)
      toast.success('Admin access granted')
      searchUsers(searchQuery)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to grant admin access')
    } finally {
      setGrantingAdmin(null)
    }
  }

  const revokeAdminAccess = async (userId: string) => {
    try {
      setGrantingAdmin(userId)
      await api.post(`/admin/users/${userId}/revoke-admin`)
      toast.success('Admin access revoked')
      searchUsers(searchQuery)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to revoke admin access')
    } finally {
      setGrantingAdmin(null)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <p className="text-warm-gray">Loading...</p>
      </div>
    )
  }

  if (user?.email !== 'cnssreedhar2001@gmail.com') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <p className="text-indigo font-semibold">Access Denied</p>
      </div>
    )
  }

  return (
    <div className="bg-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-bold text-indigo mb-2">Super Admin Dashboard</h1>
          <p className="text-warm-gray">Manage users, analytics, orders and payments</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-sand-beige overflow-x-auto">
          {(['overview', 'users', 'orders', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold transition ${
                activeTab === tab
                  ? 'border-b-2 border-terracotta text-terracotta'
                  : 'text-warm-gray hover:text-indigo'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Users"
                value={stats.totalUsers.toLocaleString()}
                color="bg-blue-100 text-blue-900"
              />
              <StatCard
                label="Total Orders"
                value={stats.totalOrders.toLocaleString()}
                color="bg-green-100 text-green-900"
              />
              <StatCard
                label="Completed Orders"
                value={stats.completedOrders.toLocaleString()}
                color="bg-emerald-100 text-emerald-900"
              />
              <StatCard
                label="Pending Orders"
                value={stats.pendingOrders.toLocaleString()}
                color="bg-yellow-100 text-yellow-900"
              />
              <StatCard
                label="Total Revenue"
                value={`₹${stats.totalRevenue.toLocaleString()}`}
                color="bg-terracotta text-white"
              />
              <StatCard
                label="Total Products"
                value={stats.totalProducts.toLocaleString()}
                color="bg-purple-100 text-purple-900"
              />
              <StatCard
                label="Avg Order Value"
                value={`₹${stats.averageOrderValue.toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                })}`}
                color="bg-indigo text-white"
              />
            </div>

            {/* Payment Analytics */}
            {paymentAnalytics && (
              <div className="card">
                <h3 className="font-serif text-xl font-bold text-indigo mb-6">Payment Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-warm-gray text-sm mb-2">Completed Payments</p>
                    <p className="font-serif text-2xl font-bold text-terracotta">
                      {paymentAnalytics.completedPayments}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      ₹{paymentAnalytics.completedRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-warm-gray text-sm mb-2">Pending Payments</p>
                    <p className="font-serif text-2xl font-bold text-yellow-600">
                      {paymentAnalytics.pendingPayments}
                    </p>
                    <p className="text-sm text-yellow-600 mt-1">
                      ₹{paymentAnalytics.pendingRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-warm-gray text-sm mb-2">Success Rate</p>
                    <p className="font-serif text-2xl font-bold text-green-600">
                      {paymentAnalytics.successRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* User Analytics */}
            {analytics && (
              <div className="card">
                <h3 className="font-serif text-xl font-bold text-indigo mb-6">User Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-warm-gray text-sm mb-2">Admin Users</p>
                    <p className="font-serif text-2xl font-bold text-indigo">{analytics.adminCount}</p>
                  </div>
                  <div>
                    <p className="text-warm-gray text-sm mb-2">Artists</p>
                    <p className="font-serif text-2xl font-bold text-purple-600">
                      {analytics.artistCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-warm-gray text-sm mb-2">Regular Users</p>
                    <p className="font-serif text-2xl font-bold text-blue-600">
                      {analytics.regularUsers}
                    </p>
                  </div>
                  <div>
                    <p className="text-warm-gray text-sm mb-2">Users with Orders</p>
                    <p className="font-serif text-2xl font-bold text-green-600">
                      {analytics.ordersByUsers}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="card">
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
              />
            </div>

            {/* Users List */}
            <div className="space-y-3">
              {users.length === 0 ? (
                <div className="card text-center py-8">
                  <p className="text-warm-gray">No users found</p>
                </div>
              ) : (
                users.map((u) => (
                  <div key={u.id} className="card flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-indigo">{u.name}</h4>
                      <p className="text-sm text-warm-gray">{u.email}</p>
                      <p className="text-xs text-warm-gray mt-1">
                        Role: <span className="font-semibold text-terracotta">{u.role}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {u.role === 'admin' ? (
                        <button
                          onClick={() => revokeAdminAccess(u.id)}
                          disabled={grantingAdmin === u.id}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                        >
                          {grantingAdmin === u.id ? 'Revoking...' : 'Revoke Admin'}
                        </button>
                      ) : (
                        <button
                          onClick={() => grantAdminAccess(u.id)}
                          disabled={grantingAdmin === u.id}
                          className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-80 transition disabled:opacity-50"
                        >
                          {grantingAdmin === u.id ? 'Granting...' : 'Grant Admin'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-warm-gray">No orders found</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-indigo">Order #{order.id.slice(0, 8)}</h4>
                      <p className="text-sm text-warm-gray">User: {order.userId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-lg font-bold text-terracotta">
                        ₹{order.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-warm-gray">
                        {order.paymentStatus === 'completed' ? (
                          <span className="text-green-600 font-semibold">Paid</span>
                        ) : (
                          <span className="text-yellow-600 font-semibold">Pending</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-warm-gray">
                    <p>Items: {order.items?.length || 0}</p>
                    <p>Status: {order.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {paymentAnalytics && (
              <div className="card">
                <h3 className="font-serif text-xl font-bold text-indigo mb-6">Payment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-terracotta pl-4">
                    <p className="text-warm-gray text-sm mb-1">Total Transactions</p>
                    <p className="font-serif text-3xl font-bold text-indigo">
                      {paymentAnalytics.totalTransactions}
                    </p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-4">
                    <p className="text-warm-gray text-sm mb-1">Total Revenue</p>
                    <p className="font-serif text-3xl font-bold text-green-600">
                      ₹{paymentAnalytics.completedRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {analytics && (
              <div className="card">
                <h3 className="font-serif text-xl font-bold text-indigo mb-6">User Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-sand-beige">
                    <span className="text-warm-gray">Total Users</span>
                    <span className="font-semibold text-indigo">{analytics.totalUsers}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-sand-beige">
                    <span className="text-warm-gray">Admin Users</span>
                    <span className="font-semibold text-indigo">{analytics.adminCount}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-sand-beige">
                    <span className="text-warm-gray">Artist Users</span>
                    <span className="font-semibold text-purple-600">{analytics.artistCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-warm-gray">Regular Users</span>
                    <span className="font-semibold text-blue-600">{analytics.regularUsers}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className={`card ${color} text-center p-6`}>
      <p className="text-sm opacity-80 mb-2">{label}</p>
      <p className="font-serif text-3xl font-bold">{value}</p>
    </div>
  )
}
