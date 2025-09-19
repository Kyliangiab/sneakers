'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import LoadingSpinner from './LoadingSpinner'

interface Product {
  id: string
  title: string
  slug: string
  price: number
  images?: Array<{
    url: string
    alt?: string
  }>
  rating?: number
  reviewCount?: number
  isNewArrival?: boolean
  variants?: Array<{
    name: string
    value: string
    stock: number
  }>
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=4&random=true')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.docs || [])
        } else {
          // Fallback avec des produits mockés si l'API n'est pas disponible
          setProducts([
            {
              id: '1',
              title: 'Air Jordan 1 Retro High OG',
              slug: 'air-jordan-1-retro-high-og',
              price: 150,
              rating: 4.8,
              reviewCount: 1247,
              isNewArrival: true,
              images: [{ url: '/api/placeholder/400/400', alt: 'Air Jordan 1' }]
            },
            {
              id: '2',
              title: 'Nike Air Max 90 Essential',
              slug: 'nike-air-max-90-essential',
              price: 120,
              rating: 4.6,
              reviewCount: 892,
              isNewArrival: false,
              images: [{ url: '/api/placeholder/400/400', alt: 'Air Max 90' }]
            },
            {
              id: '3',
              title: 'Adidas Ultraboost 22',
              slug: 'adidas-ultraboost-22',
              price: 180,
              rating: 4.9,
              reviewCount: 2156,
              isNewArrival: true,
              images: [{ url: '/api/placeholder/400/400', alt: 'Ultraboost 22' }]
            },
            {
              id: '4',
              title: 'New Balance 550 White',
              slug: 'new-balance-550-white',
              price: 110,
              rating: 4.5,
              reviewCount: 634,
              isNewArrival: false,
              images: [{ url: '/api/placeholder/400/400', alt: 'New Balance 550' }]
            }
          ])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error)
        // Utiliser les produits mockés en cas d'erreur
        setProducts([
          {
            id: '1',
            title: 'Air Jordan 1 Retro High OG',
            slug: 'air-jordan-1-retro-high-og',
            price: 150,
            rating: 4.8,
            reviewCount: 1247,
            isNewArrival: true,
            images: [{ url: '/api/placeholder/400/400', alt: 'Air Jordan 1' }]
          },
          {
            id: '2',
            title: 'Nike Air Max 90 Essential',
            slug: 'nike-air-max-90-essential',
            price: 120,
            rating: 4.6,
            reviewCount: 892,
            isNewArrival: false,
            images: [{ url: '/api/placeholder/400/400', alt: 'Air Max 90' }]
          },
          {
            id: '3',
            title: 'Adidas Ultraboost 22',
            slug: 'adidas-ultraboost-22',
            price: 180,
            rating: 4.9,
            reviewCount: 2156,
            isNewArrival: true,
            images: [{ url: '/api/placeholder/400/400', alt: 'Ultraboost 22' }]
          },
          {
            id: '4',
            title: 'New Balance 550 White',
            slug: 'new-balance-550-white',
            price: 110,
            rating: 4.5,
            reviewCount: 634,
            isNewArrival: false,
            images: [{ url: '/api/placeholder/400/400', alt: 'New Balance 550' }]
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produits en vedette
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos sélections les plus populaires
            </p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Produits en vedette
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez nos sélections les plus populaires
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 text-lg group"
          >
            Voir toute la collection
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  )
}
