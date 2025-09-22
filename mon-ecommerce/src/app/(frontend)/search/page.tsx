'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, X, ChevronRight, Home } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Header from '../components/Header'
import Footer from '../components/Footer'

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
  category?: string
}

interface FilterState {
  category: string[]
  priceRange: [number, number]
  brands: string[]
  colors: string[]
  sizes: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    priceRange: [0, 1000],
    brands: [],
    colors: [],
    sizes: [],
  })

  useEffect(() => {
    if (query) {
      searchProducts()
    }
  }, [query, currentPage, filters])

  const searchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: query,
        page: currentPage.toString(),
        limit: '12',
      })

      // Ajouter les filtres
      if (filters.category.length > 0) {
        params.append('category', filters.category.join(','))
      }
      if (filters.brands.length > 0) {
        params.append('brands', filters.brands.join(','))
      }
      if (filters.colors.length > 0) {
        params.append('colors', filters.colors.join(','))
      }
      if (filters.sizes.length > 0) {
        params.append('sizes', filters.sizes.join(','))
      }
      if (filters.priceRange[0] > 0) {
        params.append('minPrice', filters.priceRange[0].toString())
      }
      if (filters.priceRange[1] < 1000) {
        params.append('maxPrice', filters.priceRange[1].toString())
      }

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.docs || [])
        setTotalResults(data.totalDocs || 0)
        setHasMore(data.hasNextPage || false)
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
    setCurrentPage(1) // Reset à la première page
  }

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 1000],
      brands: [],
      colors: [],
      sizes: [],
    })
    setCurrentPage(1)
  }

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1)
  }

  if (loading && currentPage === 1) {
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
          <span className="text-gray-900">Recherche</span>
        </nav>

        {/* Header de recherche */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-6 h-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">Résultats pour "{query}"</h1>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {totalResults} produit{totalResults > 1 ? 's' : ''} trouvé
              {totalResults > 1 ? 's' : ''}
            </p>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filtres */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Effacer tout
                </button>
              </div>

              {/* Filtre Catégorie */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Catégorie</h3>
                <div className="space-y-2">
                  {['homme', 'femme', 'enfants', 'unisexe'].map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(category)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...filters.category, category]
                            : filters.category.filter((c) => c !== category)
                          handleFilterChange('category', newCategories)
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtre Prix */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Prix</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      handleFilterChange('priceRange', [
                        filters.priceRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{filters.priceRange[0]}€</span>
                    <span>{filters.priceRange[1]}€</span>
                  </div>
                </div>
              </div>

              {/* Filtre Marques */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Marques</h3>
                <div className="space-y-2">
                  {['Nike', 'Adidas', 'Vans', 'Converse', 'New Balance', 'Puma'].map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={(e) => {
                          const newBrands = e.target.checked
                            ? [...filters.brands, brand]
                            : filters.brands.filter((b) => b !== brand)
                          handleFilterChange('brands', newBrands)
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche ou vos filtres.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <>
                {/* Grille de produits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Bouton "Voir plus" */}
                {hasMore && (
                  <div className="text-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Chargement...' : 'Voir plus de produits'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
