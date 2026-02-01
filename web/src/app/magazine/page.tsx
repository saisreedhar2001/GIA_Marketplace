'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import { Magazine } from '@/types'
import toast from 'react-hot-toast'

export default function MagazinePage() {
  const { user } = useAuthStore()
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    fetchMagazines()
  }, [])

  const fetchMagazines = async () => {
    try {
      setLoading(true)
      const res = await api.get('/magazine')
      setMagazines(res.data.items || [])
    } catch (error) {
      console.error('Error fetching magazines:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please login to subscribe')
      return
    }

    try {
      setSubscribing(true)
      // Create subscription logic
      toast.success('Subscription successful!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Subscription failed')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <div className="bg-off-white">
      {/* Header/CTA Section */}
      <section className="bg-gradient-to-r from-indigo to-deep-green text-off-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            GIA Monthly Magazine
          </h1>
          <p className="text-xl text-sand-beige mb-8 leading-relaxed">
            Exclusive interviews with master artisans, behind-the-scenes craftsmanship, and curated stories celebrating Indian art and culture.
          </p>
          <button
            onClick={handleSubscribe}
            disabled={subscribing}
            className="inline-block px-8 py-3 bg-terracotta text-off-white rounded-lg font-medium hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {subscribing ? 'Processing...' : 'Subscribe Now'}
          </button>
        </div>
      </section>

      {/* Magazine Issues */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <h2 className="font-serif text-4xl font-bold text-indigo mb-4">
            Latest Issues
          </h2>
          <div className="h-1 w-16 bg-terracotta"></div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-warm-gray">Loading magazines...</p>
          </div>
        ) : magazines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-warm-gray">No magazines available yet</p>
          </div>
        ) : (
          <div className="space-y-12">
            {magazines.map((magazine) => (
              <div key={magazine.id} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cover */}
                <div className="relative h-96 bg-sand-beige rounded-lg overflow-hidden">
                  {magazine.coverImage && (
                    <Image
                      src={magazine.coverImage}
                      alt={magazine.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="md:col-span-2">
                  <div className="text-sm text-terracotta font-semibold mb-2">
                    Issue #{magazine.issue}
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-indigo mb-4">
                    {magazine.title}
                  </h3>
                  <p className="text-warm-gray text-lg mb-6 leading-relaxed">
                    {magazine.description}
                  </p>

                  {magazine.articles.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-indigo mb-3">Featured Articles</h4>
                      <ul className="space-y-2">
                        {magazine.articles.slice(0, 3).map((article, idx) => (
                          <li key={idx} className="text-warm-gray flex items-start">
                            <span className="text-terracotta mr-3">✦</span>
                            {article}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button className="btn-primary">Read Issue</button>
                    <button className="btn-secondary">Save for Later</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Subscribe Section */}
      <section className="bg-gradient-to-br from-terracotta/5 to-indigo/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-indigo mb-12 text-center">
            Why Subscribe?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Exclusive Stories',
                description: 'Read interviews and stories you won\'t find anywhere else'
              },
              {
                title: 'Artist Features',
                description: 'Discover emerging and established Indian artisans'
              },
              {
                title: 'Behind the Scenes',
                description: 'Explore the craft, techniques, and creative process'
              },
            ].map((item, idx) => (
              <div key={idx} className="card text-center">
                <h3 className="font-serif text-xl font-semibold text-indigo mb-3">
                  {item.title}
                </h3>
                <p className="text-warm-gray">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
