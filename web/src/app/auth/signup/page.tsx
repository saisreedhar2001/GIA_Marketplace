'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'

export default function SignUpPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)

      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Create user profile in backend (optional)
      try {
        await api.post('/auth/signup', {
          name: name,
          email: email,
          password: password,
        })
      } catch (error) {
        console.warn('Backend signup failed, but Firebase user created:', error)
      }

      // Get token
      const token = await userCredential.user.getIdToken()
      localStorage.setItem('authToken', token)

      // Set user in store
      setUser({
        id: userCredential.user.uid,
        email: email,
        name: name,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      toast.success('Account created successfully!')
      router.push('/')
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)

      // Get token
      const token = await userCredential.user.getIdToken()
      localStorage.setItem('authToken', token)

      // Create user profile in backend
      try {
        await api.post('/auth/signup', {
          name: userCredential.user.displayName || 'User',
          email: userCredential.user.email || '',
          password: '',
        })
      } catch (error) {
        console.warn('Backend signup failed:', error)
      }

      // Set user in store
      setUser({
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: userCredential.user.displayName || 'User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      toast.success('Account created successfully!')
      router.push('/')
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Google sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-indigo mb-2">Create Account</h1>
            <p className="text-warm-gray">Join the GIA community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-sand-beige"></div>
            <span className="text-xs text-warm-gray">OR</span>
            <div className="flex-1 h-px bg-sand-beige"></div>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full px-4 py-2 border border-sand-beige rounded-lg text-indigo hover:bg-sand-beige transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-warm-gray">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-terracotta font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
