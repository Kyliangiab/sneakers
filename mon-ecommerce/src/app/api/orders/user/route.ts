import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 })
    }

    // Récupérer les commandes de l'utilisateur
    const orders = await payload.find({
      collection: 'orders',
      where: {
        customer: {
          equals: userId,
        },
      },
      sort: '-createdAt', // Les plus récentes en premier
      depth: 2, // Inclure les relations (produits, etc.)
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    )
  }
}
