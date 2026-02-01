'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-indigo text-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-0.5 mb-4">
              <span className="font-serif text-xl font-bold text-terracotta">G</span>
              <span className="font-serif text-xl text-sand-beige">reat</span>
              <span className="font-serif text-xl font-bold text-terracotta">I</span>
              <span className="font-serif text-xl text-sand-beige">ndia</span>
              <span className="font-serif text-xl font-bold text-terracotta">A</span>
              <span className="font-serif text-xl text-sand-beige">rts</span>
            </div>
            <p className="text-sand-beige text-sm">
              Celebrating Indian heritage, handmade artistry, and storytelling through authentic art and crafts.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-sand-beige hover:text-terracotta transition">
                  All Items
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sand-beige hover:text-terracotta transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-sand-beige hover:text-terracotta transition">
                  Artists
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/artroom" className="text-sand-beige hover:text-terracotta transition">
                  Art Room
                </Link>
              </li>
              <li>
                <Link href="/magazine" className="text-sand-beige hover:text-terracotta transition">
                  Magazine
                </Link>
              </li>
              <li>
                <Link href="/work-with-us" className="text-sand-beige hover:text-terracotta transition">
                  Work With Us
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-sand-beige hover:text-terracotta transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sand-beige hover:text-terracotta transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sand-beige hover:text-terracotta transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-warm-gray pt-8 text-center text-sm text-sand-beige">
          <p>&copy; {currentYear} Great India Arts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
