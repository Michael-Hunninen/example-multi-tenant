import { NextRequest, NextResponse } from 'next/server'
import { getTenantFromRequest } from '@/utilities/getTenantFromRequest'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params
    
    // Define dimensions based on type
    let width: number, height: number
    if (type === 'mobile') {
      width = 390
      height = 844
    } else if (type === 'desktop') {
      width = 1280
      height = 720
    } else {
      return new NextResponse('Invalid screenshot type', { status: 400 })
    }

    // Get tenant ID from request
    const tenantId = await getTenantFromRequest()
    
    // Default values
    const defaultName = 'JG Performance Horses'
    const defaultDescription = 'Professional reining training and horse performance education platform'
    const defaultBackgroundColor = '#000000'
    const defaultAccentColor = '#14b8a6' // teal-500
    
    let name = defaultName
    let description = defaultDescription
    
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
        if (tenant?.description) {
          description = tenant.description
        }
      } catch (error) {
        console.error('Error fetching tenant:', error)
      }
    }
    
    // Use defaults since tenant doesn't have branding fields yet
    const backgroundColor = defaultBackgroundColor
    const accentColor = defaultAccentColor

    // Generate screenshot mockup
    const screenshot = await generateScreenshot(width, height, name, description, backgroundColor, accentColor, type)

    return new NextResponse(screenshot, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    })
  } catch (error) {
    console.error('Error generating PWA screenshot:', error)
    
    // Return a simple fallback screenshot
    const fallbackScreenshot = await generateScreenshot(
      params.type === 'mobile' ? 390 : 1280,
      params.type === 'mobile' ? 844 : 720,
      'JG Performance Horses',
      'Professional reining training platform',
      '#000000',
      '#14b8a6',
      params.type
    )
    
    return new NextResponse(fallbackScreenshot, {
      headers: {
        'Content-Type': 'image/png'
      }
    })
  }
}

async function generateScreenshot(
  width: number,
  height: number,
  name: string,
  description: string,
  backgroundColor: string,
  primaryColor: string,
  type: string
): Promise<Buffer> {
  const isMobile = type === 'mobile'
  const headerHeight = isMobile ? 60 : 80
  const contentPadding = isMobile ? 20 : 40
  const titleSize = isMobile ? 24 : 48
  const descriptionSize = isMobile ? 14 : 24
  
  // Create SVG mockup
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      
      <!-- Header -->
      <rect width="100%" height="${headerHeight}" fill="${backgroundColor}" opacity="0.9"/>
      <line x1="0" y1="${headerHeight}" x2="${width}" y2="${headerHeight}" stroke="${primaryColor}" stroke-width="2"/>
      
      <!-- Logo/Title in header -->
      <text x="${contentPadding}" y="${headerHeight / 2 + 6}" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="${isMobile ? 16 : 24}" font-weight="bold" fill="white">
        ${name}
      </text>
      
      <!-- Main content area -->
      <rect x="${contentPadding}" y="${headerHeight + contentPadding}" 
            width="${width - contentPadding * 2}" height="${height - headerHeight - contentPadding * 2}" 
            fill="${backgroundColor}" stroke="${primaryColor}" stroke-width="1" rx="8"/>
      
      <!-- Content title -->
      <text x="${contentPadding + 20}" y="${headerHeight + contentPadding + 50}" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="${titleSize}" font-weight="bold" fill="white">
        Dashboard
      </text>
      
      <!-- Content description -->
      <text x="${contentPadding + 20}" y="${headerHeight + contentPadding + 80}" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="${descriptionSize}" fill="#9CA3AF">
        ${description}
      </text>
      
      <!-- Feature cards mockup -->
      ${generateFeatureCards(width, height, contentPadding, headerHeight, primaryColor, isMobile)}
      
      <!-- Bottom navigation for mobile -->
      ${isMobile ? `
        <rect x="0" y="${height - 80}" width="${width}" height="80" fill="${backgroundColor}" opacity="0.95"/>
        <line x1="0" y1="${height - 80}" x2="${width}" y2="${height - 80}" stroke="${primaryColor}" stroke-width="1"/>
        ${generateBottomNav(width, height, primaryColor)}
      ` : ''}
    </svg>
  `
  
  return sharp(Buffer.from(svg))
    .png()
    .toBuffer()
}

function generateFeatureCards(
  width: number,
  height: number,
  padding: number,
  headerHeight: number,
  primaryColor: string,
  isMobile: boolean
): string {
  const cardWidth = isMobile ? width - padding * 2 - 40 : (width - padding * 2 - 80) / 2
  const cardHeight = isMobile ? 80 : 120
  const startY = headerHeight + padding + 120
  
  return `
    <!-- Card 1 -->
    <rect x="${padding + 20}" y="${startY}" 
          width="${cardWidth}" height="${cardHeight}" 
          fill="${primaryColor}" opacity="0.1" rx="8"/>
    <rect x="${padding + 30}" y="${startY + 10}" 
          width="40" height="40" 
          fill="${primaryColor}" rx="4"/>
    <text x="${padding + 80}" y="${startY + 25}" 
          font-family="system-ui" font-size="14" font-weight="600" fill="white">
      Training Videos
    </text>
    <text x="${padding + 80}" y="${startY + 45}" 
          font-family="system-ui" font-size="12" fill="#9CA3AF">
      ${isMobile ? '250+ videos' : 'Access professional training content'}
    </text>
    
    <!-- Card 2 -->
    <rect x="${isMobile ? padding + 20 : padding + cardWidth + 60}" y="${isMobile ? startY + cardHeight + 20 : startY}" 
          width="${cardWidth}" height="${cardHeight}" 
          fill="${primaryColor}" opacity="0.1" rx="8"/>
    <rect x="${isMobile ? padding + 30 : padding + cardWidth + 70}" y="${isMobile ? startY + cardHeight + 30 : startY + 10}" 
          width="40" height="40" 
          fill="${primaryColor}" rx="4"/>
    <text x="${isMobile ? padding + 80 : padding + cardWidth + 120}" y="${isMobile ? startY + cardHeight + 45 : startY + 25}" 
          font-family="system-ui" font-size="14" font-weight="600" fill="white">
      Live Sessions
    </text>
    <text x="${isMobile ? padding + 80 : padding + cardWidth + 120}" y="${isMobile ? startY + cardHeight + 65 : startY + 45}" 
          font-family="system-ui" font-size="12" fill="#9CA3AF">
      ${isMobile ? 'Weekly live' : 'Interactive training sessions'}
    </text>
  `
}

function generateBottomNav(width: number, height: number, primaryColor: string): string {
  const navItems = ['Home', 'Videos', 'Programs', 'Profile']
  const itemWidth = width / navItems.length
  
  return navItems.map((item, index) => `
    <g>
      <circle cx="${itemWidth * index + itemWidth / 2}" cy="${height - 50}" r="12" 
              fill="${index === 0 ? primaryColor : '#4B5563'}"/>
      <text x="${itemWidth * index + itemWidth / 2}" y="${height - 20}" 
            font-family="system-ui" font-size="10" fill="${index === 0 ? primaryColor : '#9CA3AF'}" 
            text-anchor="middle">
        ${item}
      </text>
    </g>
  `).join('')
}
