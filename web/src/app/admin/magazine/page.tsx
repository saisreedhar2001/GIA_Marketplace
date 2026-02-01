'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'

export default function AdminMagazinePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()

  useEffect(() => {
    if (!authLoading && user?.email !== 'cnssreedhar2001@gmail.com') {
      router.push('/')
    }
  }, [user, authLoading, router])

  return (
    <div className="bg-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl font-bold text-indigo mb-2">Manage Magazine</h1>
        <p className="text-warm-gray mb-8">Create and publish magazine issues (Super User Only)</p>

        <div className="card text-center py-12">
          <p className="text-warm-gray mb-4">Coming soon - Magazine management</p>
          <a href="/superadmin" className="text-terracotta font-semibold hover:underline">
            Go to Super Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
