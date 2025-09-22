import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    console.log('Recherche utilisateur avec email:', email)

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    // Récupérer l'utilisateur par son email
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    console.log('Utilisateurs trouvés:', users.docs.length)

    if (users.docs.length === 0) {
      console.log("Aucun utilisateur trouvé pour l'email:", email)
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const user = users.docs[0]
    console.log('Utilisateur trouvé:', { id: user.id, email: user.email })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name || user.firstName + ' ' + user.lastName,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'utilisateur" },
      { status: 500 },
    )
  }
}
