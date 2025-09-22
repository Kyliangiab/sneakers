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

    let fixedCount = 0
    const results = []

    for (const order of orders.docs) {
      // Trouver l'utilisateur correspondant à l'email de la commande
      const correctUser = users.docs.find((user) => user.email === order.customerEmail)

      if (correctUser) {
        // Vérifier si la commande est liée au bon utilisateur
        const currentCustomer =
          typeof order.customer === 'object' ? order.customer.id : order.customer

        if (currentCustomer !== correctUser.id) {
          // Corriger la liaison
          await payload.update({
            collection: 'orders',
            id: order.id,
            data: {
              customer: correctUser.id,
            },
          })

          fixedCount++
          results.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerEmail: order.customerEmail,
            oldUserId: currentCustomer,
            newUserId: correctUser.id,
            newUserEmail: correctUser.email,
            action: 'Corrigé',
          })

          console.log(
            `Commande ${order.orderNumber} corrigée: liée à ${correctUser.email} (ID: ${correctUser.id})`,
          )
        } else {
          results.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerEmail: order.customerEmail,
            userId: correctUser.id,
            status: 'Déjà correct',
          })
        }
      } else {
        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerEmail: order.customerEmail,
          error: 'Aucun utilisateur trouvé avec cet email',
        })
      }
    }

    return NextResponse.json({
      message: `${fixedCount} commandes corrigées avec succès`,
      totalOrders: orders.docs.length,
      fixedCount,
      results,
    })
  } catch (error) {
    console.error('Erreur lors de la correction des commandes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la correction des commandes' },
      { status: 500 },
    )
  }
}
