'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import { WorkWithUsCreate } from '@/types'
import toast from 'react-hot-toast'

export default function WorkWithUsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<WorkWithUsCreate>({
    artForm: '',
    region: '',
    yearsOfPractice: 0,
    bio: '',
    portfolio: [],
  })
  const [portfolioInput, setPortfolioInput] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearsOfPractice' ? parseInt(value) || 0 : value,
    }))
  }

  const handleAddPortfolio = () => {
    if (portfolioInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        portfolio: [...prev.portfolio, portfolioInput.trim()],
      }))
      setPortfolioInput('')
    }
  }

  const handleRemovePortfolio = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please login first')
      router.push('/auth/login?redirect=/work-with-us')
      return
    }

    if (!formData.artForm || !formData.region || !formData.bio) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setLoading(true)
      await api.post('/work-with-us', formData)
      toast.success('Application submitted! We\'ll review it soon.')
      router.push('/profile')
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.response?.data?.detail || 'Application failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-off-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-5xl font-bold text-indigo mb-4">
            Become a GIA Artist
          </h1>
          <p className="text-warm-gray text-lg">
            Share your craft with our community and reach art enthusiasts worldwide
          </p>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="card bg-white">
          <div className="space-y-6">
            {/* Art Form */}
            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Art Form / Craft Type *
              </label>
              <input
                type="text"
                name="artForm"
                placeholder="e.g., Kalamkari, Madhubani, Wooden Carvings, Pottery"
                value={formData.artForm}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Region / Origin *
              </label>
              <input
                type="text"
                name="region"
                placeholder="e.g., Andhra Pradesh, Tamil Nadu, Rajasthan"
                value={formData.region}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
              />
            </div>

            {/* Years of Practice */}
            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Years of Practice
              </label>
              <input
                type="number"
                name="yearsOfPractice"
                min="0"
                value={formData.yearsOfPractice}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Tell Us About Your Art & Journey *
              </label>
              <textarea
                name="bio"
                placeholder="Share your story, inspiration, and what makes your craft unique..."
                value={formData.bio}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20 resize-none"
              />
            </div>

            {/* Portfolio Links */}
            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Portfolio Links (optional)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  placeholder="Add portfolio link (e.g., Instagram, website)"
                  value={portfolioInput}
                  onChange={(e) => setPortfolioInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
                />
                <button
                  type="button"
                  onClick={handleAddPortfolio}
                  className="px-4 py-2 bg-sand-beige text-indigo rounded-lg hover:bg-terracotta hover:text-white transition"
                >
                  Add
                </button>
              </div>
              {formData.portfolio.length > 0 && (
                <div className="space-y-2">
                  {formData.portfolio.map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-2 bg-sand-beige rounded-lg"
                    >
                      <span className="text-sm text-indigo truncate">{link}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePortfolio(idx)}
                        className="text-terracotta hover:text-red-600 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-terracotta/5 rounded-lg border border-terracotta/20">
            <h4 className="font-semibold text-indigo mb-2">What Happens Next?</h4>
            <ul className="text-sm text-warm-gray space-y-2">
              <li>✓ Our team reviews your application</li>
              <li>✓ We verify your art and background</li>
              <li>✓ You get onboarded to our artist network</li>
              <li>✓ Start selling and sharing your craft with the world</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  )
}
