'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Home, Filter, X, Search, ChevronUp, ChevronDown } from 'lucide-react'
import ProductCard from '../../components/ProductCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

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
  search: string
  size: string[]
  brand: string[]
  color: string[]
  priceRange: [number, number]
  inStockOnly: boolean
}

interface FilterSection {
  search: boolean
  size: boolean
  brand: boolean
  color: boolean
  price: boolean
}

export default function HommeProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [hasMoreProducts, setHasMoreProducts] = useState(true)
  const [sortBy, setSortBy] = useState('initial')
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    size: [],
    brand: [],
    color: [],
    priceRange: [0, 500],
    inStockOnly: false,
  })
  const [activeFilters, setActiveFilters] = useState(1) // Nombre de filtres actifs
  const [expandedSections, setExpandedSections] = useState<FilterSection>({
    search: true,
    size: true,
    brand: false,
    color: false,
    price: false,
  })

  // Données pour les filtres (récupérées depuis la DB)
  const [filterData, setFilterData] = useState({
    sizes: [] as string[],
    brands: [] as string[],
    colors: [] as string[],
    priceRange: { min: 0, max: 500 },
  })

  // Récupérer les données de filtres depuis la DB
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await fetch('/api/filters?category=homme')
        const data = await response.json()
        setFilterData(data)

        // Mettre à jour la plage de prix par défaut
        setFilters((prev) => ({
          ...prev,
          priceRange: [data.priceRange.min, data.priceRange.max],
        }))
      } catch (error) {
        console.error('Error fetching filter data:', error)
      }
    }

    fetchFilterData()
  }, [])

  // Récupérer les produits homme avec filtres
  useEffect(() => {
    const fetchProducts = async (page = 1, append = false) => {
      if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      try {
        // Construire les paramètres de requête
        const params = new URLSearchParams({
          limit: '12',
          page: page.toString(),
          category: 'homme',
        })

        if (filters.search) params.append('search', filters.search)
        if (filters.size.length > 0) params.append('sizes', filters.size.join(','))
        if (filters.brand.length > 0) params.append('brands', filters.brand.join(','))
        if (filters.color.length > 0) params.append('colors', filters.color.join(','))
        if (filters.priceRange[0] > 0) params.append('minPrice', filters.priceRange[0].toString())
        if (filters.priceRange[1] < 500) params.append('maxPrice', filters.priceRange[1].toString())

        const response = await fetch(`/api/products?${params.toString()}`)
        const data = await response.json()

        if (append) {
          setProducts((prev) => [...prev, ...(data.docs || [])])
        } else {
          setProducts(data.docs || [])
        }

        setTotalProducts(data.totalDocs || 0)
        setHasMoreProducts(data.hasNextPage || false)
        setCurrentPage(page)
      } catch (error) {
        console.error('Error fetching products:', error)
        // En cas d'erreur, afficher un message d'erreur
        setProducts([])
      }
      setLoading(false)
      setLoadingMore(false)
    }

    // Reset pagination quand les filtres changent
    if (currentPage === 1) {
      fetchProducts(1, false)
    } else {
      setCurrentPage(1)
      fetchProducts(1, false)
    }
  }, [filters]) // Re-fetch quand les filtres changent

  // Fonction pour charger plus de produits
  const loadMoreProducts = () => {
    if (!loadingMore && hasMoreProducts) {
      fetchProducts(currentPage + 1, true)
    }
  }

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const toggleSection = (section: keyof FilterSection) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSizeSelect = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      size: prev.size.includes(size) ? prev.size.filter((s) => s !== size) : [...prev.size, size],
    }))
  }

  const handleBrandSelect = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brand: prev.brand.includes(brand)
        ? prev.brand.filter((b) => b !== brand)
        : [...prev.brand, brand],
    }))
  }

  const handleColorSelect = (color: string) => {
    setFilters((prev) => ({
      ...prev,
      color: prev.color.includes(color)
        ? prev.color.filter((c) => c !== color)
        : [...prev.color, color],
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      size: [],
      brand: [],
      color: [],
      priceRange: [filterData.priceRange.min, filterData.priceRange.max],
      inStockOnly: false,
    })
    setActiveFilters(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-700">
              <Home className="w-4 h-4 inline-block mr-1" /> Accueil
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Chaussures Homme</span>
          </nav>

          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Chaussures Homme</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Affiner Les Résultats</h2>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Effacer tout ({activeFilters})
                </button>
              </div>

              {/* Filter Options */}
              <div className="space-y-6">
                {/* Recherche */}
                <div>
                  <button
                    onClick={() => toggleSection('search')}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
                  >
                    <span>Recherche</span>
                    {expandedSections.search ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {expandedSections.search && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>

                {/* Taille */}
                <div>
                  <button
                    onClick={() => toggleSection('size')}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
                  >
                    <span>Taille</span>
                    {expandedSections.size ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {expandedSections.size && (
                    <div className="grid grid-cols-3 gap-2">
                      {filterData.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(size)}
                          className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                            filters.size.includes(size)
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Marque */}
                <div>
                  <button
                    onClick={() => toggleSection('brand')}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
                  >
                    <span>Marque</span>
                    {expandedSections.brand ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {expandedSections.brand && (
                    <div className="space-y-2">
                      {filterData.brands.map((brand) => (
                        <label key={brand} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.brand.includes(brand)}
                            onChange={() => handleBrandSelect(brand)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{brand}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Couleur */}
                <div>
                  <button
                    onClick={() => toggleSection('color')}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
                  >
                    <span>Couleur</span>
                    {expandedSections.color ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {expandedSections.color && (
                    <div className="space-y-2">
                      {filterData.colors.map((color) => (
                        <label key={color} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.color.includes(color)}
                            onChange={() => handleColorSelect(color)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{color}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Prix */}
                <div>
                  <button
                    onClick={() => toggleSection('price')}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
                  >
                    <span>Prix</span>
                    {expandedSections.price ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {expandedSections.price && (
                    <div className="space-y-4">
                      {/* Slider de prix */}
                      <div className="relative">
                        <input
                          type="range"
                          min={filterData.priceRange.min}
                          max={filterData.priceRange.max}
                          value={filters.priceRange[1]}
                          onChange={(e) =>
                            handleFilterChange('priceRange', [
                              filters.priceRange[0],
                              parseInt(e.target.value),
                            ])
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>{filterData.priceRange.min}€</span>
                          <span>{filterData.priceRange.max}€</span>
                        </div>
                      </div>

                      {/* Inputs min/max */}
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">Min:</label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              min={filterData.priceRange.min}
                              max={filterData.priceRange.max}
                              value={filters.priceRange[0]}
                              onChange={(e) =>
                                handleFilterChange('priceRange', [
                                  parseInt(e.target.value) || filterData.priceRange.min,
                                  filters.priceRange[1],
                                ])
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="ml-1 text-sm text-gray-600">€</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">Max:</label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              min={filterData.priceRange.min}
                              max={filterData.priceRange.max}
                              value={filters.priceRange[1]}
                              onChange={(e) =>
                                handleFilterChange('priceRange', [
                                  filters.priceRange[0],
                                  parseInt(e.target.value) || filterData.priceRange.max,
                                ])
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="ml-1 text-sm text-gray-600">€</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* En stock uniquement */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">En stock uniquement</span>
                </label>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{totalProducts} résultats</span>
                  {activeFilters > 0 && (
                    <span className="text-sm text-gray-600">
                      {activeFilters} filtre{activeFilters > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="initial">Résultats initiaux</option>
                    <option value="price-asc">Prix: du plus bas au plus haut</option>
                    <option value="price-desc">Prix: du plus haut au plus bas</option>
                    <option value="newest">Nouveautés</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                </div>
              )}

              {/* Load More Button */}
              {hasMoreProducts && (
                <div className="mt-12 text-center">
                  <button
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Chargement...
                      </div>
                    ) : (
                      'Charger plus de produits'
                    )}
                  </button>
                </div>
              )}

              {/* End of results message */}
              {!hasMoreProducts && products.length > 0 && (
                <div className="mt-12 text-center text-gray-500">
                  <p>Tous les produits ont été chargés</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
