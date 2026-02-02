'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/api'
import { Product } from '@/types'

export default function ShopPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])
  const [filtersOpen, setFiltersOpen] = useState(false)

  const categories = [
    'Handcrafted Decor',
    'Traditional Paintings',
    'Tribal Art',
    'Modern Indian Art',
    'Sustainable Crafts',
    'Jewelry & Accessories'
  ]

  useEffect(() => {
    const categoryFromParams = searchParams.get('category') || ''
    setSelectedCategory(categoryFromParams)
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      
      try {
        const res = await api.get(`/products?${params.toString()}`)
        setProducts(res.data.items || [])
      } catch (error) {
        console.warn('Could not fetch products:', error)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  )

  return (
    <div className="bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-indigo mb-3 md:mb-4">Shop</h1>
          <p className="text-warm-gray text-base sm:text-lg">
            Discover authentic Indian art and handmade crafts
          </p>
        </div>

        {/* Mobile Filters - Dropdown */}
        <div className="lg:hidden mb-8">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full btn-primary flex items-center justify-between"
          >
            <span>Filters</span>
            <svg
              className={`w-5 h-5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {filtersOpen && (
            <div className="card mt-4">
              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-semibold text-indigo mb-4">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('')
                      setFiltersOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-3 rounded transition min-h-[44px] flex items-center ${
                      selectedCategory === ''
                        ? 'bg-terracotta text-white'
                        : 'bg-sand-beige text-indigo hover:bg-terracotta hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat)
                        setFiltersOpen(false)
                      }}
                      className={`block w-full text-left px-4 py-3 rounded transition min-h-[44px] flex items-center ${
                        selectedCategory === cat
                          ? 'bg-terracotta text-white'
                          : 'bg-sand-beige text-indigo hover:bg-terracotta hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-indigo mb-4">Price Range</h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-warm-gray">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Filters Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="card sticky top-20">
              <h3 className="font-serif text-lg font-semibold text-indigo mb-6">
                Filters
              </h3>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-semibold text-indigo mb-4">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`block w-full text-left px-3 py-2 rounded transition ${
                      selectedCategory === ''
                        ? 'bg-terracotta text-white'
                        : 'text-indigo hover:bg-sand-beige'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-3 py-2 rounded transition ${
                        selectedCategory === cat
                          ? 'bg-terracotta text-white'
                          : 'text-indigo hover:bg-sand-beige'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-indigo mb-4">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-warm-gray">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-warm-gray">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-warm-gray">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/shop/${product.id}`}>
                    <div className="card overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                      <div className="relative h-48 sm:h-56 md:h-64 bg-sand-beige rounded-lg overflow-hidden mb-4 flex-shrink-0">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-110 transition duration-300"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="flex-grow flex flex-col">
                        <h3 className="font-serif text-base sm:text-lg font-semibold text-indigo mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-warm-gray text-xs sm:text-sm mb-4 line-clamp-2 flex-grow">
                          {product.description}
                        </p>
                        <div className="flex items-baseline gap-2 mt-auto">
                          <span className="font-serif text-2xl text-terracotta">
                            ₹{product.price.toLocaleString()}
                          </span>
                        </div>
                        {product.stock === 0 && (
                          <div className="mt-3 text-xs text-terracotta font-semibold">
                            Out of Stock
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
