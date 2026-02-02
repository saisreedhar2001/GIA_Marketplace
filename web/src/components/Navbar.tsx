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
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="hidden sm:flex items-baseline gap-0.5">
              <span className="font-serif text-lg lg:text-xl font-bold text-terracotta">G</span>
              <span className="font-serif text-lg lg:text-xl text-indigo">reat</span>
              <span className="font-serif text-lg lg:text-xl font-bold text-terracotta">I</span>
              <span className="font-serif text-lg lg:text-xl text-indigo">ndia</span>
              <span className="font-serif text-lg lg:text-xl font-bold text-terracotta">A</span>
              <span className="font-serif text-lg lg:text-xl text-indigo">rts</span>
            </div>
            <span className="sm:hidden font-serif text-xl lg:text-2xl font-bold text-terracotta">
              GIA
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center flex-1 gap-5">
            <Link href="/shop" className="text-indigo hover:text-terracotta transition whitespace-nowrap text-sm lg:text-base py-4">
              Shop
            </Link>
            <Link href="/artroom" className="text-indigo hover:text-terracotta transition whitespace-nowrap text-sm lg:text-base py-4">
              Art Room
            </Link>
            <Link href="/magazine" className="text-indigo hover:text-terracotta transition whitespace-nowrap text-sm lg:text-base py-4">
              Magazine
            </Link>
            <Link href="/categories" className="text-indigo hover:text-terracotta transition whitespace-nowrap text-sm lg:text-base py-4">
              Categories
            </Link>
            {(user?.role === 'admin' || user?.role === 'artist') && (
              <Link href="/artist" className="text-indigo hover:text-terracotta transition whitespace-nowrap text-sm lg:text-base py-4">
                Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-indigo hover:text-terracotta transition whitespace-nowrap text-sm lg:text-base py-4">
                Manage
              </Link>
            )}
            {user?.email === 'cnssreedhar2001@gmail.com' && (
              <Link href="/superadmin" className="text-indigo hover:text-terracotta transition font-bold whitespace-nowrap text-sm lg:text-base py-4">
                Super Admin
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Cart Icon */}
            <Link href="/cart" className="relative hover:bg-sand-beige rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 py-4">
              <svg className="w-6 h-6 text-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                <Link href="/profile" className="px-3 rounded text-indigo hover:bg-sand-beige transition text-sm whitespace-nowrap py-4">
                  Profile
                </Link>
                <button
                  onClick={() => logout()}
                  className="px-3 rounded text-terracotta border border-terracotta hover:bg-terracotta hover:text-white transition text-sm whitespace-nowrap py-4"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                <Link
                  href="/auth/login"
                  className="px-3 rounded text-terracotta border border-terracotta hover:bg-terracotta hover:text-white transition text-sm whitespace-nowrap py-4"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-3 rounded bg-terracotta text-white hover:bg-opacity-80 transition text-sm whitespace-nowrap py-4"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-indigo hover:bg-sand-beige rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-sand-beige space-y-2">
            <Link href="/shop" className="block py-3 px-2 text-indigo hover:text-terracotta hover:bg-sand-beige rounded transition min-h-[44px] flex items-center">
              Shop
            </Link>
            <Link href="/artroom" className="block py-3 px-2 text-indigo hover:text-terracotta hover:bg-sand-beige rounded transition min-h-[44px] flex items-center">
              Art Room
            </Link>
            <Link href="/magazine" className="block py-3 px-2 text-indigo hover:text-terracotta hover:bg-sand-beige rounded transition min-h-[44px] flex items-center">
              Magazine
            </Link>
            <Link href="/categories" className="block py-3 px-2 text-indigo hover:text-terracotta hover:bg-sand-beige rounded transition min-h-[44px] flex items-center">
              Categories
            </Link>
            {(user?.role === 'admin' || user?.role === 'artist') && (
              <Link href="/artist" className="block py-3 px-2 text-indigo hover:text-terracotta hover:bg-sand-beige rounded transition min-h-[44px] flex items-center font-semibold">
                Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" className="block py-3 px-2 text-indigo hover:text-terracotta hover:bg-sand-beige rounded transition min-h-[44px] flex items-center font-semibold">
                Manage
              </Link>
            )}
            {user?.email === 'cnssreedhar2001@gmail.com' && (
              <Link href="/superadmin" className="block py-3 px-2 text-indigo hover:text-terracotta hover:bg-sand-beige rounded transition min-h-[44px] flex items-center font-bold">
                Super Admin
              </Link>
            )}
            {user && (
              <>
                <Link href="/profile" className="block py-3 px-2 text-indigo hover:text-terracotta hover:bg-sand-beige rounded transition min-h-[44px] flex items-center">
                  Profile
                </Link>
                <button
                  onClick={() => logout()}
                  className="w-full py-3 px-2 rounded-lg text-terracotta border border-terracotta hover:bg-terracotta hover:text-white transition min-h-[44px]"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <>
                <Link
                  href="/auth/login"
                  className="block py-3 px-2 rounded-lg text-terracotta border border-terracotta hover:bg-terracotta hover:text-white transition min-h-[44px] text-center"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block py-3 px-2 rounded-lg bg-terracotta text-white hover:bg-opacity-80 transition min-h-[44px] text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
