import { NextRequest, NextResponse } from 'next/server'
import { getTenantFromRequest } from '@/utilities/getTenantFromRequest'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  try {
    // Get tenant ID from request
    const tenantId = await getTenantFromRequest()
    
    // Default values
    const defaultName = 'JG Performance Horses'
    const defaultShortName = 'JG Performance'
    const defaultDescription = 'Professional reining training and horse performance education platform'
    const defaultThemeColor = '#14b8a6' // teal-500
    const defaultBackgroundColor = '#000000'
    
    let tenant = null
    if (tenantId) {
      // Fetch full tenant data
      const payload = await getPayload({ config: configPromise })
      const tenantDoc = await payload.findByID({
        collection: 'tenants',
        id: tenantId
      })
      tenant = tenantDoc
    }
    
    // Use tenant branding if available
    const name = tenant?.name || defaultName
    const shortName = name.length > 12 ? name.substring(0, 12) : name
    const description = tenant?.description || defaultDescription
    const themeColor = defaultThemeColor // Use default since tenant doesn't have color fields yet
    const backgroundColor = defaultBackgroundColor // Use default since tenant doesn't have color fields yet
    
    // Get the current origin
    const origin = new URL(request.url).origin
    
    const manifest = {
      name,
      short_name: shortName,
      description,
      start_url: '/',
      display: 'standalone',
      background_color: backgroundColor,
      theme_color: themeColor,
      orientation: 'portrait-primary',
      scope: '/',
      categories: ['education', 'sports', 'lifestyle'],
      lang: 'en-US',
      icons: [
        {
          src: '/api/pwa/icon/72x72',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/api/pwa/icon/96x96',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/api/pwa/icon/128x128',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/api/pwa/icon/144x144',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/api/pwa/icon/152x152',
          sizes: '152x152',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/api/pwa/icon/192x192',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/api/pwa/icon/384x384',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/api/pwa/icon/512x512',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable any'
        }
      ],
      screenshots: [
        {
          src: '/api/pwa/screenshot/mobile',
          sizes: '390x844',
          type: 'image/png',
          form_factor: 'narrow'
        },
        {
          src: '/api/pwa/screenshot/desktop',
          sizes: '1280x720',
          type: 'image/png',
          form_factor: 'wide'
        }
      ],
      shortcuts: [
        {
          name: 'Dashboard',
          short_name: 'Dashboard',
          description: 'Access your learning dashboard',
          url: '/dashboard',
          icons: [
            {
              src: '/api/pwa/icon/96x96',
              sizes: '96x96',
              type: 'image/png'
            }
          ]
        },
        {
          name: 'Videos',
          short_name: 'Videos',
          description: 'Browse training videos',
          url: '/dashboard/videos',
          icons: [
            {
              src: '/api/pwa/icon/96x96',
              sizes: '96x96',
              type: 'image/png'
            }
          ]
        },
        {
          name: 'Programs',
          short_name: 'Programs',
          description: 'View training programs',
          url: '/dashboard/programs',
          icons: [
            {
              src: '/api/pwa/icon/96x96',
              sizes: '96x96',
              type: 'image/png'
            }
          ]
        }
      ]
    }

    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    })
  } catch (error) {
    console.error('Error generating PWA manifest:', error)
    
    // Return a default manifest if there's an error
    const defaultManifest = {
      name: 'JG Performance Horses',
      short_name: 'JG Performance',
      description: 'Professional reining training and horse performance education platform',
      start_url: '/',
      display: 'standalone',
      background_color: '#000000',
      theme_color: '#14b8a6',
      orientation: 'portrait-primary',
      scope: '/',
      icons: [
        {
          src: '/api/pwa/icon/192x192',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/api/pwa/icon/512x512',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }

    return NextResponse.json(defaultManifest, {
      headers: {
        'Content-Type': 'application/manifest+json'
      }
    })
  }
}
