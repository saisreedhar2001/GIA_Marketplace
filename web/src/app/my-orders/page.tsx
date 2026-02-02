'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  paymentStatus: 'pending' | 'completed' | 'failed'
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  createdAt: string
  updatedAt: string
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to view your orders')
      return
    }

    if (!authLoading) {
      fetchOrders()
    }
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

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-warm-gray">Loading your orders...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-off-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="font-serif text-4xl font-bold text-indigo mb-4">My Orders</h1>
          <p className="text-warm-gray mb-6">Please login to view your orders</p>
          <Link href="/auth/login" className="btn-primary inline-block">
            Login Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-indigo mb-2">My Orders</h1>
          <p className="text-warm-gray">Track and manage your purchases</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-sand-beige pb-4">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? 'bg-terracotta text-white'
                  : 'bg-sand-beige text-indigo hover:bg-terracotta hover:text-white'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && ` (${orders.filter(o => o.status === status).length})`}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-warm-gray mb-6">
              {filterStatus === 'all' 
                ? "You haven't placed any orders yet" 
                : `No ${filterStatus} orders`}
            </p>
            <Link href="/shop" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div key={order.id} className="card">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-sand-beige">
                  <div>
                    <p className="text-warm-gray text-sm">Order ID</p>
                    <p className="font-serif text-lg font-semibold text-indigo">
                      {order.id.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="font-semibold text-indigo mb-4">Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start bg-sand-beige/20 p-4 rounded-lg">
                        <div className="flex-grow">
                          <p className="font-medium text-indigo">{item.productName}</p>
                          <p className="text-sm text-warm-gray">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-terracotta">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-warm-gray">
                            ₹{item.price.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-sand-beige">
                  <div>
                    <p className="text-warm-gray text-sm mb-1">Shipping Address</p>
                    <p className="text-sm text-indigo">
                      {order.shippingAddress.street},<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                      {order.shippingAddress.zipCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-warm-gray text-sm mb-1">Order Date</p>
                    <p className="text-sm text-indigo">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-warm-gray text-sm mb-1">Payment Status</p>
                    <p className={`text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </p>
                  </div>
                </div>

                {/* Order Total */}
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-warm-gray text-sm mb-1">Total Amount</p>
                    <p className="font-serif text-3xl font-bold text-terracotta">
                      ₹{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
