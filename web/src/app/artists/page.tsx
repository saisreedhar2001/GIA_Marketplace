'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Product } from '@/types'

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      setLoading(true)
      const res = await api.get('/products?limit=100')
      const products = res.data.items || []
      
      // Group products by artist
      const artistMap = new Map()
      products.forEach((product: Product) => {
        const artistId = product.artistId
        if (!artistMap.has(artistId)) {
          artistMap.set(artistId, {
            id: artistId,
            name: product.artistName || 'Artist',
            productCount: 0,
            image: product.image
          })
        }
        artistMap.get(artistId).productCount += 1
      })

      setArtists(Array.from(artistMap.values()))
    } catch (error) {
      console.error('Error fetching artists:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-off-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo/5 to-terracotta/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-5xl font-bold text-indigo mb-4">
            Our Artists
          </h1>
          <p className="text-warm-gray text-lg">
            Discover talented artisans and their masterpieces
          </p>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-warm-gray">Loading artists...</p>
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-warm-gray">No artists found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <Link key={artist.id} href={`/portfolio/${artist.id}`}>
                <div className="card text-center hover-lift cursor-pointer h-full">
                  {artist.image && (
                    <div className="relative h-48 bg-sand-beige rounded-lg overflow-hidden mb-4">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-serif text-2xl font-semibold text-indigo mb-2">
                    {artist.name}
                  </h3>
                  <p className="text-warm-gray mb-4">
                    {artist.productCount} work{artist.productCount !== 1 ? 's' : ''}
                  </p>
                  <span className="text-terracotta font-semibold">View Portfolio →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
