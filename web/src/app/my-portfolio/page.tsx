'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import { Product } from '@/types'
import toast from 'react-hot-toast'

export default function MyPortfolioPage() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuthStore()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && user?.role !== 'admin') {
            router.push('/')
            return
        }

        if (!authLoading && user) {
            fetchPortfolio()
        }
    }, [user, authLoading])

    const fetchPortfolio = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/products?artistId=${user?.id}`)
            setProducts(res.data.items || [])
        } catch (error) {
            console.error('Error fetching portfolio:', error)
            toast.error('Failed to load portfolio')
        } finally {
            setLoading(false)
        }
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-warm-gray">Loading portfolio...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-warm-gray">Please log in</p>
            </div>
        )
    }

    return (
        <div className="bg-off-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-indigo mb-2">
                                {user.name}
                            </h1>
                            <p className="text-warm-gray text-lg">My Portfolio</p>
                        </div>
                        <Link
                            href="/profile"
                            className="px-6 py-3 bg-terracotta text-off-white rounded-lg font-semibold hover:bg-opacity-90 transition"
                        >
                            Back to Profile
                        </Link>
                    </div>

                    <div className="h-1 w-16 bg-terracotta"></div>
                </div>

                {/* Portfolio Items */}
                <div>
                    <h2 className="font-serif text-3xl font-bold text-indigo mb-8">
                        Works ({products.length})
                    </h2>

                    {products.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-warm-gray mb-4">No items in your portfolio yet</p>
                            <Link
                                href="/admin/products"
                                className="inline-block px-6 py-3 bg-terracotta text-off-white rounded-lg font-semibold hover:bg-opacity-90 transition"
                            >
                                Upload Your First Item
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/shop/${product.id}`}
                                    className="group"
                                >
                                    <div className="card overflow-hidden h-full hover-lift">
                                        <div className="relative h-48 sm:h-56 md:h-64 bg-sand-beige rounded-lg overflow-hidden mb-4">
                                            {product.image && (
                                                <Image
                                                    src={product.image}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition duration-300"
                                                />
                                            )}
                                        </div>
                                        <h3 className="font-serif text-lg font-semibold text-indigo mb-2 line-clamp-2">
                                            {product.title}
                                        </h3>
                                        <p className="text-warm-gray text-sm mb-4 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-serif text-xl text-terracotta">
                                                ₹{product.price.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-sand-beige bg-indigo px-3 py-1 rounded-full">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
