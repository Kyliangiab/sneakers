import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> },
) {
  try {
    const { params: pathParams } = await params
    const dimensions = pathParams.join('/')
    const [width, height] = dimensions.split('/').map(Number)

    if (!width || !height || width > 2000 || height > 2000) {
      return new NextResponse('Invalid dimensions', { status: 400 })
    }

    // Créer une image SVG avec un design de sneaker
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e9ecef;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="sneaker" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f1f3f4;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#bg)"/>
        
        <!-- Sneaker silhouette -->
        <g transform="translate(${width / 2 - width / 4}, ${height / 2 - height / 4})">
          <!-- Main shoe body -->
          <ellipse cx="${width / 8}" cy="${height / 6}" rx="${width / 12}" ry="${height / 8}" fill="url(#sneaker)" stroke="#dee2e6" stroke-width="2"/>
          
          <!-- Toe box -->
          <ellipse cx="${width / 8 + width / 20}" cy="${height / 6 - height / 20}" rx="${width / 16}" ry="${height / 12}" fill="url(#sneaker)" stroke="#dee2e6" stroke-width="1"/>
          
          <!-- Sole -->
          <ellipse cx="${width / 8}" cy="${height / 6 + height / 12}" rx="${width / 10}" ry="${height / 20}" fill="#6c757d" opacity="0.8"/>
          
          <!-- Laces -->
          <line x1="${width / 8 - width / 20}" y1="${height / 6 - height / 20}" x2="${width / 8 + width / 20}" y2="${height / 6 - height / 20}" stroke="#343a40" stroke-width="1"/>
          <line x1="${width / 8 - width / 25}" y1="${height / 6 - height / 15}" x2="${width / 8 + width / 25}" y2="${height / 6 - height / 15}" stroke="#343a40" stroke-width="1"/>
          
          <!-- Brand logo area -->
          <circle cx="${width / 8 - width / 15}" cy="${height / 6 + height / 20}" r="${width / 40}" fill="#ff6900" opacity="0.7"/>
        </g>
        
        <!-- Dimensions text -->
        <text x="${width / 2}" y="${height - 20}" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 15}" font-weight="bold">${width} × ${height}</text>
        
        <!-- Sneaker text -->
        <text x="${width / 2}" y="30" text-anchor="middle" fill="#495057" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 12}" font-weight="bold">👟 SNEAKER</text>
      </svg>
    `

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error generating placeholder:', error)

    // Fallback: retourner une image 1x1 transparente
    const transparentPixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64',
    )

    return new NextResponse(transparentPixel, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  }
}
