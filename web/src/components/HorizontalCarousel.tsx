'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'

export default function HorizontalCarousel({ products }: { products: Product[] }) {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay || products.length === 0) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoPlay, products.length])

  const next = () => {
    setCurrent((prev) => (prev + 1) % products.length)
    setAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + products.length) % products.length)
    setAutoPlay(false)
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div
      className="w-full py-6 md:py-8 flex justify-center"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Carousel Container */}
      <div className="w-full max-w-2xl px-4">
        <div className="overflow-hidden rounded-lg">
          <div 
            className="flex gap-4 md:gap-6 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${current * 50}%))`,
            }}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group flex-shrink-0 w-1/2"
              >
                <div className="relative h-32 md:h-40 bg-sand-beige rounded-lg overflow-hidden">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
