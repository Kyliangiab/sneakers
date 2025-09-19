import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation des champs requis
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe sont requis' },
        { status: 400 }
      )
    }

    // Utiliser l'endpoint Payload natif
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      // Succès - retourner les données formatées
      return NextResponse.json({
        success: true,
        message: 'Connexion réussie',
        user: {
          id: data.user.id,
          name: data.user.name,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          role: data.user.role,
        },
        token: data.token,
      })
    } else {
      // Erreur - retourner le message d'erreur
      const errorMessage = data.errors?.[0]?.message || 'Email ou mot de passe incorrect'
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
