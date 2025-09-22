import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const formData = await req.formData()

    // Extraire les données du formulaire
    const customerEmail = formData.get('customerEmail') as string
    const customerPhone = formData.get('customerPhone') as string
    const shoeDetailsStr = formData.get('shoeDetails') as string
    const shippingAddressStr = formData.get('shippingAddress') as string

    if (!customerEmail || !shoeDetailsStr) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    const shoeDetails = JSON.parse(shoeDetailsStr)
    const shippingAddress = JSON.parse(shippingAddressStr)

    // Extraire les images
    const images: File[] = []
    let imageIndex = 0
    while (formData.has(`image_${imageIndex}`)) {
      const image = formData.get(`image_${imageIndex}`) as File
      if (image) {
        images.push(image)
      }
      imageIndex++
    }

    if (images.length < 4) {
      return NextResponse.json({ error: 'Au moins 4 photos sont requises' }, { status: 400 })
    }

    // Upload des images vers Payload Media
    const uploadedImages = []
    for (const image of images) {
      try {
        const buffer = await image.arrayBuffer()
        const uploadedImage = await payload.create({
          collection: 'media',
          data: {
            alt: `Photo de ${shoeDetails.brand} ${shoeDetails.model}`,
          },
          file: {
            data: Buffer.from(buffer),
            mimetype: image.type,
            name: image.name,
            size: image.size,
          },
        })
        uploadedImages.push({
          image: uploadedImage.id,
          description: `Photo de la chaussure`,
        })
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image:", error)
        return NextResponse.json({ error: "Erreur lors de l'upload des images" }, { status: 500 })
      }
    }

    // Essayer de trouver l'utilisateur par email
    let customerId = null
    try {
      const userResponse = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: customerEmail,
          },
        },
        limit: 1,
      })
      
      if (userResponse.docs.length > 0) {
        customerId = userResponse.docs[0].id
      }
    } catch (error) {
      console.log('Utilisateur non trouvé, création sans relation client')
    }

    // Créer la demande de reprise
    const reprise = await payload.create({
      collection: 'reprises',
      data: {
        ...(customerId && { customer: customerId }), // Ajouter la relation seulement si l'utilisateur existe
        customerEmail,
        customerPhone: customerPhone || '',
        shoeDetails: {
          brand: shoeDetails.brand,
          model: shoeDetails.model,
          size: shoeDetails.size,
          color: shoeDetails.color,
          condition: shoeDetails.condition,
          purchaseDate: shoeDetails.purchaseDate || null,
          purchasePrice: shoeDetails.purchasePrice || 0,
          originalBox: shoeDetails.originalBox || false,
          originalReceipt: shoeDetails.originalReceipt || false,
        },
        images: uploadedImages,
        shipping: {
          shippingAddress: {
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
          },
        },
        status: 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      reference: reprise.reference,
      message: 'Demande de reprise créée avec succès',
    })
  } catch (error) {
    console.error('Erreur lors de la création de la reprise:', error)
    return NextResponse.json({ error: 'Erreur lors de la création de la demande' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(req.url)
    const customerEmail = searchParams.get('customerEmail')

    if (!customerEmail) {
      return NextResponse.json({ error: 'Email client requis' }, { status: 400 })
    }

    const reprises = await payload.find({
      collection: 'reprises',
      where: {
        customerEmail: {
          equals: customerEmail,
        },
      },
      sort: '-createdAt',
      limit: 50,
    })

    return NextResponse.json(reprises)
  } catch (error) {
    console.error('Erreur lors de la récupération des reprises:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des reprises' },
      { status: 500 },
    )
  }
}
