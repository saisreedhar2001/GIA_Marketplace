import { create } from 'zustand'
import { persist, PersistStorage } from 'zustand/middleware'
import { User } from '@/types'

interface AuthStore {
  user: User | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  hydrate: () => void
}

// Custom storage that works with Next.js
const storage: PersistStorage<AuthStore> = {
  getItem: (name: string) => {
    try {
      const item = typeof window !== 'undefined' ? localStorage.getItem(name) : null
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  setItem: (name: string, value: AuthStore) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(name, JSON.stringify(value))
      }
    } catch {
      // Ignore errors
    }
  },
  removeItem: (name: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(name)
      }
    } catch {
      // Ignore errors
    }
  },
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      error: null,
      setUser: (user) => set({ user, error: null }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      logout: () => {
        set({ user: null })
        localStorage.removeItem('authToken')
      },
      hydrate: () => {
        // This will be called to restore state from localStorage
        set({ loading: false })
      },
    }),
    {
      name: 'auth-store',
      storage: storage,
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
)
