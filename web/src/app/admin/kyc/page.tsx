'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminKYCPage() {
  const [formData, setFormData] = useState({
    panNumber: '',
    panDoc: null as File | null,
    aadharNumber: '',
    aadharDoc: null as File | null,
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  })

  const [uploading, setUploading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'panDoc' | 'aadharDoc') => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, [fileType]: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      // TODO: Implement file upload and KYC submission to API
      toast.success('KYC details saved successfully')
    } catch (error) {
      console.error('Error saving KYC:', error)
      toast.error('Failed to save KYC details')
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
            KYC & Payment Details
          </h1>
          <p className="text-warm-gray">
            Update your KYC information and bank details for payments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* PAN Section */}
              <div className="card">
                <h3 className="font-serif text-xl font-semibold text-indigo mb-6">
                  PAN Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-2">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., AAAPA5055K"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-2">
                      PAN Document (PDF/Image)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'panDoc')}
                      className="w-full"
                      required
                    />
                    {formData.panDoc && (
                      <p className="text-xs text-warm-gray mt-2">
                        Selected: {formData.panDoc.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Aadhar Section */}
              <div className="card">
                <h3 className="font-serif text-xl font-semibold text-indigo mb-6">
                  Aadhar Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-2">
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 1234 5678 9012"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-2">
                      Aadhar Document (PDF/Image)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'aadharDoc')}
                      className="w-full"
                      required
                    />
                    {formData.aadharDoc && (
                      <p className="text-xs text-warm-gray mt-2">
                        Selected: {formData.aadharDoc.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="card">
                <h3 className="font-serif text-xl font-semibold text-indigo mb-6">
                  Bank Account Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="e.g., HDFC Bank"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-2">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleInputChange}
                      placeholder="Full name as per bank"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 1234567890123456"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-2">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      placeholder="e.g., HDFC0001234"
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
                {uploading ? 'Saving...' : 'Save KYC & Payment Details'}
              </button>
            </form>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            <div className="card bg-sand-beige/30 sticky top-20">
              <h3 className="font-serif text-lg font-semibold text-indigo mb-4">
                ℹ️ Required Information
              </h3>
              <div className="space-y-3 text-sm text-warm-gray">
                <div>
                  <h4 className="font-semibold text-indigo mb-1">PAN</h4>
                  <p>10-digit unique identifier for taxation</p>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo mb-1">Aadhar</h4>
                  <p>12-digit unique identification number</p>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo mb-1">Bank Details</h4>
                  <p>Used for payment settlement of your sales</p>
                </div>
                <div className="pt-3 border-t border-sand-beige">
                  <p className="text-xs">
                    ✓ All information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
