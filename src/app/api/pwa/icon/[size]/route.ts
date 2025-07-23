import { NextRequest, NextResponse } from 'next/server'
import { getTenantFromRequest } from '@/utilities/getTenantFromRequest'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

export async function GET(
  request: NextRequest,
  { params }: { params: { size: string } }
) {
  try {
    const size = parseInt(params.size)
    if (isNaN(size) || size < 16 || size > 1024) {
      return NextResponse.json({ error: 'Invalid size' }, { status: 400 })
    }

    // Get tenant ID from request
    const tenantId = await getTenantFromRequest()
    
    // Default colors and settings
    const defaultBackgroundColor = '#14b8a6' // teal-500
    const defaultTextColor = '#000000'
    let name = 'JG Performance Horses'
    
    // Get tenant data if available
    if (tenantId) {
      try {
        const payload = await getPayload({ config: configPromise })
        const tenant = await payload.findByID({
          collection: 'tenants',
          id: tenantId
        })
        if (tenant?.name) {
          name = tenant.name
        }
      } catch (error) {
        console.error('Error fetching tenant:', error)
      }
    }
    
    // Use defaults since tenant doesn't have branding fields yet
    const backgroundColor = defaultBackgroundColor
    const textColor = defaultTextColor
    const initials = name.split(' ').map((word: string) => word[0]).join('').substring(0, 2).toUpperCase()

    // Generate icon with initials (no custom logo support yet)
    const iconBuffer = await generateIconWithInitials(size, size, backgroundColor, textColor, initials)

    return new NextResponse(iconBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    })
  } catch (error) {
    console.error('Error generating PWA icon:', error)
    
    // Return a simple fallback icon
    const fallbackIcon = await generateIconWithInitials(
      parseInt(params.size.split('x')[0]) || 192,
      parseInt(params.size.split('x')[1]) || 192,
      '#14b8a6',
      '#000000',
      'JG'
    )
    
    return new NextResponse(fallbackIcon, {
      headers: {
        'Content-Type': 'image/png'
      }
    })
  }
}

async function generateIconWithInitials(
  width: number,
  height: number,
  backgroundColor: string,
  textColor: string,
  initials: string
): Promise<Buffer> {
  const fontSize = Math.floor(width * 0.4)
  
  // Create SVG with initials
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}" rx="${width * 0.1}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="${fontSize}" font-weight="bold" fill="${textColor}">
        ${initials}
      </text>
    </svg>
  `
  
  return sharp(Buffer.from(svg))
    .png()
    .toBuffer()
}
