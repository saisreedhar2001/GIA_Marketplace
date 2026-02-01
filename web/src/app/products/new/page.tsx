'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import { uploadImage } from '@/lib/storage'
import toast from 'react-hot-toast'

interface ProductForm {
  title: string
  description: string
  price: number
  stock: number
  category: string
  artStory: string
  careInstructions: string
  culturalContext: string
  image: string
  images: string[]
}

export default function UploadProductPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [imageInput, setImageInput] = useState('')
  const [formData, setFormData] = useState<ProductForm>({
    title: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    artStory: '',
    careInstructions: '',
    culturalContext: '',
    image: '',
    images: [],
  })

  if (user?.role !== 'admin' && user?.role !== 'artist') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="text-center">
          <p className="text-indigo font-semibold mb-4">You don't have permission to upload products</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-80 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
        image: prev.image || imageInput.trim(),
      }))
      setImageInput('')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      toast.promise(
        (async () => {
          const uploadPromises = Array.from(files).map((file) => uploadImage(file, 'products'))
          const urls = await Promise.all(uploadPromises)

          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...urls],
            image: prev.image || urls[0],
          }))
        })(),
        {
          loading: 'Uploading images...',
          success: 'Images uploaded!',
          error: 'Failed to upload images',
        }
      )
    } catch (error: any) {
      console.error('Error uploading files:', error)
      toast.error(error.message || 'Failed to upload images')
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index)
      return {
        ...prev,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : '',
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.price || !formData.category) {
      toast.error('Please fill all required fields')
      return
    }

    if (!formData.image && formData.images.length === 0) {
      toast.error('Please add at least one image')
      return
    }

    try {
      setLoading(true)
      await api.post('/products', formData)
      toast.success('Product uploaded successfully!')
      router.push('/artist')
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.response?.data?.detail || 'Failed to upload product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-off-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-bold text-indigo mb-2">Upload Product</h1>
          <p className="text-warm-gray">Share your art with the GIA community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-indigo mb-2">
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Hand-painted Madhubani Art"
              required
              className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-indigo mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product in detail"
              rows={4}
              required
              className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20 resize-none"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                required
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-indigo mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
            >
              <option value="">Select a category</option>
              <option value="Handcrafted Decor">Handcrafted Decor</option>
              <option value="Traditional Paintings">Traditional Paintings</option>
              <option value="Tribal Art">Tribal Art</option>
              <option value="Modern Indian Art">Modern Indian Art</option>
              <option value="Sustainable Crafts">Sustainable Crafts</option>
              <option value="Jewelry & Accessories">Jewelry & Accessories</option>
            </select>
          </div>

          {/* Art Story */}
          <div>
            <label className="block text-sm font-semibold text-indigo mb-2">
              Art Story & Inspiration
            </label>
            <textarea
              name="artStory"
              value={formData.artStory}
              onChange={handleInputChange}
              placeholder="Share the story behind this art piece"
              rows={4}
              className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20 resize-none"
            />
          </div>

          {/* Cultural Context */}
          <div>
            <label className="block text-sm font-semibold text-indigo mb-2">
              Cultural Context
            </label>
            <textarea
              name="culturalContext"
              value={formData.culturalContext}
              onChange={handleInputChange}
              placeholder="Tell about the cultural significance of this art form"
              rows={3}
              className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20 resize-none"
            />
          </div>

          {/* Care Instructions */}
          <div>
            <label className="block text-sm font-semibold text-indigo mb-2">
              Care Instructions
            </label>
            <textarea
              name="careInstructions"
              value={formData.careInstructions}
              onChange={handleInputChange}
              placeholder="How to care for this product"
              rows={3}
              className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20 resize-none"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-indigo mb-2">
              Product Images
            </label>

            {/* Upload from Computer */}
            <div className="mb-4">
              <label className="block text-xs text-warm-gray mb-2 font-semibold">
                Upload from Computer:
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta cursor-pointer"
              />
              <p className="text-xs text-warm-gray mt-1">
                Max 5MB per image. Supports: JPG, PNG, GIF, WebP
              </p>
            </div>

            {/* Or Add by URL */}
            <div>
              <label className="block text-xs text-warm-gray mb-2 font-semibold">
                Or paste image URL:
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-sand-beige text-indigo rounded-lg hover:bg-terracotta hover:text-white transition"
                >
                  Add URL
                </button>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden aspect-square bg-sand-beige flex items-center justify-center group"
                  >
                    <img
                      src={img}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ''
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <span className="text-white font-bold">Remove</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Product'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
