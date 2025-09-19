import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password } = body

    // Validation des champs requis
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Validation du mot de passe (minimum 6 caractères)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Utiliser l'endpoint Payload natif pour créer l'utilisateur
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        password,
        role: 'client', // Rôle par défaut
      }),
    })

    const data = await response.json()

    if (response.ok) {
      // Succès - retourner les données formatées
      return NextResponse.json({
        success: true,
        message: 'Compte créé avec succès',
        user: {
          id: data.doc.id,
          name: data.doc.name,
          firstName: data.doc.firstName,
          lastName: data.doc.lastName,
          email: data.doc.email,
          role: data.doc.role,
        },
      })
    } else {
      // Erreur - retourner le message d'erreur
      const errorMessage = data.errors?.[0]?.message || 'Erreur lors de la création du compte'
      
      // Gestion des erreurs spécifiques
      if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        return NextResponse.json(
          { error: 'Un compte avec cet email existe déjà' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    )
  }
}
