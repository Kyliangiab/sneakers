import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(request: NextRequest, { params }: { params: { params: string[] } }) {
  try {
    const filename = params.params.join('/')

    // Chemin vers le fichier média
    const filePath = path.join(process.cwd(), 'public', 'media', filename)

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`)

      // Rediriger vers l'API placeholder si le fichier n'existe pas
      const placeholderUrl = `/api/placeholder/400/400`
      return NextResponse.redirect(new URL(placeholderUrl, request.url))
    }

    // Lire le fichier
    const fileBuffer = fs.readFileSync(filePath)

    // Déterminer le type MIME
    const ext = path.extname(filename).toLowerCase()
    let contentType = 'application/octet-stream'

    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.png':
        contentType = 'image/png'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.webp':
        contentType = 'image/webp'
        break
      case '.svg':
        contentType = 'image/svg+xml'
        break
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving media file:', error)
    // En cas d'erreur, rediriger vers placeholder
    const placeholderUrl = `/api/placeholder/400/400`
    return NextResponse.redirect(new URL(placeholderUrl, request.url))
  }
}
