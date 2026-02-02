'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'

export default function AdminApplicationsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/')
      return
    }

    // Only super admin can access applications
    if (!authLoading && user?.email !== 'cnssreedhar2001@gmail.com') {
      router.push('/admin')
    }
  }, [user, authLoading, router])

  return (
    <div className="bg-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl font-bold text-indigo mb-2">Artist Applications</h1>
        <p className="text-warm-gray mb-8">Review and manage artist onboarding applications</p>

        <div className="card text-center py-12">
          <p className="text-warm-gray mb-4">Coming soon - Artist application review system</p>
          <a href="/admin" className="text-terracotta font-semibold hover:underline">
            Back to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
