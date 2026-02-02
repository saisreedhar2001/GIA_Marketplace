'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Product, BlogPost } from '@/types'
import HeroThreeScene from '@/components/HeroThreeScene'
import Carousel from '@/components/Carousel'
import HorizontalCarousel from '@/components/HorizontalCarousel'

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
         // Fetch featured products1
         try {
           const productsRes = await api.get('/products?featured=true&limit=6')
           setFeatured(productsRes.data.items || [])
         } catch (error) {
           console.warn('Could not fetch featured products:', error)
           setFeatured([])
         }

         // Fetch all products
         try {
           const allProductsRes = await api.get('/products?limit=12')
           setAllProducts(allProductsRes.data.items || [])
         } catch (error) {
           console.warn('Could not fetch all products:', error)
           setAllProducts([])
         }

         // Fetch latest blog posts
         try {
           const blogsRes = await api.get('/blog?limit=3')
           setLatestBlogs(blogsRes.data.items || [])
         } catch (error) {
           console.warn('Could not fetch blog posts:', error)
           setLatestBlogs([])
         }
       } catch (error) {
         console.error('Error fetching data:', error)
       } finally {
         setLoading(false)
       }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-off-white">
      {/* Hero Section */}
      <section className="relative h-screen md:h-auto md:min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta/10 to-indigo/10"></div>
        <HeroThreeScene />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 py-8 md:py-0">
           <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "56rem", margin: "0 auto", padding: "0 1rem" }}>
  <div style={{ position: "relative", height: "7rem", marginBottom: "1rem" }}>

    {/* FONT LOADER (important if not globally loaded) */}
    <link
      href="https://fonts.googleapis.com/css2?family=Pacifico&family=Amatic+SC&family=Dancing+Script&family=Shadows+Into+Light&family=Indie+Flower&family=Freckle+Face&display=swap"
      rel="stylesheet"
    />

    <style>{`
      .font-layer {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: clamp(3rem, 8vw, 5rem);
        font-weight: 700;
        color: #C45A3D; /* terracotta */
        letter-spacing: 0.35em;
        opacity: 0;
        animation: fadeCycle 18s infinite;
      }

      @keyframes fadeCycle {
        0%   { opacity: 0; }
        5%   { opacity: 1; }
        15%  { opacity: 1; }
        20%  { opacity: 0; }
        100% { opacity: 0; }
      }

      .d0  { animation-delay: 0s; }
      .d3  { animation-delay: 3s; }
      .d6  { animation-delay: 6s; }
      .d9  { animation-delay: 9s; }
      .d12 { animation-delay: 12s; }
      .d15 { animation-delay: 15s; }
    `}</style>

    <div className="font-layer d0" style={{ fontFamily: "'Playfair Display', cursive" }}>GIA</div>
    <div className="font-layer d3" style={{ fontFamily: "'Cormorant Garamond', cursive" }}>GIA</div>
    <div className="font-layer d6" style={{ fontFamily: "'Dancing Script', cursive" }}>GIA</div>
    <div className="font-layer d9" style={{ fontFamily: "'Didot', cursive" }}>GIA</div>
    <div className="font-layer d12" style={{ fontFamily: "'Amatic SC', cursive" }}>GIA</div>
    <div className="font-layer d15" style={{ fontFamily: "'Freckle Face', cursive" }}>GIA</div>

  </div>
</div>

           <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-indigo mb-4 sm:mb-6 animate-slide-up animation-delay-100 leading-tight">
              Rooted in Tradition.
              <br />
              Crafted for Today.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-warm-gray mb-6 sm:mb-8 animate-slide-up animation-delay-200">
              Discover authentic Indian art, handmade crafts, and the stories behind every piece.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row justify-center animate-slide-up animation-delay-400">
              <Link href="/shop" className="btn-primary">
                Explore Shop
              </Link>
              <Link href="/work-with-us" className="btn-secondary">
                Become an Artist
              </Link>
            </div>
        </div>

        {/* Decorative Kolam Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <circle cx="600" cy="400" r="300" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="600" cy="400" r="250" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="600" cy="400" r="200" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-indigo mb-4">
              Featured Artworks
            </h2>
            <div className="h-1 w-16 bg-terracotta mx-auto"></div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-warm-gray">Loading artworks...</p>
            </div>
          ) : (
            <>
              <Carousel products={featured} />
              
              {allProducts.length > 0 && (
                <HorizontalCarousel products={allProducts} />
              )}
              
              <div className="flex justify-center mt-8 md:mt-12">
                <Link href="/shop" className="px-6 py-3 bg-terracotta text-off-white rounded-lg font-medium hover:bg-opacity-90 transition inline-flex items-center justify-center min-h-[44px]">
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo/5 to-terracotta/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-indigo mb-4">
              Explore Categories
            </h2>
            <div className="h-1 w-16 bg-terracotta mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {['Handcrafted Decor', 'Traditional Paintings', 'Tribal Art', 'Modern Indian Art', 'Sustainable Crafts', 'Jewelry & Accessories'].map(
              (category) => (
                <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} className="block">
                  <div className="card text-center py-12 hover:bg-terracotta/5 transition cursor-pointer">
                    <h3 className="font-serif text-xl font-semibold text-indigo">
                      {category}
                    </h3>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Art Room Preview */}
      <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-indigo mb-4">
              Art Room
            </h2>
            <p className="text-sm sm:text-base text-warm-gray">Artist stories, sketches, and inspirations</p>
            <div className="h-1 w-16 bg-terracotta mx-auto mt-4"></div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-warm-gray">Loading stories...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8">
              {latestBlogs.map((blog) => (
                <Link key={blog.id} href={`/artroom/${blog.id}`}>
                  <div className="card overflow-hidden hover-lift">
                    {blog.featuredImage && (
                      <div className="relative h-48 bg-sand-beige rounded-lg overflow-hidden mb-4">
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    )}
                    <h3 className="font-serif text-lg font-semibold text-indigo mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-warm-gray text-sm line-clamp-3">
                      {blog.content.substring(0, 100)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <Link href="/artroom" className="px-6 py-3 bg-indigo text-off-white rounded-lg font-medium hover:bg-opacity-90 transition inline-flex items-center justify-center min-h-[44px]">
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Magazine CTA */}
      <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo to-deep-green text-off-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Monthly Magazine
          </h2>
          <p className="text-base sm:text-lg text-sand-beige mb-6 md:mb-8">
            Exclusive interviews, behind-the-scenes craftsmanship, and curated art stories delivered to your inbox.
          </p>
          <Link href="/magazine" className="px-6 py-3 bg-terracotta text-off-white rounded-lg font-medium hover:bg-opacity-90 transition inline-flex items-center justify-center min-h-[44px]">
            Subscribe Now
          </Link>
        </div>
      </section>

      {/* Work With Us CTA */}
      <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-gradient-to-br from-terracotta/10 to-indigo/10 border-2 border-terracotta/20">
            <div className="text-center">
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-indigo mb-4">
                Are You an Artist?
              </h2>
              <p className="text-warm-gray text-base sm:text-lg mb-6">
                Join our community of artisans and share your craft with the world.
              </p>
              <Link href="/work-with-us" className="px-6 py-3 bg-terracotta text-off-white rounded-lg font-medium hover:bg-opacity-90 transition inline-flex items-center justify-center min-h-[44px]">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
