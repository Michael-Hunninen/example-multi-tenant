import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest } from 'next/server'
import { getTenantFromRequest } from '@/utilities/getTenantFromRequest'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TENANT-AWARE HEADERS API ===')
    
    // Get current tenant from request (domain/cookie)
    const tenantId = await getTenantFromRequest()
    console.log('Current tenant ID for headers:', tenantId)
    
    const payload = await getPayload({ config: configPromise })
    
    // Get headers for the current tenant with explicit tenant filtering
    let headers
    if (tenantId) {
      headers = await payload.find({
        collection: 'headers',
        where: {
          tenant: { equals: tenantId }
        },
        limit: 10,
        sort: '-createdAt'
      })
    } else {
      // Fallback: get headers for Agency-Owner tenant when no tenant context
      console.log('No tenant ID found, looking for Agency-Owner tenant...')
      
      // Find the Agency-Owner tenant
      const agencyOwnerTenant = await payload.find({
        collection: 'tenants',
        where: {
          isAgencyOwner: { equals: true }
        },
        limit: 1
      })
      
      if (agencyOwnerTenant.docs.length > 0) {
        const agencyOwnerId = agencyOwnerTenant.docs[0].id
        console.log('Found Agency-Owner tenant:', agencyOwnerId)
        
        headers = await payload.find({
          collection: 'headers',
          where: {
            tenant: { equals: agencyOwnerId }
          },
          limit: 10,
          sort: '-createdAt'
        })
      } else {
        console.log('No Agency-Owner tenant found, getting all headers')
        headers = await payload.find({
          collection: 'headers',
          limit: 10,
          sort: '-createdAt'
        })
      }
    }
    
    console.log(`Found ${headers.docs.length} header documents for tenant:`, tenantId)
    
    return Response.json(headers)
  } catch (error) {
    console.error('Error fetching headers:', error)
    return Response.json(
      { error: 'Failed to fetch headers' },
      { status: 500 }
    )
  }
}
