'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import LoadingSpinner from '../../components/LoadingSpinner'
import Toast from '../../components/Toast'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  title: string
  slug: string
  price: number
  description: string
  shortDescription?: string
  category: string
  images: Array<{
    image: {
      url: string
      alt?: string
    }
    alt: string
  }>
  variants?: Array<{
    name: string
    value: string
    stock: number
    price?: number
  }>
  rating?: number
  reviewCount?: number
  isNewArrival?: boolean
  isFeatured?: boolean
}

interface RelatedProduct {
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
}

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const { addToCart } = useCart()

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)

      // Récupérer le produit par slug
      const response = await fetch(`/api/products/slug/${slug}`)
      if (!response.ok) {
        throw new Error('Produit non trouvé')
      }

      const data = await response.json()
      setProduct(data)

      // Récupérer des produits similaires
      await fetchRelatedProducts(data.category)
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (category: string) => {
    try {
      const response = await fetch(`/api/products?category=${category}&limit=4&random=true`)
      if (response.ok) {
        const data = await response.json()
        setRelatedProducts(data.docs || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits similaires:', error)
    }
  }

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
        className={`w-5 h-5 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getAvailableSizes = () => {
    if (!product?.variants) return []

    const sizes = product.variants
      .filter(
        (variant) =>
          variant.name.toLowerCase().includes('taille') ||
          variant.name.toLowerCase().includes('size'),
      )
      .map((variant) => variant.value)
      .filter((value, index, self) => self.indexOf(value) === index)

    return sizes
  }

  const getAvailableColors = () => {
    if (!product?.variants) return []

    const colors = product.variants
      .filter(
        (variant) =>
          variant.name.toLowerCase().includes('couleur') ||
          variant.name.toLowerCase().includes('color'),
      )
      .map((variant) => variant.value)
      .filter((value, index, self) => self.indexOf(value) === index)

    return colors
  }

  const getBrandFromTitle = (title: string) => {
    const titleLower = title.toLowerCase()

    // Marques connues
    if (titleLower.includes('jordan')) return 'Air Jordan'
    if (titleLower.includes('nike')) return 'Nike'
    if (titleLower.includes('adidas')) return 'Adidas'
    if (titleLower.includes('new balance')) return 'New Balance'
    if (titleLower.includes('vans')) return 'Vans'
    if (titleLower.includes('converse')) return 'Converse'
    if (titleLower.includes('puma')) return 'Puma'
    if (titleLower.includes('reebok')) return 'Reebok'
    if (titleLower.includes('asics')) return 'Asics'
    if (titleLower.includes('under armour')) return 'Under Armour'
    if (titleLower.includes('fila')) return 'Fila'
    if (titleLower.includes('champion')) return 'Champion'
    if (titleLower.includes('lacoste')) return 'Lacoste'
    if (titleLower.includes('timberland')) return 'Timberland'
    if (titleLower.includes('dr martens')) return 'Dr. Martens'
    if (titleLower.includes('clarks')) return 'Clarks'
    if (titleLower.includes('ecco')) return 'Ecco'
    if (titleLower.includes('geox')) return 'Geox'
    if (titleLower.includes('skechers')) return 'Skechers'
    if (titleLower.includes('salomon')) return 'Salomon'
    if (titleLower.includes('merrell')) return 'Merrell'
    if (titleLower.includes('columbia')) return 'Columbia'
    if (titleLower.includes('north face')) return 'The North Face'
    if (titleLower.includes('patagonia')) return 'Patagonia'
    if (titleLower.includes('superga')) return 'Superga'
    if (titleLower.includes('keds')) return 'Keds'
    if (titleLower.includes('sperry')) return 'Sperry'
    if (titleLower.includes('toms')) return 'TOMS'
    if (titleLower.includes('all star')) return 'Converse'
    if (titleLower.includes('chuck taylor')) return 'Converse'
    if (titleLower.includes('stan smith')) return 'Adidas'
    if (titleLower.includes('air max')) return 'Nike'
    if (titleLower.includes('air force')) return 'Nike'
    if (titleLower.includes('dunk')) return 'Nike'
    if (titleLower.includes('blazer')) return 'Nike'
    if (titleLower.includes('cortez')) return 'Nike'
    if (titleLower.includes('yeezy')) return 'Adidas'
    if (titleLower.includes('ultraboost')) return 'Adidas'
    if (titleLower.includes('gazelle')) return 'Adidas'
    if (titleLower.includes('samba')) return 'Adidas'
    if (titleLower.includes('shell toe')) return 'Adidas'
    if (titleLower.includes('old skool')) return 'Vans'
    if (titleLower.includes('sk8-hi')) return 'Vans'
    if (titleLower.includes('authentic')) return 'Vans'
    if (titleLower.includes('era')) return 'Vans'
    if (titleLower.includes('slip-on')) return 'Vans'

    // Essayer d'extraire la marque du titre (mot avant "--" ou " -")
    const parts = title.split(/[--]| -/)
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1].trim().toLowerCase()
      if (lastPart && lastPart.length > 2 && lastPart.length < 20) {
        // Capitaliser la première lettre de chaque mot
        return lastPart
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
    }

    // Essayer d'extraire le dernier mot significatif
    const words = title.split(/[\s-]+/)
    const lastWord = words[words.length - 1]?.toLowerCase()
    if (lastWord && lastWord.length > 2 && lastWord.length < 15 && !lastWord.match(/^\d+$/)) {
      return lastWord.charAt(0).toUpperCase() + lastWord.slice(1)
    }

    // Par défaut, essayer d'extraire le premier mot significatif après "Baskets et Sneakers"
    const titleWithoutPrefix = title.replace(/^baskets et sneakers\s*[-–]\s*/i, '')
    const firstWord = titleWithoutPrefix.split(/[\s-]+/)[0]
    if (firstWord && firstWord.length > 2 && firstWord.length < 15) {
      return firstWord.charAt(0).toUpperCase() + firstWord.slice(1)
    }

    return 'Marque inconnue'
  }

  const handleAddToCart = () => {
    if (!product) return

    // Vérifier qu'une taille est sélectionnée
    if (getAvailableSizes().length > 0 && !selectedSize) {
      setToastMessage('Veuillez sélectionner une taille')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    // Vérifier qu'une couleur est sélectionnée
    if (getAvailableColors().length > 0 && !selectedColor) {
      setToastMessage('Veuillez sélectionner une couleur')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    // Ajouter au panier
    addToCart({
      productId: product.id,
      title: product.title,
      brand: getBrandFromTitle(product.title),
      price: product.price,
      image: product.images[0]?.image?.url || '/api/placeholder/400/400',
      size: selectedSize || getAvailableSizes()[0] || '42',
      color: selectedColor || getAvailableColors()[0] || 'Blanc',
    })

    setToastMessage(`${product.title} ajouté au panier !`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.shortDescription,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Erreur lors du partage:', error)
      }
    } else {
      // Fallback: copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(window.location.href)
      setToastMessage('Lien copié dans le presse-papiers !')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    setToastMessage(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
            <p className="text-gray-600 mb-6">
              Le produit que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Link
              href="/products"
              className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
            >
              Voir tous les produits
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const availableSizes = getAvailableSizes()
  const availableColors = getAvailableColors()

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-orange-500">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-orange-500">
            Produits
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div
              className="relative aspect-square bg-white rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setShowImageModal(true)}
            >
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImageIndex]?.image?.url || '/api/placeholder/600/600'}
                  alt={product.images[selectedImageIndex]?.alt || product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Image non disponible</span>
                </div>
              )}

              {/* Badge NOUVEAU */}
              {product.isNewArrival && (
                <div className="absolute top-4 left-4 bg-white border border-black rounded-full px-3 py-1 z-10">
                  <span className="text-black text-xs font-medium uppercase tracking-wide">
                    Nouveau
                  </span>
                </div>
              )}
            </div>

            {/* Miniatures */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                      selectedImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.image?.url || '/api/placeholder/80/80'}
                      alt={image.alt || product.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            {/* Titre et marque */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-lg text-gray-600">{getBrandFromTitle(product.title)}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">{renderStars(product.rating)}</div>
              <span className="text-gray-600">({product.reviewCount || 0} avis)</span>
            </div>

            {/* Prix */}
            <div className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</div>

            {/* Description courte */}
            {product.shortDescription && (
              <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Variantes - Tailles */}
            {availableSizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Taille</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variantes - Couleurs */}
            {availableColors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Couleur</h3>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantité */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantité</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-orange-500 text-white py-4 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Ajouter au panier</span>
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={handleToggleFavorite}
                  className={`flex-1 py-3 px-4 border rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    isFavorite
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>Favoris</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Partager</span>
                </button>
              </div>
            </div>

            {/* Services */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Livraison gratuite à partir de 50€</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Garantie 2 ans</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Retour sous 30 jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description détaillée */}
        {product.description && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          </div>
        )}

        {/* Produits similaires */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.slug}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-square bg-gray-50">
                      {relatedProduct.images && relatedProduct.images.length > 0 ? (
                        <Image
                          src={relatedProduct.images[0].url}
                          alt={relatedProduct.images[0].alt || relatedProduct.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Image non disponible</span>
                        </div>
                      )}

                      {relatedProduct.isNewArrival && (
                        <div className="absolute top-2 left-2 bg-white border border-black rounded-full px-2 py-1">
                          <span className="text-black text-xs font-medium uppercase">Nouveau</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                        {relatedProduct.title}
                      </h3>
                      <div className="flex items-center space-x-1 mb-2">
                        <div className="flex items-center">
                          {renderStars(relatedProduct.rating)}
                        </div>
                        <span className="text-gray-500 text-xs">
                          ({relatedProduct.reviewCount || 0})
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(relatedProduct.price)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal d'image */}
      {showImageModal && product.images && product.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative">
              <Image
                src={product.images[selectedImageIndex]?.image?.url || '/api/placeholder/800/800'}
                alt={product.images[selectedImageIndex]?.alt || product.title}
                width={800}
                height={800}
                className="object-contain max-h-[80vh]"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(
                        Math.min(product.images.length - 1, selectedImageIndex + 1),
                      )
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <Toast message={toastMessage} type="success" onClose={() => setShowToast(false)} />
      )}

      <Footer />
    </div>
  )
}
