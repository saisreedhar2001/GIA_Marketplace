'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/api'
import { Product } from '@/types'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])

  const categories = [
    'Handcrafted Decor',
    'Traditional Paintings',
    'Tribal Art',
    'Modern Indian Art',
    'Sustainable Crafts',
    'Jewelry & Accessories'
  ]

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-5xl font-bold text-indigo mb-4">Shop</h1>
          <p className="text-warm-gray text-lg">
            Discover authentic Indian art and handmade crafts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/shop/${product.id}`}>
                    <div className="card overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-64 bg-sand-beige rounded-lg overflow-hidden mb-4">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-110 transition duration-300"
                          />
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-indigo mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-warm-gray text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-baseline gap-2">
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
