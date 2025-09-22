import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Récupérer toutes les commandes
    const orders = await payload.find({
      collection: 'orders',
      limit: 100,
    })

    // Récupérer tous les utilisateurs
    const users = await payload.find({
      collection: 'users',
      limit: 100,
    })

    console.log(`Trouvé ${orders.docs.length} commandes et ${users.docs.length} utilisateurs`)

    let linkedCount = 0
    const results = []

    for (const order of orders.docs) {
      // Si la commande n'a pas de customer lié
      if (!order.customer) {
        // Essayer de trouver un utilisateur par email
        const matchingUser = users.docs.find((user) => user.email === order.customerEmail)

        if (matchingUser) {
          // Lier la commande à l'utilisateur
          await payload.update({
            collection: 'orders',
            id: order.id,
            data: {
              customer: matchingUser.id,
            },
          })

          linkedCount++
          results.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerEmail: order.customerEmail,
            linkedToUserId: matchingUser.id,
            linkedToUserEmail: matchingUser.email,
          })

          console.log(`Commande ${order.orderNumber} liée à l'utilisateur ${matchingUser.email}`)
        } else {
          results.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerEmail: order.customerEmail,
            error: 'Aucun utilisateur trouvé avec cet email',
          })
        }
      } else {
        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerEmail: order.customerEmail,
          status: 'Déjà liée',
          linkedToUserId: order.customer,
        })
      }
    }

    return NextResponse.json({
      message: `${linkedCount} commandes liées avec succès`,
      totalOrders: orders.docs.length,
      linkedCount,
      results,
    })
  } catch (error) {
    console.error('Erreur lors de la liaison des commandes:', error)
    return NextResponse.json({ error: 'Erreur lors de la liaison des commandes' }, { status: 500 })
  }
}
