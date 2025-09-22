import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Récupérer toutes les commandes pour debug
    const orders = await payload.find({
      collection: 'orders',
      limit: 100,
      depth: 2, // Inclure les relations
    })

    console.log(
      'Toutes les commandes:',
      orders.docs.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerEmail: o.customerEmail,
        customer: o.customer,
        status: o.status,
        total: o.total,
      })),
    )

    return NextResponse.json({
      total: orders.totalDocs,
      orders: orders.docs.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerEmail: o.customerEmail,
        customer: o.customer,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt,
      })),
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 },
    )
  }
}
