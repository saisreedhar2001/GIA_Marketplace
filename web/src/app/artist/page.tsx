'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Product {
  id: string
  title: string
  price: number
  stock: number
  category: string
  createdAt: string
}

interface Order {
  id: string
  total: number
  paymentStatus: string
  items: { productId: string; quantity: number }[]
  createdAt: string
}

interface Analytics {
  totalProducts: number
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  totalSales: number
  totalItemsSold: number
  averageOrderValue: number
}

export default function ArtistDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin' && user?.role !== 'artist') {
      router.push('/')
      return
    }

    if (authLoading) return

    loadDashboardData()
  }, [user, authLoading])

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchAnalytics()
    } else if (activeTab === 'products') {
      fetchProducts()
    } else if (activeTab === 'orders') {
      fetchOrders()
    }
  }, [activeTab])

  const loadDashboardData = async () => {
    fetchAnalytics()
    fetchProducts()
    fetchOrders()
  }

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await api.get('/artist/analytics')
      setAnalytics(res.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/artist/products')
      setProducts(res.data.items || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get('/artist/orders')
      setOrders(res.data.items || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <p className="text-warm-gray">Loading...</p>
      </div>
    )
  }

  if (user?.role !== 'admin' && user?.role !== 'artist') {
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
        <div className="mb-8 md:mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-indigo mb-2">Artist Dashboard</h1>
            <p className="text-xs sm:text-sm md:text-base text-warm-gray">Manage your products, orders and sales</p>
          </div>
          <Link
            href="/products/new"
            className="w-full sm:w-auto px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-80 transition text-center text-sm sm:text-base"
          >
            Upload Product
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 border-b border-sand-beige overflow-x-auto">
          {(['overview', 'products', 'orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 md:px-4 py-2 md:py-3 text-xs sm:text-sm md:text-base font-semibold transition whitespace-nowrap ${
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
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6 md:space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <StatCard
                label="Total Products"
                value={analytics.totalProducts.toString()}
              />
              <StatCard
                label="Total Orders"
                value={analytics.totalOrders.toString()}
              />
              <StatCard
                label="Completed Orders"
                value={analytics.completedOrders.toString()}
              />
              <StatCard
                label="Pending Orders"
                value={analytics.pendingOrders.toString()}
              />
            </div>

            {/* Summary Card */}
            <div className="card">
              <h3 className="font-serif text-lg md:text-xl font-bold text-indigo mb-4 md:mb-6">Sales Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div className="border-l-4 border-terracotta pl-3 md:pl-4">
                  <p className="text-warm-gray text-xs md:text-sm mb-2">Total Revenue</p>
                  <p className="font-serif text-2xl md:text-3xl font-bold text-terracotta break-words">
                    ₹{analytics.totalSales.toLocaleString()}
                  </p>
                </div>
                <div className="border-l-4 border-green-600 pl-3 md:pl-4">
                  <p className="text-warm-gray text-xs md:text-sm mb-2">Orders Paid</p>
                  <p className="font-serif text-2xl md:text-3xl font-bold text-green-600">
                    {analytics.completedOrders}
                  </p>
                </div>
                <div className="border-l-4 border-yellow-600 pl-3 md:pl-4">
                  <p className="text-warm-gray text-xs md:text-sm mb-2">Pending Orders</p>
                  <p className="font-serif text-2xl md:text-3xl font-bold text-yellow-600">
                    {analytics.pendingOrders}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-3 md:space-y-4">
            {products.length === 0 ? (
              <div className="card text-center py-8 md:py-12">
                <p className="text-warm-gray text-sm md:text-base mb-4">No products yet</p>
                <Link
                  href="/products/new"
                  className="inline-block px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-80 transition text-sm"
                >
                  Upload Your First Product
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {products.map((product) => (
                  <div key={product.id} className="card hover:shadow-lg transition">
                    <div className="mb-3 md:mb-4">
                      <div className="w-full h-24 md:h-32 bg-sand-beige rounded-lg flex items-center justify-center">
                        <span className="text-warm-gray text-xs md:text-sm">Image</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm md:text-base text-indigo mb-2 line-clamp-2">{product.title}</h4>
                    <p className="text-warm-gray text-xs md:text-sm mb-2">{product.category}</p>
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <p className="font-serif text-base md:text-lg font-bold text-terracotta">
                        ₹{product.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-warm-gray">Stock: {product.stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="flex-1 px-2 md:px-3 py-1 md:py-2 bg-blue-100 text-blue-700 rounded text-xs md:text-sm hover:bg-blue-200 transition text-center"
                      >
                        Edit
                      </Link>
                      <button className="flex-1 px-2 md:px-3 py-1 md:py-2 bg-red-100 text-red-700 rounded text-xs md:text-sm hover:bg-red-200 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-3 md:space-y-4">
            {orders.length === 0 ? (
              <div className="card text-center py-8 md:py-12">
                <p className="text-warm-gray text-sm md:text-base">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="card">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-3">
                    <div>
                      <h4 className="font-semibold text-sm md:text-base text-indigo">Order #{order.id.slice(0, 8)}</h4>
                      <p className="text-xs text-warm-gray mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-serif text-xl md:text-2xl font-bold text-terracotta">
                        ₹{order.total.toLocaleString()}
                      </p>
                      <p className={`text-xs md:text-sm font-semibold mt-1 ${
                        order.paymentStatus === 'completed'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}>
                        {order.paymentStatus === 'completed' ? '✓ Paid' : 'Pending'}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-sand-beige pt-3 md:pt-4">
                    <p className="text-xs md:text-sm text-warm-gray">
                      Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                  </div>
                </div>
              ))
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
}: {
  label: string
  value: string
}) {
  return (
    <div className="card min-h-[120px] md:min-h-[140px] flex flex-col justify-center text-center p-4 md:p-6">
      <p className="text-xs md:text-sm text-warm-gray opacity-80 mb-2">{label}</p>
      <p className="font-serif text-xl md:text-3xl font-bold text-terracotta break-words">{value}</p>
    </div>
  )
}
