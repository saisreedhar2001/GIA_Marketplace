'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Product {
  id: string
  title: string
  price: number
  stock: number
  category: string
  artistId: string
  createdAt: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/')
      return
    }

    if (authLoading) return

    fetchProducts()
  }, [user, authLoading])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/products?limit=100')
      setProducts(res.data.items || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <p className="text-warm-gray">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-indigo mb-2">Manage Products</h1>
            <p className="text-warm-gray">View and manage all products</p>
          </div>
          <Link
            href="/products/new"
            className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-80 transition"
          >
            Upload Product
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
          />
        </div>

        {/* Products Table */}
        <div className="card overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-warm-gray mb-4">No products found</p>
              <Link
                href="/products/new"
                className="inline-block px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-80 transition"
              >
                Upload First Product
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-sand-beige">
                  <th className="text-left py-4 px-4 font-semibold text-indigo">Title</th>
                  <th className="text-left py-4 px-4 font-semibold text-indigo">Category</th>
                  <th className="text-right py-4 px-4 font-semibold text-indigo">Price</th>
                  <th className="text-right py-4 px-4 font-semibold text-indigo">Stock</th>
                  <th className="text-center py-4 px-4 font-semibold text-indigo">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-sand-beige hover:bg-sand-beige/50 transition">
                    <td className="py-4 px-4">
                      <Link href={`/products/${product.id}`} className="text-indigo hover:text-terracotta">
                        {product.title}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-warm-gray">{product.category}</td>
                    <td className="py-4 px-4 text-right font-semibold text-terracotta">
                      ₹{product.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
                        >
                          Edit
                        </Link>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="text-warm-gray text-sm mb-2">Total Products</p>
            <p className="font-serif text-3xl font-bold text-terracotta">{products.length}</p>
          </div>
          <div className="card text-center">
            <p className="text-warm-gray text-sm mb-2">In Stock</p>
            <p className="font-serif text-3xl font-bold text-green-600">
              {products.filter((p) => p.stock > 0).length}
            </p>
          </div>
          <div className="card text-center">
            <p className="text-warm-gray text-sm mb-2">Out of Stock</p>
            <p className="font-serif text-3xl font-bold text-red-600">
              {products.filter((p) => p.stock === 0).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
