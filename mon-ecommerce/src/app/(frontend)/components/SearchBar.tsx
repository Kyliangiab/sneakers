'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { useDebounce } from '@/utilities/useDebounce'

interface SearchResult {
  id: string
  title: string
  slug: string
  price: number
  images?: Array<{
    url: string
    alt?: string
  }>
  category: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Debounce la recherche pour éviter trop de requêtes
  const debouncedQuery = useDebounce(query, 300)

  // Recherche des produits
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchProducts(debouncedQuery)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [debouncedQuery])

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchProducts = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=8`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.docs || [])
        setIsOpen(true)
        setSelectedIndex(-1)
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleProductClick(results[selectedIndex])
        } else if (query.trim()) {
          handleSearchSubmit()
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleProductClick = (product: SearchResult) => {
    router.push(`/product/${product.slug}`)
    setQuery('')
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const handleSearchSubmit = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setIsOpen(false)
      setSelectedIndex(-1)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  return (
    <div ref={searchRef} className="relative flex-1 max-w-lg mx-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) {
              setIsOpen(true)
            }
          }}
          placeholder="Rechercher des sneakers..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        />
        
        {query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Dropdown des résultats */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-96 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {results.map((product, index) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className={`cursor-pointer select-none relative py-3 px-4 hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-orange-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Image du produit */}
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">IMG</span>
                    </div>
                  )}
                </div>
                
                {/* Informations du produit */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.title}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {product.category}
                  </p>
                </div>
                
                {/* Prix */}
                <div className="flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Lien "Voir tous les résultats" */}
          {query.trim() && (
            <div className="border-t border-gray-100">
              <button
                onClick={handleSearchSubmit}
                className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 font-medium"
              >
                Voir tous les résultats pour "{query}"
              </button>
            </div>
          )}
        </div>
      )}

      {/* Message si aucun résultat */}
      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md py-3 px-4 text-sm text-gray-500">
          Aucun produit trouvé pour "{query}"
        </div>
      )}
    </div>
  )
}
