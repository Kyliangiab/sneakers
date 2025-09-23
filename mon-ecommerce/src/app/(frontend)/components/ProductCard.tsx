'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import Toast from './Toast'
import { useCart } from '@/contexts/CartContext'

interface ProductCardProps {
  product: {
    id: string
    title: string
    slug: string
    price: number
    stock?: number
    isInStock?: boolean
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
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const { addToCart } = useCart()

  // Extraire la marque et les détails du titre
  const getBrandFromTitle = (title: string) => {
    if (title.toLowerCase().includes('jordan')) return 'Air Jordan'
    if (title.toLowerCase().includes('nike')) return 'Nike'
    if (title.toLowerCase().includes('adidas')) return 'Adidas'
    if (title.toLowerCase().includes('new balance')) return 'New Balance'
    return 'Marque'
  }

  const getSizeFromTitle = (title: string) => {
    // Extraire la taille du titre (ex: "Taille 42" ou "42")
    const sizeMatch = title.match(/(\d{2,3})/g)
    return sizeMatch ? sizeMatch[0] : '42'
  }

  const getColorFromTitle = (title: string) => {
    const colors = ['Blanc', 'Noir', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Orange', 'Rose', 'Gris']
    for (const color of colors) {
      if (title.toLowerCase().includes(color.toLowerCase())) {
        return color
      }
    }
    return 'Blanc'
  }

  // Fonction pour déterminer le statut du stock
  const getStockStatus = () => {
    const stock = product.stock || 0
    const isInStock = product.isInStock !== false

    if (!isInStock || stock === 0) {
      return { status: 'out-of-stock', text: 'Rupture de stock', color: 'text-red-500' }
    } else if (stock <= 5) {
      return { status: 'low-stock', text: `Plus que ${stock} en stock`, color: 'text-orange-500' }
    } else {
      return { status: 'in-stock', text: `${stock} en stock`, color: 'text-green-500' }
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const stockStatus = getStockStatus()

    // Vérifier si le produit est en stock
    if (stockStatus.status === 'out-of-stock') {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    // Ajouter au panier avec les détails extraits
    addToCart({
      productId: product.id,
      title: product.title,
      brand: getBrandFromTitle(product.title),
      price: product.price,
      image: product.images?.[0]?.url || '/api/placeholder/400/400',
      size: getSizeFromTitle(product.title),
      color: getColorFromTitle(product.title),
    })

    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Déterminer quelle image afficher
  const getCurrentImage = () => {
    if (!product.images || product.images.length === 0) {
      return null
    }

    if (isHovered && product.images.length > 1) {
      return product.images[1] // Deuxième image au hover
    }

    return product.images[0] // Première image par défaut
  }

  const currentImage = getCurrentImage()

  return (
    <>
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product.slug}`}>
          <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
            {/* Image Container */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              {currentImage ? (
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt || product.title}
                  fill
                  className="object-cover transition-all duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image non disponible</span>
                </div>
              )}

              {/* Badge NOUVEAU */}
              {product.isNewArrival && (
                <div className="absolute top-3 left-3 bg-white border border-black rounded-full px-3 py-1 z-10">
                  <span className="text-black text-xs font-medium uppercase tracking-wide">
                    Nouveau
                  </span>
                </div>
              )}

              {/* Bouton Ajouter au panier - visible au hover */}
              <div
                className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <button
                  onClick={handleAddToCart}
                  disabled={getStockStatus().status === 'out-of-stock'}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 flex items-center space-x-2 shadow-lg ${
                    getStockStatus().status === 'out-of-stock'
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {getStockStatus().status === 'out-of-stock'
                      ? 'Rupture de stock'
                      : 'Ajouter au panier'}
                  </span>
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-2">
              {/* Product Name */}
              <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors">
                {product.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center space-x-1">
                <div className="flex items-center">{renderStars(product.rating)}</div>
                <span className="text-gray-500 text-xs">({product.reviewCount || 0})</span>
              </div>

              {/* Price */}
              <div className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</div>

              {/* Stock Status */}
              <div className={`text-sm font-medium ${getStockStatus().color}`}>
                {getStockStatus().text}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Toast de confirmation */}
      {showToast && (
        <Toast
          message={
            getStockStatus().status === 'out-of-stock'
              ? `${product.title} - Rupture de stock`
              : `${product.title} ajouté au panier !`
          }
          type={getStockStatus().status === 'out-of-stock' ? 'error' : 'success'}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}
