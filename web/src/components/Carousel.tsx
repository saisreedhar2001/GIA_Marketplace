'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'

export default function Carousel({ 
  products, 
  imageOnly = false,
  showControls = true,
  itemsPerPage = 3
}: { 
  products: Product[]
  imageOnly?: boolean
  showControls?: boolean
  itemsPerPage?: number
}) {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay || products.length === 0) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoPlay, products.length])

  if (products.length === 0) {
    return null
  }

  const next = () => {
    setCurrent((prev) => (prev + 1) % products.length)
    setAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + products.length) % products.length)
    setAutoPlay(false)
  }

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-lg">
        <div className={`grid gap-4 md:gap-6 ${itemsPerPage === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {products.map((product, index) => {
            const isVisible =
              index === current ||
              (index === (current + 1) % products.length && products.length > 1) ||
              (index === (current + 2) % products.length && products.length > 2)

            return isVisible ? (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group"
              >
                {imageOnly ? (
                  <div className="relative h-48 sm:h-56 md:h-64 bg-sand-beige rounded-lg overflow-hidden animate-fade-in">
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
                ) : (
                  <div className="card overflow-hidden animate-fade-in">
                    <div className="relative h-48 sm:h-56 md:h-64 bg-sand-beige rounded-lg overflow-hidden mb-4">
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
                    <h3 className="font-serif text-lg md:text-xl font-semibold text-indigo mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-warm-gray text-xs sm:text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-2xl text-terracotta">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-sand-beige bg-indigo px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            ) : null
          })}
        </div>
      </div>

      {/* Navigation Buttons & Indicators */}
      {showControls && products.length > itemsPerPage && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-terracotta text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-opacity-80 transition"
            aria-label="Previous"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-terracotta text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-opacity-80 transition"
            aria-label="Next"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrent(index)
                  setAutoPlay(false)
                }}
                className={`w-2 h-2 rounded-full transition ${
                  index === current
                    ? 'bg-terracotta w-8'
                    : 'bg-sand-beige hover:bg-warm-gray'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
