'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CreateStoryPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Artist Story',
    featuredImage: null as File | null,
    tags: '',
    publish: false,
  })

  const [uploading, setUploading] = useState(false)

  const categories = [
    'Artist Story',
    'Creative Process',
    'Inspiration',
    'Sketches & Studies',
    'Behind the Scenes',
    'Artist Interview',
    'Techniques',
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, featuredImage: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      // TODO: Implement story upload to API
      toast.success('Story published to Art Room successfully')
      setFormData({
        title: '',
        content: '',
        category: 'Artist Story',
        featuredImage: null,
        tags: '',
        publish: false,
      })
    } catch (error) {
      console.error('Error publishing story:', error)
      toast.error('Failed to publish story')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-terracotta hover:text-indigo mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-indigo mb-2">
            Create Art Room Story
          </h1>
          <p className="text-warm-gray">
            Share your artistic journey, process, and inspiration with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="card">
            <h3 className="font-serif text-xl font-semibold text-indigo mb-6">
              Story Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo mb-2">
                  Story Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., My Journey into Watercolor Painting"
                  className="w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., watercolor, nature, inspiration"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="card">
            <h3 className="font-serif text-xl font-semibold text-indigo mb-6">
              Story Content
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo mb-2">
                  Featured Image
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {formData.featuredImage && (
                  <p className="text-xs text-warm-gray mt-2">
                    Selected: {formData.featuredImage.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo mb-2">
                  Story Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your story here..."
                  rows={8}
                  className="w-full"
                  required
                />
                <p className="text-xs text-warm-gray mt-1">
                  {formData.content.length} characters
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="publish"
                  name="publish"
                  checked={formData.publish}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label htmlFor="publish" className="text-sm font-medium text-indigo">
                  Publish immediately (visible to everyone)
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Publishing...' : 'Publish Story'}
          </button>
        </form>
      </div>
    </div>
  )
}
