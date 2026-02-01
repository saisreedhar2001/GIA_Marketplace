'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import api from '@/lib/api'
import { BlogPost } from '@/types'

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/blog/${params.id}`)
      setPost(res.data)
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-warm-gray">Loading story...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-warm-gray">Story not found</p>
      </div>
    )
  }

  return (
    <div className="bg-off-white">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="mb-4">
            <span className="text-sm text-terracotta font-semibold">{post.category}</span>
          </div>
          <h1 className="font-serif text-5xl font-bold text-indigo mb-6">
            {post.title}
          </h1>
          <div className="flex items-center justify-between text-warm-gray">
            <span>by {post.author}</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative h-96 bg-sand-beige rounded-lg overflow-hidden mb-12">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-warm-gray leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Gallery */}
        {post.images && post.images.length > 0 && (
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-indigo mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.images.map((img, idx) => (
                <div key={idx} className="relative h-64 bg-sand-beige rounded-lg overflow-hidden">
                  <Image
                    src={img}
                    alt={`${post.title} gallery ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Author */}
        <div className="border-t border-sand-beige pt-8">
          <h3 className="font-serif text-lg font-semibold text-indigo mb-3">
            About the Author
          </h3>
          <p className="text-warm-gray">
            {post.author} is a talented artist and storyteller sharing their creative journey with the GIA community.
          </p>
        </div>
      </article>
    </div>
  )
}
