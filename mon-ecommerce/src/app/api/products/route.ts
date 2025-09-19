import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    const random = searchParams.get('random') === 'true'
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sizes = searchParams.get('sizes')?.split(',')
    const brands = searchParams.get('brands')?.split(',')
    const colors = searchParams.get('colors')?.split(',')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const inStockOnly = searchParams.get('inStockOnly') === 'true'

    console.log('Fetching products from Payload CMS...')

    // Initialiser Payload
    const payload = await getPayload({ config })

    // Construire les options de requête
    const queryOptions: any = {
      limit: limit,
      page: page,
      sort: '-createdAt', // Les plus récents en premier
      depth: 1, // Inclure les relations
    }

    // Construire les conditions de filtrage
    const whereConditions: any = {}

    if (category) {
      whereConditions.category = {
        equals: category,
      }
    }

    if (search) {
      whereConditions.title = {
        contains: search,
      }
    }

    if (minPrice || maxPrice) {
      whereConditions.price = {}
      if (minPrice) {
        whereConditions.price.greater_than_equal = parseInt(minPrice)
      }
      if (maxPrice) {
        whereConditions.price.less_than_equal = parseInt(maxPrice)
      }
    }

    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions
    }

    // Récupérer les produits avec filtrage côté serveur pour la catégorie
    const allProductsResult = await payload.find({
      collection: 'products',
      limit: 1000, // Récupérer un grand nombre pour avoir tous les produits
      depth: 1,
      where: whereConditions, // Appliquer le filtrage côté serveur
    })

    console.log(
      'All products fetched from Payload:',
      allProductsResult.docs?.length || 0,
      'products',
    )

    // Filtrer côté client pour les critères complexes (tailles, marques, couleurs)
    let filteredDocs = allProductsResult.docs || []

    if (sizes && sizes.length > 0) {
      filteredDocs = filteredDocs.filter((product: any) => {
        const title = product.title.toLowerCase()
        // Logique simple : si le produit contient des mots-clés de taille
        return sizes.some((size) => {
          const sizeNum = parseFloat(size)
          if (title.includes('junior') || title.includes('garçon')) {
            return sizeNum >= 30 && sizeNum <= 40
          } else if (title.includes('femme')) {
            return sizeNum >= 35 && sizeNum <= 42
          } else {
            return sizeNum >= 36 && sizeNum <= 46
          }
        })
      })
    }

    if (brands && brands.length > 0) {
      filteredDocs = filteredDocs.filter((product: any) => {
        const title = product.title.toLowerCase()
        return brands.some((brand) => {
          const brandLower = brand.toLowerCase()
          if (brandLower === 'air jordan') return title.includes('jordan')
          if (brandLower === 'new balance') return title.includes('new balance')
          return title.includes(brandLower)
        })
      })
    }

    if (colors && colors.length > 0) {
      filteredDocs = filteredDocs.filter((product: any) => {
        const title = product.title.toLowerCase()
        return colors.some((color) => {
          const colorLower = color.toLowerCase()
          return title.includes(colorLower)
        })
      })
    }

    // Appliquer la pagination aux documents filtrés
    const totalFilteredDocs = filteredDocs.length
    const totalPages = Math.ceil(totalFilteredDocs / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedDocs = filteredDocs.slice(startIndex, endIndex)

    // Si random=true, mélanger les résultats
    if (random && paginatedDocs) {
      paginatedDocs.sort(() => Math.random() - 0.5)
    }

    // Construire le résultat final avec pagination
    const result = {
      docs: paginatedDocs,
      totalDocs: totalFilteredDocs,
      limit: limit,
      totalPages: totalPages,
      page: page,
      pagingCounter: startIndex + 1,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    }

    // Transformer les données Payload pour correspondre au format attendu
    if (result.docs) {
      result.docs = result.docs.map((product: any) => ({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price || 0,
        rating: product.rating || 4.5,
        reviewCount: product.reviewCount || 0,
        isNewArrival: product.isNewArrival || false,
        category: product.category || 'homme',
        images: product.images?.map((img: any) => ({
          url: img.image?.url || img.url || '/api/placeholder/400/400',
          alt: img.alt || img.image?.alt || product.title,
        })) || [{ url: '/api/placeholder/400/400', alt: product.title }],
      }))
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching products from Payload:', error)

    // Fallback: retourner des produits mockés en cas d'erreur
    const mockProducts = {
      docs: [
        {
          id: '1',
          title: 'Air Jordan 1 Retro High OG',
          slug: 'air-jordan-1-retro-high-og',
          price: 150,
          rating: 4.8,
          reviewCount: 1247,
          isNewArrival: true,
          category: 'homme',
          images: [{ url: '/api/placeholder/400/400', alt: 'Air Jordan 1' }],
        },
        {
          id: '2',
          title: 'Nike Air Max 90 Essential',
          slug: 'nike-air-max-90-essential',
          price: 120,
          rating: 4.6,
          reviewCount: 892,
          isNewArrival: false,
          category: 'homme',
          images: [{ url: '/api/placeholder/400/400', alt: 'Air Max 90' }],
        },
        {
          id: '3',
          title: 'Adidas Ultraboost 22',
          slug: 'adidas-ultraboost-22',
          price: 180,
          rating: 4.9,
          reviewCount: 2156,
          isNewArrival: true,
          category: 'femme',
          images: [{ url: '/api/placeholder/400/400', alt: 'Ultraboost 22' }],
        },
        {
          id: '4',
          title: 'New Balance 550 White',
          slug: 'new-balance-550-white',
          price: 110,
          rating: 4.5,
          reviewCount: 634,
          isNewArrival: false,
          category: 'enfants',
          images: [{ url: '/api/placeholder/400/400', alt: 'New Balance 550' }],
        },
      ],
      totalDocs: 4,
      limit: limit,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }

    return NextResponse.json(mockProducts)
  }
}
