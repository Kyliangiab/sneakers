import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { cartItems, customerEmail, shippingAddress, billingAddress, userEmail } =
      await req.json()

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    if (!customerEmail) {
      return NextResponse.json({ error: 'Email client requis' }, { status: 400 })
    }

    if (!userEmail) {
      return NextResponse.json({ error: 'Utilisateur non connecté' }, { status: 401 })
    }

    // Récupérer l'ID Payload de l'utilisateur par son email
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: userEmail,
        },
      },
      limit: 1,
    })

    if (users.docs.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const payloadUserId = users.docs[0].id

    // Calculer les totaux
    const subtotal = cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    )
    const shipping = 0 // MVP: livraison gratuite
    const taxRate = 0.2 // TVA française 20%
    const tax = Math.round(subtotal * taxRate * 100) / 100 // Arrondir à 2 décimales
    const total = subtotal + shipping + tax

    // Générer un numéro de commande unique
    const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Créer la commande dans Payload
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customerEmail,
        customer: payloadUserId, // Lier à l'utilisateur Payload
        items: cartItems.map((item: any) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shipping,
        tax,
        total,
        status: 'REQUIRES_PAYMENT',
        shippingAddress: shippingAddress || null,
        billingAddress: billingAddress || null,
      },
    })

    // Créer la session Stripe
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Préparer les line items pour Stripe
    const lineItems = cartItems.map((item: any) => {
      // Vérifier que l'image est une URL valide
      let imageUrl = null
      if (item.image && item.image.startsWith('http')) {
        imageUrl = item.image
      } else if (item.image && item.image.startsWith('/')) {
        imageUrl = `${baseUrl}${item.image}`
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.title,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convertir en centimes
        },
        quantity: item.quantity,
      }
    })
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: `${baseUrl}/order-confirmation?orderId=${order.id}`,
      cancel_url: `${baseUrl}/checkout`,
      automatic_tax: {
        enabled: true,
      },
      tax_id_collection: {
        enabled: true,
      },
      metadata: {
        orderId: order.id,
        orderNumber: orderNumber,
      },
    })

    // Mettre à jour la commande avec l'ID de session Stripe
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        stripeCheckoutSessionId: session.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 },
    )
  }
}
