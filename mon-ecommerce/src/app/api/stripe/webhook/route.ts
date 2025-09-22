import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })

  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 })
  }

  const body = await req.text()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET non configuré')
    return NextResponse.json({ error: 'Configuration webhook manquante' }, { status: 500 })
  }

  let event: any

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('Erreur de vérification du webhook:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  console.log('Webhook reçu:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const orderId = session.metadata?.orderId

        if (orderId) {
          // Mettre à jour la commande comme payée
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: {
              status: 'PAID',
              stripePaymentIntentId: session.payment_intent?.toString() || null,
            },
          })

          console.log(`Commande ${orderId} marquée comme payée`)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        const orderId = paymentIntent.metadata?.orderId

        if (orderId) {
          // Marquer la commande comme échouée
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: {
              status: 'FAILED',
            },
          })

          console.log(`Commande ${orderId} marquée comme échouée`)
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object
        const orderId = session.metadata?.orderId

        if (orderId) {
          // Marquer la commande comme annulée si la session a expiré
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: {
              status: 'cancelled',
            },
          })

          console.log(`Commande ${orderId} marquée comme annulée (session expirée)`)
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        const orderId = paymentIntent.metadata?.orderId

        if (orderId) {
          // Marquer la commande comme payée
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: {
              status: 'PAID',
              stripePaymentIntentId: paymentIntent.id,
            },
          })

          console.log(`Commande ${orderId} marquée comme payée (payment_intent.succeeded)`)
        }
        break
      }

      default:
        console.log(`Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error)
    return NextResponse.json({ error: 'Erreur lors du traitement du webhook' }, { status: 500 })
  }
}
