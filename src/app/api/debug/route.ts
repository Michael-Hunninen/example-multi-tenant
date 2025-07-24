import { NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'

export async function GET() {
  const headersList = headers()
  const host = headersList.get('host') || 'unknown'
  
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    host,
    serverUrl: process.env.PAYLOAD_PUBLIC_SERVER_URL,
    tenant: null,
    pages: null,
    database: 'unknown',
    error: null
  }
  
  try {
    // Test database connection
    const payload = await getPayload({ config: configPromise })
    debug.database = 'connected'
    
    // Try to get tenant
    const tenant = await getTenantByDomain(host)
    debug.tenant = tenant ? {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name
    } : null
    
    // Check if any pages exist
    const pageResult = await payload.find({
      collection: 'pages',
      limit: 1,
      pagination: false
    })
    
    debug.pages = {
      count: pageResult.totalDocs,
      hasHomePage: false
    }
    
    // Check for home page
    if (tenant) {
      const homePageResult = await payload.find({
        collection: 'pages',
        limit: 1,
        where: {
          and: [
            {
              slug: {
                equals: 'home'
              }
            },
            {
              'tenant.id': {
                equals: tenant.id
              }
            }
          ]
        }
      })
      
      debug.pages.hasHomePage = homePageResult.totalDocs > 0
    }
    
  } catch (error) {
    debug.error = error.message
  }
  
  return NextResponse.json(debug)
}
