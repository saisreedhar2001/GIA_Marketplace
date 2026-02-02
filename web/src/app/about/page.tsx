'use client'

export default function AboutPage() {
  return (
    <div className="bg-off-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo/5 to-terracotta/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-5xl font-bold text-indigo mb-4">
            About GIA
          </h1>
          <p className="text-warm-gray text-lg">
            Great India Arts - Celebrating Indian Art and Craftsmanship
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-indigo mb-4">
              Our Mission
            </h2>
            <p className="text-warm-gray leading-relaxed">
              At GIA, we are dedicated to promoting and preserving the rich heritage of Indian art and craftsmanship. 
              We provide a platform for talented artisans to showcase their work to a global audience and celebrate the 
              beauty of traditional and contemporary Indian art forms.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-bold text-indigo mb-4">
              What We Do
            </h2>
            <p className="text-warm-gray leading-relaxed">
              We connect artists with art lovers worldwide, offering a curated marketplace of handcrafted products, 
              traditional paintings, tribal art, and sustainable crafts. Each piece tells a story of skilled craftsmanship 
              and cultural heritage.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-bold text-indigo mb-4">
              Why Choose GIA
            </h2>
            <ul className="space-y-3 text-warm-gray">
              <li className="flex items-start">
                <span className="text-terracotta mr-3">✓</span>
                <span>Authentic products directly from artisans</span>
              </li>
              <li className="flex items-start">
                <span className="text-terracotta mr-3">✓</span>
                <span>Support for traditional art forms</span>
              </li>
              <li className="flex items-start">
                <span className="text-terracotta mr-3">✓</span>
                <span>Fair pricing and artist compensation</span>
              </li>
              <li className="flex items-start">
                <span className="text-terracotta mr-3">✓</span>
                <span>Cultural stories behind each product</span>
              </li>
              <li className="flex items-start">
                <span className="text-terracotta mr-3">✓</span>
                <span>Secure and reliable marketplace</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
