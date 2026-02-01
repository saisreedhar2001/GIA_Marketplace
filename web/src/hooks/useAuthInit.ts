import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import api from '@/lib/api'

export function useAuthInit() {
  const setUser = useAuthStore((state) => state.setUser)
  const setLoading = useAuthStore((state) => state.setLoading)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is logged in
          const token = await firebaseUser.getIdToken()
          localStorage.setItem('authToken', token)

          // Fetch user details from backend
          try {
            const res = await api.get('/auth/user', {
              headers: { Authorization: `Bearer ${token}` },
            })
            setUser(res.data)
          } catch (error) {
            console.error('Failed to fetch user details:', error)
            // Still set user with basic Firebase data
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              role: 'user',
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          }
        } else {
          // User is logged out
          logout()
        }
      } catch (error) {
        console.error('Auth error:', error)
        logout()
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [setUser, setLoading, logout])
}
