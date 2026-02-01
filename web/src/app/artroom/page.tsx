'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/api'
import { BlogPost } from '@/types'

export default function ArtRoomPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const categories = ['Techniques', 'Artists', 'Process', 'Inspiration', 'Behind the Scenes']

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/blog')
      let items = res.data.items || []
      if (selectedCategory) {
        items = items.filter((p) => p.category === selectedCategory)
      }
      setPosts(items)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-5xl font-bold text-indigo mb-4">Art Room</h1>
          <p className="text-warm-gray text-lg">
            A digital journal of artist stories, sketches, and creative inspiration
          </p>
        </div>

        {/* Categories */}
        <div className="mb-12 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg transition ${
              selectedCategory === ''
                ? 'bg-terracotta text-white'
                : 'border border-sand-beige text-indigo hover:border-terracotta'
            }`}
          >
            All Stories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === cat
                  ? 'bg-terracotta text-white'
                  : 'border border-sand-beige text-indigo hover:border-terracotta'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-warm-gray">Loading stories...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-warm-gray">No stories yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/artroom/${post.id}`}>
                <div className="card overflow-hidden cursor-pointer group">
                  {post.featuredImage && (
                    <div className="relative h-48 bg-sand-beige rounded-lg overflow-hidden mb-4">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <span className="text-xs text-terracotta font-semibold mb-2 inline-block">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-indigo mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-warm-gray text-sm line-clamp-3">
                    {post.content.substring(0, 150)}...
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-warm-gray">by {post.author}</span>
                    <span className="text-terracotta text-sm font-semibold">Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
