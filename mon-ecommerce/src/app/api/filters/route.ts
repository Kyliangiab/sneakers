import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const payload = await getPayload({ config })

    // Construire la requête de base
    const queryOptions: any = {
      collection: 'products',
      limit: 1000, // Récupérer un grand nombre pour avoir toutes les variantes
      depth: 0,
    }

    // Ajouter un filtre par catégorie si spécifié
    if (category) {
      queryOptions.where = {
        category: {
          equals: category,
        },
      }
    }

    const products = await payload.find(queryOptions)

    // Extraire les données uniques pour les filtres
    const filters = {
      sizes: new Set<string>(),
      brands: new Set<string>(),
      colors: new Set<string>(),
      priceRange: { min: Infinity, max: 0 },
    }

    // Analyser tous les produits pour extraire les données de filtres
    products.docs.forEach((product: any) => {
      // Extraire les tailles depuis le titre (ex: "Junior Garçon" = tailles enfants)
      if (product.title) {
        const title = product.title.toLowerCase()
        
        // Logique pour déterminer les tailles basée sur le titre
        if (title.includes('junior') || title.includes('garçon') || title.includes('enfant')) {
          // Tailles enfants
          for (let i = 30; i <= 40; i += 0.5) {
            filters.sizes.add(i.toString())
          }
        } else if (title.includes('femme') || title.includes('dame')) {
          // Tailles femmes
          for (let i = 35; i <= 42; i += 0.5) {
            filters.sizes.add(i.toString())
          }
        } else {
          // Tailles hommes par défaut
          for (let i = 36; i <= 46; i += 0.5) {
            filters.sizes.add(i.toString())
          }
        }
      }

      // Extraire les marques depuis le titre
      if (product.title) {
        const title = product.title.toLowerCase()
        if (title.includes('nike')) filters.brands.add('Nike')
        if (title.includes('adidas')) filters.brands.add('adidas')
        if (title.includes('jordan')) filters.brands.add('Air Jordan')
        if (title.includes('new balance')) filters.brands.add('New Balance')
        if (title.includes('asics')) filters.brands.add('ASICS')
        if (title.includes('vans')) filters.brands.add('Vans')
        if (title.includes('converse')) filters.brands.add('Converse')
        if (title.includes('puma')) filters.brands.add('Puma')
        if (title.includes('reebok')) filters.brands.add('Reebok')
      }

      // Extraire les couleurs depuis le titre
      if (product.title) {
        const title = product.title.toLowerCase()
        if (title.includes('bleu')) filters.colors.add('Bleu')
        if (title.includes('noir')) filters.colors.add('Noir')
        if (title.includes('blanc')) filters.colors.add('Blanc')
        if (title.includes('rouge')) filters.colors.add('Rouge')
        if (title.includes('vert')) filters.colors.add('Vert')
        if (title.includes('gris')) filters.colors.add('Gris')
        if (title.includes('jaune')) filters.colors.add('Jaune')
        if (title.includes('orange')) filters.colors.add('Orange')
        if (title.includes('rose')) filters.colors.add('Rose')
        if (title.includes('violet')) filters.colors.add('Violet')
        if (title.includes('marron')) filters.colors.add('Marron')
        if (title.includes('beige')) filters.colors.add('Beige')
        if (title.includes('argent')) filters.colors.add('Argent')
        if (title.includes('multicolor') || title.includes('multicolore')) filters.colors.add('Multicolore')
      }

      // Calculer la plage de prix
      if (product.price && typeof product.price === 'number') {
        filters.priceRange.min = Math.min(filters.priceRange.min, product.price)
        filters.priceRange.max = Math.max(filters.priceRange.max, product.price)
      }
    })

    // Convertir les Sets en Arrays et trier
    const result = {
      sizes: Array.from(filters.sizes).sort((a, b) => {
        const numA = parseFloat(a)
        const numB = parseFloat(b)
        return numA - numB
      }),
      brands: Array.from(filters.brands).sort(),
      colors: Array.from(filters.colors).sort(),
      priceRange: {
        min: filters.priceRange.min === Infinity ? 0 : Math.floor(filters.priceRange.min),
        max: filters.priceRange.max === 0 ? 500 : Math.ceil(filters.priceRange.max),
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching filters from Payload:', error)

    // Fallback avec des données par défaut
    const fallbackFilters = {
      sizes: Array.from({ length: 20 }, (_, i) => (36 + i * 0.5).toString()),
      brands: ['ASICS', 'Air Jordan', 'New Balance', 'Nike', 'adidas'],
      colors: [
        'Argent',
        'Blanc',
        'Bleu',
        'Crème',
        'Cuivre',
        'Gris',
        'Jaune',
        'Marron',
        'Marron clair',
        'Multicolore',
        'Noir',
        'Orange',
        'Rose',
        'Rouge',
        'Vert',
        'Violet',
      ],
      priceRange: {
        min: 0,
        max: 500,
      },
    }

    return NextResponse.json(fallbackFilters)
  }
}
