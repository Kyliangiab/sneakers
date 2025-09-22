import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdef', {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'eur', metadata = {} } = body

    // Validation du montant
    if (!amount || amount < 50) {
      // Minimum 50 centimes
      return NextResponse.json({ error: 'Montant invalide' }, { status: 400 })
    }

    // Créer le Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir en centimes
      currency,
      metadata: {
        ...metadata,
        source: 'sneakers-ecommerce',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}

