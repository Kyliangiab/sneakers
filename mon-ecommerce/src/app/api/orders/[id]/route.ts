import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayload({ config })
    const { id } = await params

    const order = await payload.findByID({
      collection: 'orders',
      id: id,
      depth: 2, // Inclure les relations (produits, etc.)
    })

    return NextResponse.json({ docs: [order] })
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error)
    return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
  }
}
