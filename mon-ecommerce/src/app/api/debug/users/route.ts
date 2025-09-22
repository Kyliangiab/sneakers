import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Récupérer tous les utilisateurs pour debug
    const users = await payload.find({
      collection: 'users',
      limit: 10,
    })

    console.log(
      'Tous les utilisateurs:',
      users.docs.map((u) => ({ id: u.id, email: u.email, name: u.name })),
    )

    return NextResponse.json({
      total: users.totalDocs,
      users: users.docs.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name || `${u.firstName} ${u.lastName}`.trim(),
      })),
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 },
    )
  }
}
