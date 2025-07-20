import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type CollectionParams = { params: { collection: string } }

export async function GET(req: NextRequest, { params }: CollectionParams) {
  // Ensure params is properly awaited
  const resolvedParams = await Promise.resolve(params);
  const collection = resolvedParams.collection
  
  try {
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)
    
    // Allow only specific collections for security
    const allowedCollections = [
      'pages', 'posts', 'media', 'branding', 'tenants', 'users', 
      'headers', 'footers', 'domains'
    ]
    if (!allowedCollections.includes(collection)) {
      return NextResponse.json({ error: 'Collection not allowed' }, { status: 403 })
    }
    
    const payload = await getPayload({ config: configPromise })
    
    // Get tenant from cookie to respect multi-tenant isolation
    // Cookies API has changed in Next.js 15
    let tenant: string | undefined
    try {
      const cookieStore = await cookies()
      const tenantCookie = cookieStore.get('payload-tenant')
      tenant = tenantCookie?.value
    } catch (error) {
      console.warn('Error reading tenant cookie:', error)
    }
    
    console.log(`[Analytics API] Fetching collection: ${collection}, tenant: ${tenant}`)
    
    // Handle special collection name mappings
    let actualCollection = collection
    if (collection === 'branding') {
      actualCollection = '_branding_' // Branding collection uses underscores in config
    }
    
    // Check if collection exists and is configured for multi-tenancy
    const config = await configPromise
    const collectionConfig = config.collections?.find(c => c.slug === actualCollection)
    
    if (!collectionConfig) {
      console.error(`[Analytics API] Collection '${actualCollection}' not found in config`)
      return NextResponse.json({ error: `Collection '${actualCollection}' not found` }, { status: 404 })
    }
    
    // Special handling for different collection types
    let queryOptions: any = {
      collection: actualCollection as any,
      limit,
      page,
      pagination: true,
      depth: 2
    }
    
    // Handle tenant filtering based on collection type and configuration
    if (tenant) {
      if (collection === 'tenants') {
        // For tenants collection, don't apply tenant filter - show all tenants
        console.log(`[Analytics API] Skipping tenant filter for tenants collection`)
      } else if (collection === 'users') {
        // Users collection uses tenantsArrayField, not standard tenant field
        // Filter users who belong to the current tenant
        queryOptions.where = {
          'tenants.tenant': {
            equals: tenant
          }
        }
        console.log(`[Analytics API] Applying tenant array filter for users: ${tenant}`)
      } else if (collection === 'branding') {
        // Branding is a global collection (one per tenant)
        queryOptions.where = {
          tenant: {
            equals: tenant
          }
        }
        console.log(`[Analytics API] Applying tenant filter for branding (global collection): ${tenant}`)
      } else {
        // Standard tenant-scoped collections
        queryOptions.where = {
          tenant: {
            equals: tenant
          }
        }
        console.log(`[Analytics API] Applying tenant filter for ${collection}: ${tenant}`)
      }
    } else {
      console.log(`[Analytics API] No tenant context, fetching all documents from ${collection}`)
    }
    
    const result = await payload.find(queryOptions)
    
    console.log(`[Analytics API] Successfully fetched ${result.docs.length} documents from ${collection}`)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`[Analytics API] Error fetching collection '${collection}':`, error)
    
    // Provide more specific error information
    let errorMessage = 'Failed to fetch collection data'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes("can't be found")) {
        errorMessage = `Collection '${collection}' not found or not accessible`
        statusCode = 404
      } else if (error.message.includes('permission') || error.message.includes('access')) {
        errorMessage = `Access denied to collection '${collection}'`
        statusCode = 403
      } else {
        errorMessage = `Error accessing collection '${collection}': ${error.message}`
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      collection,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: statusCode })
  }
}
