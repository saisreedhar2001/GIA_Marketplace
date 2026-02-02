'use client'

import { useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.post('/email/notify-admin', {
        subject: `Contact Form: ${formData.subject}`,
        message: `From: ${formData.name} (${formData.email})\n\n${formData.message}`
      })
      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message')
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
            Contact Us
          </h1>
          <p className="text-warm-gray text-lg">
            We'd love to hear from you
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Subject
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo mb-2">
                Message
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
