'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function MagazineUploadPage() {
  const [formData, setFormData] = useState({
    title: '',
    issue: '',
    content: '',
    coverImage: null as File | null,
    pdfFile: null as File | null,
    releaseDate: '',
    description: '',
  })

  const [uploading, setUploading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'coverImage' | 'pdfFile') => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, [fileType]: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      // TODO: Implement magazine upload to API
      toast.success('Magazine uploaded successfully')
      setFormData({
        title: '',
        issue: '',
        content: '',
        coverImage: null,
        pdfFile: null,
        releaseDate: '',
        description: '',
      })
    } catch (error) {
      console.error('Error uploading magazine:', error)
      toast.error('Failed to upload magazine')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/superadmin" className="text-terracotta hover:text-indigo mb-4 inline-block">
            ← Back to Super Admin
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-indigo mb-2">
            Upload Monthly Magazine
          </h1>
          <p className="text-warm-gray">
            Create and publish the monthly magazine for your community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h3 className="font-serif text-xl font-semibold text-indigo mb-6">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo mb-2">
                  Magazine Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Art Chronicles - February 2026"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo mb-2">
                  Issue Number
                </label>
                <input
                  type="number"
                  name="issue"
                  value={formData.issue}
                  onChange={handleInputChange}
                  placeholder="e.g., 15"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo mb-2">
                  Release Date
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the magazine"
                  rows={3}
                  className="w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="card">
            <h3 className="font-serif text-xl font-semibold text-indigo mb-6">
              Magazine Content
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo mb-2">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'coverImage')}
                  className="w-full"
                  required
                />
                {formData.coverImage && (
                  <p className="text-xs text-warm-gray mt-2">
                    Selected: {formData.coverImage.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo mb-2">
                  Magazine PDF
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'pdfFile')}
                  className="w-full"
                  required
                />
                {formData.pdfFile && (
                  <p className="text-xs text-warm-gray mt-2">
                    Selected: {formData.pdfFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo mb-2">
                  Full Content / Editorial
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Full content for the magazine article"
                  rows={6}
                  className="w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Publishing...' : 'Publish Magazine'}
          </button>
        </form>
      </div>
    </div>
  )
}
