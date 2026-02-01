'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Order {
  id: string
  userId: string
  total: number
  paymentStatus: string
  status: string
  items: { productId: string; quantity: number }[]
  createdAt: string
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/')
      return
    }

    if (authLoading) return

    fetchOrders()
  }, [user, authLoading])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get('/orders')
      setOrders(res.data.items || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'completed') return order.paymentStatus === 'completed'
    if (filterStatus === 'pending') return order.paymentStatus === 'pending'
    return true
  })

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
          <h1 className="font-serif text-4xl font-bold text-indigo mb-2">Manage Orders</h1>
          <p className="text-warm-gray">View and manage all customer orders</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'all'
                ? 'bg-terracotta text-white'
                : 'bg-sand-beige text-indigo hover:bg-terracotta hover:text-white'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-sand-beige text-indigo hover:bg-green-600 hover:text-white'
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-sand-beige text-indigo hover:bg-yellow-600 hover:text-white'
            }`}
          >
            Pending
          </button>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-warm-gray">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-indigo">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-xs text-warm-gray mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl font-bold text-terracotta">
                      ₹{order.total.toLocaleString()}
                    </p>
                    <p className={`text-sm font-semibold mt-1 ${
                      order.paymentStatus === 'completed'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}>
                      {order.paymentStatus === 'completed' ? '✓ Paid' : '⏱ Pending'}
                    </p>
                  </div>
                </div>
                <div className="border-t border-sand-beige pt-4 text-sm text-warm-gray">
                  <p>Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  <p>Status: {order.status}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <p className="text-warm-gray text-sm mb-2">Total Orders</p>
            <p className="font-serif text-3xl font-bold text-terracotta">{orders.length}</p>
          </div>
          <div className="card text-center">
            <p className="text-warm-gray text-sm mb-2">Paid Orders</p>
            <p className="font-serif text-3xl font-bold text-green-600">
              {orders.filter((o) => o.paymentStatus === 'completed').length}
            </p>
          </div>
          <div className="card text-center">
            <p className="text-warm-gray text-sm mb-2">Pending Orders</p>
            <p className="font-serif text-3xl font-bold text-yellow-600">
              {orders.filter((o) => o.paymentStatus === 'pending').length}
            </p>
          </div>
          <div className="card text-center">
            <p className="text-warm-gray text-sm mb-2">Total Revenue</p>
            <p className="font-serif text-3xl font-bold text-terracotta">
              ₹{orders
                .filter((o) => o.paymentStatus === 'completed')
                .reduce((sum, o) => sum + o.total, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
