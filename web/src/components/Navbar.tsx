'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { items } = useCartStore()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-off-white shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="hidden sm:flex items-baseline gap-0.5">
              <span className="font-serif text-xl font-bold text-terracotta">G</span>
              <span className="font-serif text-xl text-indigo">reat</span>
              <span className="font-serif text-xl font-bold text-terracotta">I</span>
              <span className="font-serif text-xl text-indigo">ndia</span>
              <span className="font-serif text-xl font-bold text-terracotta">A</span>
              <span className="font-serif text-xl text-indigo">rts</span>
            </div>
            <span className="sm:hidden font-serif text-2xl font-bold text-terracotta">
              GIA
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-indigo hover:text-terracotta transition">
              Shop
            </Link>
            <Link href="/artroom" className="text-indigo hover:text-terracotta transition">
              Art Room
            </Link>
            <Link href="/magazine" className="text-indigo hover:text-terracotta transition">
              Magazine
            </Link>
            <Link href="/categories" className="text-indigo hover:text-terracotta transition">
              Categories
            </Link>
            {(user?.role === 'admin' || user?.role === 'artist') && (
              <Link href="/artist" className="text-indigo hover:text-terracotta transition">
                Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-indigo hover:text-terracotta transition">
                Manage
              </Link>
            )}
            {user?.email === 'cnssreedhar2001@gmail.com' && (
              <Link href="/superadmin" className="text-indigo hover:text-terracotta transition font-bold">
                Super Admin
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <svg className="w-6 h-6 text-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-terracotta text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="text-indigo hover:text-terracotta">
                  {user.name}
                </Link>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 rounded-lg text-terracotta border border-terracotta hover:bg-terracotta hover:text-white transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg text-terracotta border border-terracotta hover:bg-terracotta hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 rounded-lg bg-terracotta text-white hover:bg-opacity-80 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-indigo"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-sand-beige">
            <Link href="/shop" className="block py-2 text-indigo hover:text-terracotta">
              Shop
            </Link>
            <Link href="/artroom" className="block py-2 text-indigo hover:text-terracotta">
              Art Room
            </Link>
            <Link href="/magazine" className="block py-2 text-indigo hover:text-terracotta">
              Magazine
            </Link>
            <Link href="/categories" className="block py-2 text-indigo hover:text-terracotta">
              Categories
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
