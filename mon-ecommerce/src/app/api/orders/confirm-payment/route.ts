import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdef', {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentIntentId, orderId } = body

    if (!paymentIntentId || !orderId) {
      return NextResponse.json({ error: 'Payment Intent ID et Order ID requis' }, { status: 400 })
    }

    // Vérifier le statut du paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 400 })
    }

    // Initialiser Payload
    const payload = await getPayload({ config })

    // Mettre à jour la commande
    const updatedOrder = await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        status: 'confirmed', // Commande confirmée
        paymentStatus: 'paid', // Paiement confirmé
        paymentDate: new Date().toISOString(),
      },
    })

    // TODO: Envoyer email de confirmation
    // TODO: Mettre à jour les stocks des produits

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
      },
    })
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la confirmation du paiement' },
      { status: 500 },
    )
  }
}

