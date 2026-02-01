'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Script from 'next/script'

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setShippingData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please login first')
      router.push('/auth/login')
      return
    }

    if (items.length === 0) {
      toast.error('Cart is empty')
      return
    }

    try {
      setLoading(true)

      // Create order
      const orderRes = await api.post('/orders', {
        items: items.map((item) => ({
          productId: item.productId,
          title: `Product ${item.productId}`,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        shippingAddress: shippingData,
      })

      const orderData = orderRes.data

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.total * 100,
        currency: 'INR',
        name: 'GIA - Great India Arts',
        description: 'Purchase from GIA',
        order_id: orderData.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            await api.post(
              `/orders/${orderData.id}/payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              }
            )

            clearCart()
            toast.success('Payment successful!')
            router.push(`/orders/${orderData.id}`)
          } catch (error) {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: shippingData.fullName,
          email: shippingData.email,
          contact: shippingData.phone,
        },
        theme: {
          color: '#B85C3C',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.response?.data?.detail || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-warm-gray">Please login to proceed</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-warm-gray">Cart is empty</p>
      </div>
    )
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-serif text-4xl font-bold text-indigo mb-12">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="card space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-indigo mb-4">
                    Shipping Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-indigo mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-indigo mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-indigo mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
                  />
                </div>

                {/* Address Line 1 */}
                <div>
                  <label className="block text-sm font-semibold text-indigo mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={shippingData.addressLine1}
                    onChange={handleInputChange}
                    required
                    placeholder="Street address"
                    className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <input
                    type="text"
                    name="addressLine2"
                    value={shippingData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-indigo mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-semibold text-indigo mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-semibold text-indigo mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-sand-beige rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta focus:ring-opacity-20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-20">
                <h3 className="font-serif text-xl font-semibold text-indigo mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-sand-beige">
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-gray">Items ({items.length})</span>
                    <span className="font-semibold text-indigo">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-gray">Shipping</span>
                    <span className="font-semibold text-indigo">Free</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg font-bold text-indigo">Total</span>
                    <span className="font-serif text-2xl text-terracotta">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-warm-gray text-center">
                  Secure payment powered by Razorpay
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
