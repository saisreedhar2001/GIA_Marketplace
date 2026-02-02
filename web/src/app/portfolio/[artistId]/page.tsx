'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import api from '@/lib/api'
import { Product } from '@/types'
import toast from 'react-hot-toast'

interface ArtistProfile {
    id: string
    name: string
    artForm: string
    region: string
    bio: string
    avatar?: string
}

export default function ArtistPortfolioPage({ params }: { params: Promise<{ artistId: string }> }) {
    const { artistId } = React.use(params)
    const [artist, setArtist] = useState<ArtistProfile | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchArtistPortfolio()
    }, [artistId])

    const fetchArtistPortfolio = async () => {
        try {
            setLoading(true)
            // Fetch products for the artist
            const productsRes = await api.get(`/products?artistId=${artistId}`)
            const items = productsRes.data.items || []

            setProducts(items)

            // Create a basic artist profile from the artistId
            if (items.length > 0) {
                // If we have products, we know the artist exists
                setArtist({
                    id: artistId,
                    name: 'Artist',
                    artForm: '',
                    region: '',
                    bio: '',
                })
            } else {
                // If no products, show a minimal artist page
                setArtist({
                    id: artistId,
                    name: 'Artist',
                    artForm: '',
                    region: '',
                    bio: 'Explore this artist\'s works',
                })
            }
        } catch (error) {
            console.error('Error fetching portfolio:', error)
            toast.error('Failed to load portfolio')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-warm-gray">Loading portfolio...</p>
            </div>
        )
    }

    if (!artist) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-warm-gray">Artist not found</p>
            </div>
        )
    }

    return (
        <div className="bg-off-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Artist Header */}
                <div className="mb-12">
                    <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center mb-8">
                        {artist.avatar && (
                            <div className="relative h-32 w-32 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                    src={artist.avatar}
                                    alt={artist.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <h1 className="font-serif text-4xl font-bold text-indigo mb-2">
                                {artist.name}
                            </h1>
                            <div className="space-y-2">
                                {artist.artForm && <p className="text-lg text-terracotta font-semibold">{artist.artForm}</p>}
                                {artist.region && <p className="text-sm text-warm-gray">From {artist.region}</p>}
                                {artist.bio && (
                                    <p className="text-base text-warm-gray mt-4 max-w-2xl">{artist.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="h-1 w-16 bg-terracotta"></div>
                </div>

                {/* Artworks */}
                <div>
                    <h2 className="font-serif text-3xl font-bold text-indigo mb-8">
                        Works ({products.length})
                    </h2>

                    {products.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-warm-gray">No artworks yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/shop/${product.id}`}
                                    className="group"
                                >
                                    <div className="card overflow-hidden">
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
