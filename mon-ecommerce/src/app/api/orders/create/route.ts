import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customerEmail, shippingAddress, billingAddress, paymentIntentId, totalAmount } =
      body

    // Validation des données
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Aucun article dans la commande' }, { status: 400 })
    }

    if (!customerEmail || !shippingAddress) {
      return NextResponse.json(
        { error: 'Email client et adresse de livraison requis' },
        { status: 400 },
      )
    }

    // Initialiser Payload
    const payload = await getPayload({ config })

    // Générer un numéro de commande unique
    const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Créer la commande
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customerEmail,
        items: items.map((item: any) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        subtotal: totalAmount,
        shipping: 0, // Gratuit si > 150€
        tax: totalAmount * 0.2, // TVA 20%
        total: totalAmount + totalAmount * 0.2,
        status: 'pending', // En attente de paiement
        shippingAddress: {
          type: 'shipping',
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || 'France',
        },
        billingAddress: billingAddress
          ? {
              type: 'billing',
              address: billingAddress.address,
              city: billingAddress.city,
              postalCode: billingAddress.postalCode,
              country: billingAddress.country || 'France',
            }
          : undefined,
        paymentIntentId,
        paymentStatus: 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
      },
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 },
    )
  }
}

