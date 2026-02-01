'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'
import { Product } from '@/types'
import toast from 'react-hot-toast'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const { user } = useAuthStore()
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(true)
  const [processingCheckout, setProcessingCheckout] = useState(false)

  useEffect(() => {
    if (items.length > 0) {
      fetchProductDetails()
    } else {
      setLoading(false)
    }
  }, [items])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const productsMap: Record<string, Product> = {}
      
      for (const item of items) {
        if (!productsMap[item.productId]) {
          const res = await api.get(`/products/${item.productId}`)
          productsMap[item.productId] = res.data
        }
      }
      
      setProducts(productsMap)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load cart details')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/cart')
      return
    }

    try {
      setProcessingCheckout(true)
      // Navigate to checkout page
      router.push('/checkout')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Checkout failed')
    } finally {
      setProcessingCheckout(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-warm-gray">Loading cart...</p>
      </div>
    )
  }

  return (
    <div className="bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl font-bold text-indigo mb-12">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-warm-gray text-lg mb-6">Your cart is empty</p>
            <Link href="/shop" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => {
                  const product = products[item.productId]
                  return (
                    <div
                      key={item.productId}
                      className="card flex gap-4 items-center justify-between"
                    >
                      <div className="flex gap-4 flex-1">
                        {product?.image && (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-sand-beige">
                            {/* Image would go here */}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-serif text-lg font-semibold text-indigo mb-1">
                            {product?.title || 'Loading...'}
                          </h3>
                          <p className="text-warm-gray text-sm mb-2">
                            ₹{item.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              className="px-2 py-1 border border-sand-beige rounded text-indigo hover:bg-sand-beige transition"
                            >
                              −
                            </button>
                            <span className="px-3 font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="px-2 py-1 border border-sand-beige rounded text-indigo hover:bg-sand-beige transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-lg text-terracotta mb-2">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-sm text-terracotta hover:text-red-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-20">
                <h3 className="font-serif text-2xl font-bold text-indigo mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-sand-beige">
                  <div className="flex justify-between text-warm-gray">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-warm-gray">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-warm-gray">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-sand-beige">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg font-bold text-indigo">Total</span>
                    <span className="font-serif text-2xl text-terracotta">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={processingCheckout}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  {processingCheckout ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <Link href="/shop" className="block w-full btn-secondary text-center">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
