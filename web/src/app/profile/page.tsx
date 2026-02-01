'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import { Order, Subscription } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'subscription'>('profile')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (!authLoading && user) {
      fetchUserData()
    }
  }, [user, authLoading])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [ordersRes] = await Promise.all([api.get('/orders')])
      setOrders(ordersRes.data.items || [])
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-warm-gray">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-warm-gray">Please log in</p>
      </div>
    )
  }

  return (
    <div className="bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-bold text-indigo mb-4">My Profile</h1>
          <p className="text-warm-gray">Welcome, {user.name}!</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-sand-beige">
          {['profile', 'orders', 'subscription'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-3 font-medium transition ${
                activeTab === tab
                  ? 'border-b-2 border-terracotta text-terracotta'
                  : 'text-warm-gray hover:text-indigo'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card max-w-2xl">
            <h2 className="font-serif text-2xl font-bold text-indigo mb-6">
              Account Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-warm-gray mb-1">Name</p>
                <p className="font-semibold text-indigo">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-warm-gray mb-1">Email</p>
                <p className="font-semibold text-indigo">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <p className="text-sm text-warm-gray mb-1">Phone</p>
                  <p className="font-semibold text-indigo">{user.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-warm-gray mb-1">Role</p>
                <p className="font-semibold text-indigo capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-warm-gray mb-4">No orders yet</p>
                <a href="/shop" className="text-terracotta font-semibold hover:underline">
                  Start Shopping
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-serif text-lg font-semibold text-indigo">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-warm-gray">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-terracotta">
                        ₹{order.total.toLocaleString()}
                      </span>
                    </div>
                    <a href={`/orders/${order.id}`} className="text-terracotta text-sm hover:underline">
                      View Details →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="card max-w-2xl">
            <h2 className="font-serif text-2xl font-bold text-indigo mb-6">
              Magazine Subscription
            </h2>
            {subscriptions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-warm-gray mb-4">No active subscription</p>
                <a href="/magazine" className="btn-primary">
                  Subscribe Now
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="border-b border-sand-beige pb-4 last:border-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-indigo capitalize">{sub.plan} Plan</p>
                        <p className="text-sm text-warm-gray">
                          Active until {new Date(sub.renewalDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
