import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const payload = await getPayload({ config })
    const { slug } = await params

    console.log('Recherche du produit avec le slug:', slug)

    // Récupérer le produit par slug
    const products = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 2, // Inclure les relations (images, etc.)
    })

    if (products.docs.length === 0) {
      console.log('Aucun produit trouvé pour le slug:', slug)
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
    }

    const product = products.docs[0]
    console.log('Produit trouvé:', { id: product.id, title: product.title, slug: product.slug })

    // Transformer les données pour correspondre au format attendu
    const transformedProduct = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price || 0,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      category: product.category || 'homme',
      images: product.images?.map((img: any) => ({
        image: {
          url: img.image?.url || '/api/placeholder/400/400',
          alt: img.image?.alt || product.title,
        },
        alt: img.alt || product.title,
      })) || [],
      variants: product.variants || [],
      rating: product.rating || 4.5,
      reviewCount: product.reviewCount || 0,
      isNewArrival: product.isNewArrival || false,
      isFeatured: product.isFeatured || false,
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    )
  }
}
