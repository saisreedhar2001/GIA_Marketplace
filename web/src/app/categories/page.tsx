'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function CategoriesPage() {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('cat') || ''

  const categories = [
    {
      name: 'Handcrafted Decor',
      description: 'Beautiful home décor items handmade by artisans',
      icon: '🏺',
    },
    {
      name: 'Traditional Paintings',
      description: 'Classical and traditional Indian paintings',
      icon: '🎨',
    },
    {
      name: 'Tribal Art',
      description: 'Authentic tribal and indigenous art forms',
      icon: '🎭',
    },
    {
      name: 'Modern Indian Art',
      description: 'Contemporary art with Indian influences',
      icon: '✨',
    },
    {
      name: 'Sustainable Crafts',
      description: 'Eco-friendly and sustainable handmade items',
      icon: '🌿',
    },
    {
      name: 'Jewelry & Accessories',
      description: 'Handcrafted jewelry and wearable art',
      icon: '💎',
    },
  ]

  const selectedCategoryData = categories.find((c) => c.name === selectedCategory)

  return (
    <div className="bg-off-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo/5 to-terracotta/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-5xl font-bold text-indigo mb-4">
            Explore Categories
          </h1>
          <p className="text-warm-gray text-lg">
            Discover Indian art and crafts by category
          </p>
        </div>
      </section>

      {selectedCategoryData ? (
        // Category Detail
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => window.history.back()}
              className="text-terracotta hover:text-indigo transition"
            >
              ← Back
            </button>
            <h2 className="font-serif text-3xl font-bold text-indigo">
              {selectedCategory}
            </h2>
          </div>

          <p className="text-warm-gray text-lg mb-12 max-w-2xl">
            {selectedCategoryData.description}
          </p>

          <Link href={`/shop?category=${selectedCategory}`} className="btn-primary">
            Browse Products
          </Link>
        </section>
      ) : (
        // Categories Grid
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/categories?cat=${encodeURIComponent(category.name)}`}
              >
                <div className="card text-center hover-lift cursor-pointer h-full">
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h3 className="font-serif text-2xl font-semibold text-indigo mb-3">
                    {category.name}
                  </h3>
                  <p className="text-warm-gray">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
