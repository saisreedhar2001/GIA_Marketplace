'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import api from '@/lib/api'
import { useCartStore } from '@/store/cart'
import { Product } from '@/types'
import toast from 'react-hot-toast'

interface ArtistInfo {
    id: string
    name: string
    avatar?: string
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: productId } = React.use(params)
    const [product, setProduct] = useState<Product | null>(null)
    const [artist, setArtist] = useState<ArtistInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [isAutoSliding, setIsAutoSliding] = useState(true)
    const { addItem } = useCartStore()

    useEffect(() => {
        fetchProduct()
    }, [productId])

    useEffect(() => {
        if (!product?.image || product.images?.length === 0 || !isAutoSliding) return

        const images = Array.from(new Set([product.image, ...(product.images || [])].filter(Boolean)))
        if (images.length <= 1) return

        const interval = setInterval(() => {
            setSelectedImage((prev) => (prev + 1) % images.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [product?.image, product?.images, isAutoSliding])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/products/${productId}`)
            setProduct(res.data)

            // Set a basic artist object with the artistId
            if (res.data.artistId) {
                setArtist({
                    id: res.data.artistId,
                    name: 'Artist',
                })
            }
        } catch (error) {
            console.error('Error fetching product:', error)
            toast.error('Failed to load product')
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (!product) return

        addItem({
            productId: product.id,
            quantity,
            price: product.price,
        })
        toast.success('Added to cart')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-warm-gray">Loading product...</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-warm-gray">Product not found</p>
            </div>
        )
    }

    const images = Array.from(new Set([product.image, ...(product.images || [])].filter(Boolean)))

    return (
        <div className="bg-off-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Images */}
                    <div>
                        <div className="relative h-72 bg-sand-beige rounded-lg overflow-hidden mb-4">
                            {images[selectedImage] && (
                                <Image
                                    src={images[selectedImage]}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto mb-6">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedImage(idx)
                                            setIsAutoSliding(false)
                                        }}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${selectedImage === idx
                                            ? 'border-terracotta'
                                            : 'border-sand-beige hover:border-terracotta'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.title} ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Add to Cart Card */}
                        <div className="card">
                            <div className="mb-6 pb-6 border-b border-sand-beige">
                                <div className="flex items-center justify-center gap-4">
                                    <span className="font-serif text-3xl font-bold text-terracotta">
                                        ₹{product.price.toLocaleString()}
                                    </span>
                                    <div className="w-px h-6 bg-sand-beige"></div>
                                    <span className="font-serif text-base font-semibold text-warm-gray">
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center justify-center h-12">
                                <div className="flex items-center border border-sand-beige rounded-lg h-12">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-3 text-indigo hover:bg-sand-beige transition font-semibold text-lg"
                                    >
                                        −
                                    </button>
                                    <span className="px-6 py-3 font-semibold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-3 text-indigo hover:bg-sand-beige transition font-semibold text-lg"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3 px-8 h-12 text-base font-semibold"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <div className="mb-4">
                            <span className="inline-block text-xs font-semibold bg-indigo text-white px-4 py-1.5 rounded-full mb-4">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="font-serif text-3xl font-bold text-indigo mb-4">
                            {product.title}
                        </h1>

                        <p className="text-warm-gray text-lg mb-6">
                            {product.description}
                        </p>

                        {/* Art Story */}
                        <div className="mb-8">
                            <h3 className="font-serif text-xl font-semibold text-indigo mb-3">
                                Art Story
                            </h3>
                            <p className="text-warm-gray leading-relaxed">
                                {product.artStory}
                            </p>
                        </div>

                        {/* Cultural Context */}
                        <div className="mb-8">
                            <h3 className="font-serif text-xl font-semibold text-indigo mb-3">
                                Cultural Context
                            </h3>
                            <p className="text-warm-gray leading-relaxed">
                                {product.culturalContext}
                            </p>
                        </div>

                        {/* Care Instructions */}
                        <div className="mb-8">
                            <h3 className="font-serif text-xl font-semibold text-indigo mb-3">
                                Care Instructions
                            </h3>
                            <p className="text-warm-gray leading-relaxed">
                                {product.careInstructions}
                            </p>
                        </div>

                        {/* Visit Artist Portfolio */}
                        {artist && (
                            <div className="pt-8 border-t border-sand-beige">
                                <Link
                                    href={`/portfolio/${artist.id}`}
                                    className="inline-block px-6 py-3 bg-terracotta text-off-white rounded-lg font-semibold hover:bg-opacity-90 transition"
                                >
                                    Visit Artist Portfolio →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
