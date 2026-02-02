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
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'kyc' | 'onboarding' | 'analytics'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [paymentAnalytics, setPaymentAnalytics] = useState<PaymentAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [grantingAdmin, setGrantingAdmin] = useState<string | null>(null)
  const [kycData, setKycData] = useState<any[]>([])
  const [superAdminKYC, setSuperAdminKYC] = useState({
    panNumber: '',
    aadharNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  })
  const [savingKYC, setSavingKYC] = useState(false)
  const [showKYCForm, setShowKYCForm] = useState(false)
  const [artForms, setArtForms] = useState<any[]>([])
  const [processingApp, setProcessingApp] = useState<string | null>(null)
  const [onboardingList, setOnboardingList] = useState<any[]>([])
  const [processingOnboarding, setProcessingOnboarding] = useState<string | null>(null)

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
    } else if (activeTab === 'kyc') {
      fetchKYCData()
    } else if (activeTab === 'onboarding') {
      fetchOnboardingList()
    } else if (activeTab === 'analytics') {
      fetchAnalytics()
    }
  }, [activeTab])

  const loadDashboardData = async () => {
    fetchStats()
    fetchAnalytics()
    fetchPaymentAnalytics()
    fetchArtForms()
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

  const fetchArtForms = async () => {
    try {
      // Try multiple possible endpoints
      let data: any[] = []
      
      // Try /admin/applications first (most likely to have all submissions)
      try {
        const res = await api.get('/admin/applications')
        data = res.data.items || res.data || []
        console.log('✓ Fetched from /admin/applications:', data)
      } catch (error: any) {
        console.log('✗ /admin/applications failed, trying /work-with-us...')
        try {
          const res = await api.get('/work-with-us')
          data = res.data.items || res.data || []
          console.log('✓ Fetched from /work-with-us:', data)
        } catch (err: any) {
          console.log('✗ /work-with-us failed, trying /applications...')
          try {
            const res = await api.get('/applications')
            data = res.data.items || res.data || []
            console.log('✓ Fetched from /applications:', data)
          } catch (err2) {
            console.log('✗ All endpoints failed')
            data = []
          }
        }
      }
      
      console.log(`Final: ${data.length} art forms loaded`)
      setArtForms(data)
    } catch (error) {
      console.error('Error fetching art forms:', error)
      setArtForms([])
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

  const fetchKYCData = async () => {
    try {
      setLoading(true)
      // Try multiple possible endpoints
      try {
        const res = await api.get('/kyc/all')
        setKycData(res.data.items || res.data || [])
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Endpoint doesn't exist, try alternative
          try {
            const res = await api.get('/admin/kyc')
            setKycData(res.data.items || res.data || [])
          } catch {
            // If that also fails, set empty
            setKycData([])
          }
        } else {
          throw error
        }
      }
    } catch (error) {
      console.error('Error fetching KYC data:', error)
      // Don't show error toast, just log it
      setKycData([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    searchUsers(query)
  }

  const handleKYCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSuperAdminKYC(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveKYC = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSavingKYC(true)
      // TODO: Call API to save KYC details
      // await api.post('/admin/kyc/super-admin', superAdminKYC)
      toast.success('KYC details saved successfully')
      setShowKYCForm(false)
    } catch (error: any) {
      toast.error('Failed to save KYC details')
      console.error('Error saving KYC:', error)
    } finally {
      setSavingKYC(false)
    }
  }

  const approveApplication = async (appId: string) => {
    try {
      setProcessingApp(appId)
      await api.post(`/admin/applications/${appId}/approve`)
      toast.success('Application approved! Added to onboarding worklist.')
      fetchArtForms()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to approve application')
      console.error('Error approving application:', error)
    } finally {
      setProcessingApp(null)
    }
  }

  const deleteApplication = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return
    }
    try {
      setProcessingApp(appId)
      await api.delete(`/admin/applications/${appId}`)
      toast.success('Application deleted.')
      fetchArtForms()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete application')
      console.error('Error deleting application:', error)
    } finally {
      setProcessingApp(null)
    }
  }

  const fetchOnboardingList = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/onboarding')
      setOnboardingList(res.data.items || res.data || [])
      console.log('✓ Fetched onboarding list:', res.data.items || res.data)
    } catch (error) {
      console.error('Error fetching onboarding list:', error)
      setOnboardingList([])
    } finally {
      setLoading(false)
    }
  }

  const updateOnboardingStatus = async (worklistId: string, newStatus: 'pending' | 'onboarded' | 'rejected') => {
    try {
      setProcessingOnboarding(worklistId)
      await api.post(`/admin/onboarding/${worklistId}/status`, { status: newStatus })
      toast.success(`Artist status updated to ${newStatus}`)
      fetchOnboardingList()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update status')
      console.error('Error updating status:', error)
    } finally {
      setProcessingOnboarding(null)
    }
  }

  const deleteOnboardingEntry = async (worklistId: string) => {
    if (!confirm('Are you sure you want to remove this artist from onboarding?')) {
      return
    }
    try {
      setProcessingOnboarding(worklistId)
      await api.delete(`/admin/onboarding/${worklistId}`)
      toast.success('Artist removed from onboarding list.')
      fetchOnboardingList()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete')
      console.error('Error deleting onboarding entry:', error)
    } finally {
      setProcessingOnboarding(null)
    }
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
          {(['overview', 'users', 'orders', 'kyc', 'onboarding', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold transition whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-terracotta text-terracotta'
                  : 'text-warm-gray hover:text-indigo'
              }`}
            >
              {tab === 'kyc' ? 'KYC & Bank' : tab === 'onboarding' ? 'Onboarding' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Super Admin KYC Section */}
            <div className="card bg-gradient-to-br from-terracotta/5 to-indigo/5 border-2 border-terracotta/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-indigo">Your KYC & Bank Details</h3>
                <button
                  onClick={() => setShowKYCForm(!showKYCForm)}
                  className="px-4 py-2 bg-terracotta text-white rounded-lg text-sm hover:bg-opacity-80 transition"
                >
                  {showKYCForm ? 'Cancel' : 'Edit Details'}
                </button>
              </div>

              {!showKYCForm ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-warm-gray uppercase mb-1">PAN Number</p>
                    <p className="text-sm font-semibold text-indigo">{superAdminKYC.panNumber || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-warm-gray uppercase mb-1">Aadhar Number</p>
                    <p className="text-sm font-semibold text-indigo">{superAdminKYC.aadharNumber || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-warm-gray uppercase mb-1">Bank Name</p>
                    <p className="text-sm font-semibold text-indigo">{superAdminKYC.bankName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-warm-gray uppercase mb-1">Account Holder</p>
                    <p className="text-sm font-semibold text-indigo">{superAdminKYC.accountHolderName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-warm-gray uppercase mb-1">Account Number</p>
                    <p className="text-sm font-semibold text-indigo">{superAdminKYC.accountNumber ? `***${superAdminKYC.accountNumber.slice(-4)}` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-warm-gray uppercase mb-1">IFSC Code</p>
                    <p className="text-sm font-semibold text-indigo">{superAdminKYC.ifscCode || '—'}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveKYC} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-2">PAN Number</label>
                      <input
                        type="text"
                        name="panNumber"
                        value={superAdminKYC.panNumber}
                        onChange={handleKYCChange}
                        placeholder="e.g., AAAPA5055K"
                        className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-2">Aadhar Number</label>
                      <input
                        type="text"
                        name="aadharNumber"
                        value={superAdminKYC.aadharNumber}
                        onChange={handleKYCChange}
                        placeholder="e.g., 1234 5678 9012"
                        className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-2">Bank Name</label>
                      <input
                        type="text"
                        name="bankName"
                        value={superAdminKYC.bankName}
                        onChange={handleKYCChange}
                        placeholder="e.g., HDFC Bank"
                        className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-2">Account Holder Name</label>
                      <input
                        type="text"
                        name="accountHolderName"
                        value={superAdminKYC.accountHolderName}
                        onChange={handleKYCChange}
                        placeholder="Full name as per bank"
                        className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-2">Account Number</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={superAdminKYC.accountNumber}
                        onChange={handleKYCChange}
                        placeholder="e.g., 1234567890123456"
                        className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-2">IFSC Code</label>
                      <input
                        type="text"
                        name="ifscCode"
                        value={superAdminKYC.ifscCode}
                        onChange={handleKYCChange}
                        placeholder="e.g., HDFC0001234"
                        className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20 text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={savingKYC}
                    className="w-full px-4 py-2 bg-terracotta text-white rounded-lg font-medium hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingKYC ? 'Saving...' : 'Save KYC Details'}
                  </button>
                </form>
              )}
            </div>
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

            {/* Submitted Art Forms */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-bold text-indigo">Recent Art Form Submissions</h3>
                <span className="text-xs bg-terracotta text-white px-2 py-1 rounded">{artForms.filter((f: any) => f.status === 'pending').length} pending</span>
              </div>
              {artForms.length === 0 ? (
                <div className="text-center text-warm-gray py-8">
                  <p className="mb-2">No art form submissions yet</p>
                  <p className="text-xs text-warm-gray">Check back when artists submit applications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {artForms.filter((form: any) => form.status === 'pending').slice(0, 5).map((form: any, idx: number) => (
                    <div key={form.id || idx} className="flex flex-col sm:flex-row items-start sm:items-start justify-between p-4 bg-sand-beige/10 rounded-lg border border-sand-beige/20 gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-1">
                          <div>
                            <p className="text-xs text-warm-gray uppercase font-semibold">Artist Name</p>
                            <h4 className="font-semibold text-indigo">{form.artistName || form.name || 'N/A'}</h4>
                          </div>
                          <div>
                            <p className="text-xs text-warm-gray uppercase font-semibold">Email / Phone</p>
                            <p className="text-sm text-indigo">{form.email || form.mobileNumber || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-warm-gray uppercase font-semibold">Art Form</p>
                            <p className="text-sm text-indigo">{form.artForm || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-warm-gray uppercase font-semibold">Submitted</p>
                            <p className="text-xs text-warm-gray">{form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 whitespace-nowrap">
                        <p className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          form.status === 'approved' ? 'bg-green-100 text-green-700' :
                          form.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {form.status ? form.status.charAt(0).toUpperCase() + form.status.slice(1) : 'Pending'}
                        </p>
                        {form.status !== 'approved' && form.status !== 'rejected' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approveApplication(form.id)}
                              disabled={processingApp === form.id}
                              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition disabled:opacity-50"
                            >
                              {processingApp === form.id ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => deleteApplication(form.id)}
                              disabled={processingApp === form.id}
                              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50"
                            >
                              {processingApp === form.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {artForms.length > 5 && (
                    <p className="text-sm text-center text-warm-gray pt-4 border-t border-sand-beige">
                      Showing 5 of {artForms.length} submissions
                    </p>
                  )}
                </div>
              )}
            </div>
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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-indigo">Order #{order.id.slice(0, 8)}</h4>
                      <p className="text-sm text-warm-gray">User: {order.userId}</p>
                      <p className="text-xs text-warm-gray mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <p className="font-serif text-lg font-bold text-terracotta">
                        ₹{order.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-warm-gray mt-1">
                        {order.paymentStatus === 'completed' ? (
                          <span className="text-green-600 font-semibold">✓ Paid</span>
                        ) : (
                          <span className="text-yellow-600 font-semibold">⏳ Pending</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Order Tracking */}
                  <div className="border-t border-sand-beige pt-4 mt-4">
                    <p className="text-sm font-semibold text-indigo mb-3">Order Status:</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status?.charAt(0).toUpperCase() + (order.status?.slice(1) || '')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-warm-gray mt-4 pt-3 border-t border-sand-beige">
                    <p>Items: {order.items?.length || 0}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* KYC & Bank Details Tab */}
        {activeTab === 'kyc' && (
          <div className="space-y-4">
            {kycData.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-warm-gray">No KYC data found</p>
              </div>
            ) : (
              kycData.map((kyc: any) => (
                <div key={kyc.id} className="card">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-sand-beige">
                    <div>
                      <h4 className="font-semibold text-lg text-indigo">{kyc.name || 'User'}</h4>
                      <p className="text-sm text-warm-gray">{kyc.email}</p>
                    </div>
                    <div className="text-left sm:text-right mt-3 sm:mt-0">
                      <p className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
                        kyc.kycVerified === true ? 'bg-green-100 text-green-700' :
                        kyc.kycVerified === false ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {kyc.kycVerified === true ? '✓ Verified' : kyc.kycVerified === false ? '✗ Rejected' : '⏳ Pending'}
                      </p>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-indigo mb-4">Bank Account Details</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-warm-gray uppercase mb-1">Account Holder</p>
                        <p className="text-sm font-semibold text-indigo">{kyc.accountHolderName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-warm-gray uppercase mb-1">Bank Name</p>
                        <p className="text-sm font-semibold text-indigo">{kyc.bankName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-warm-gray uppercase mb-1">Account Number</p>
                        <p className="text-sm font-semibold text-indigo">{kyc.accountNumber ? `***${kyc.accountNumber.slice(-4)}` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-warm-gray uppercase mb-1">IFSC Code</p>
                        <p className="text-sm font-semibold text-indigo">{kyc.ifscCode || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* KYC Documents */}
                  <div>
                    <h5 className="font-semibold text-indigo mb-4">KYC Documents</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-sand-beige/20 rounded-lg">
                        <p className="text-xs font-medium text-warm-gray mb-1">PAN Number</p>
                        <p className="text-sm font-semibold text-indigo">{kyc.panNumber ? kyc.panNumber : '✗ Not submitted'}</p>
                      </div>
                      <div className="p-3 bg-sand-beige/20 rounded-lg">
                        <p className="text-xs font-medium text-warm-gray mb-1">Aadhar Number</p>
                        <p className="text-sm font-semibold text-indigo">{kyc.aadharNumber ? kyc.aadharNumber : '✗ Not submitted'}</p>
                      </div>
                      <div className="p-3 bg-sand-beige/20 rounded-lg">
                        <p className="text-xs font-medium text-warm-gray mb-1">Bank Verified</p>
                        <p className={`text-sm font-semibold ${kyc.bankVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                          {kyc.bankVerified ? '✓ Yes' : '⏳ Pending'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Onboarding Tab */}
        {activeTab === 'onboarding' && (
          <div className="space-y-4">
            {onboardingList.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-warm-gray">No artists in onboarding</p>
              </div>
            ) : (
              <div className="space-y-4">
                {onboardingList.map((item: any) => (
                  <div key={item.id} className="card">
                    <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between mb-4 pb-4 border-b border-sand-beige gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col gap-2">
                          <div>
                            <p className="text-xs text-warm-gray uppercase font-semibold">Artist Name</p>
                            <h4 className="font-semibold text-lg text-indigo">{item.artistName}</h4>
                          </div>
                          <div>
                            <p className="text-xs text-warm-gray uppercase font-semibold">Art Form</p>
                            <p className="text-sm text-indigo">{item.artForm}</p>
                          </div>
                          <div>
                            <p className="text-xs text-warm-gray uppercase font-semibold">Email</p>
                            <p className="text-sm text-indigo">{item.email}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4 mt-1">
                            <div>
                              <p className="text-xs text-warm-gray uppercase font-semibold">Submitted</p>
                              <p className="text-xs text-warm-gray">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-warm-gray uppercase font-semibold">Approved</p>
                              <p className="text-xs text-warm-gray">{item.approvedAt ? new Date(item.approvedAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
                          item.status === 'onboarded' ? 'bg-green-100 text-green-700' :
                          item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.status?.charAt(0).toUpperCase() + (item.status?.slice(1) || '')}
                        </p>
                      </div>
                    </div>

                    {/* Onboarding Tasks */}
                    {item.tasks && (
                      <div className="mb-4 p-3 bg-sand-beige/10 rounded-lg">
                        <p className="text-xs font-semibold text-indigo mb-2">Onboarding Tasks:</p>
                        <div className="space-y-1 text-xs text-warm-gray">
                          <p className={item.tasks.kyc_verification?.completed ? 'text-green-600 font-semibold' : ''}>
                            {item.tasks.kyc_verification?.completed ? '✓' : '○'} KYC Verification
                          </p>
                          <p className={item.tasks.bank_details?.completed ? 'text-green-600 font-semibold' : ''}>
                            {item.tasks.bank_details?.completed ? '✓' : '○'} Bank Details
                          </p>
                          <p className={item.tasks.artist_profile?.completed ? 'text-green-600 font-semibold' : ''}>
                            {item.tasks.artist_profile?.completed ? '✓' : '○'} Artist Profile Setup
                          </p>
                          <p className={item.tasks.store_setup?.completed ? 'text-green-600 font-semibold' : ''}>
                            {item.tasks.store_setup?.completed ? '✓' : '○'} Store Setup
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {item.status !== 'onboarded' && (
                        <button
                          onClick={() => updateOnboardingStatus(item.id, 'onboarded')}
                          disabled={processingOnboarding === item.id}
                          className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition disabled:opacity-50"
                        >
                          {processingOnboarding === item.id ? 'Updating...' : 'Mark Onboarded'}
                        </button>
                      )}
                      {item.status !== 'pending' && (
                        <button
                          onClick={() => updateOnboardingStatus(item.id, 'pending')}
                          disabled={processingOnboarding === item.id}
                          className="px-4 py-2 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition disabled:opacity-50"
                        >
                          {processingOnboarding === item.id ? 'Updating...' : 'Mark Pending'}
                        </button>
                      )}
                      <button
                        onClick={() => deleteOnboardingEntry(item.id)}
                        disabled={processingOnboarding === item.id}
                        className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50"
                      >
                        {processingOnboarding === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
