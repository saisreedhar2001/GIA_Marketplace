'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/')
      return
    }

    if (authLoading) return

    fetchStats()
  }, [user, authLoading])

  const fetchStats = async () => {
    try {
      setLoading(true)
      // Fetch dashboard stats
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products'),
      ])

      setStats({
        totalOrders: ordersRes.data.items?.length || 0,
        totalRevenue: ordersRes.data.items?.reduce((sum: number, o: any) => sum + o.total, 0) || 0,
        totalProducts: productsRes.data.items?.length || 0,
        totalUsers: 0, // Would fetch from backend
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load dashboard')
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

  const isSuperAdmin = user?.email === 'cnssreedhar2001@gmail.com'

  return (
    <div className="bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl font-bold text-indigo mb-12">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div className="card min-h-[140px] flex flex-col justify-center">
            <p className="text-warm-gray text-xs sm:text-sm mb-2">Total Orders</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-terracotta">
              {stats.totalOrders}
            </p>
          </div>

          <div className="card min-h-[140px] flex flex-col justify-center">
            <p className="text-warm-gray text-xs sm:text-sm mb-2">Total Revenue</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-terracotta">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="card min-h-[140px] flex flex-col justify-center">
            <p className="text-warm-gray text-xs sm:text-sm mb-2">Products Listed</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-terracotta">
              {stats.totalProducts}
            </p>
          </div>

          <div className="card min-h-[140px] flex flex-col justify-center">
            <p className="text-warm-gray text-xs sm:text-sm mb-2">Total Users</p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-terracotta">
              {stats.totalUsers}
            </p>
          </div>
        </div>

        {/* Manage Section */}
        <div className="mb-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-indigo mb-4 sm:mb-6">Manage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AdminCard
              title="Products"
              description="Manage products and inventory"
              href="/admin/products"
            />
            <AdminCard
              title="Orders"
              description="View and process orders"
              href="/admin/orders"
            />
            <AdminCard
              title="KYC & Bank Details"
              description="Manage verification and payments"
              href="/admin/kyc"
            />
            <AdminCard
              title="Blog Posts"
              description="Manage Art Room content"
              href="/admin/blog"
            />

            {/* Super Admin Only */}
            {isSuperAdmin && (
              <>
                <AdminCard
                  title="Users"
                  description="Manage user accounts"
                  href="/admin/users"
                />
                <AdminCard
                  title="Artist Applications"
                  description="Review artist onboarding"
                  href="/admin/applications"
                />
                <AdminCard
                  title="Magazine"
                  description="Create and publish issues"
                  href="/admin/magazine"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a href={href}>
      <div className="card cursor-pointer hover-lift min-h-[140px] flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-base sm:text-lg font-semibold text-indigo mb-2">
            {title}
          </h3>
          <p className="text-warm-gray text-xs sm:text-sm">
            {description}
          </p>
        </div>
        <div className="mt-4 text-terracotta text-xs sm:text-sm font-semibold">
          Manage →
        </div>
      </div>
    </a>
  )
}
