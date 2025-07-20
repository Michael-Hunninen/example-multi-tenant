import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest } from 'next/server'
import { getTenantFromRequest } from '@/utilities/getTenantFromRequest'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TENANT-AWARE FOOTERS API ===')
    
    // Get current tenant from request (domain/cookie)
    const tenantId = await getTenantFromRequest()
    console.log('Current tenant ID for footers:', tenantId)
    
    const payload = await getPayload({ config: configPromise })
    
    // Get footers for the current tenant with explicit tenant filtering
    let footers
    if (tenantId) {
      footers = await payload.find({
        collection: 'footers',
        where: {
          tenant: { equals: tenantId }
        },
        limit: 10,
        sort: '-createdAt'
      })
    } else {
      // Fallback: get footers for Agency-Owner tenant when no tenant context
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
        
        footers = await payload.find({
          collection: 'footers',
          where: {
            tenant: { equals: agencyOwnerId }
          },
          limit: 10,
          sort: '-createdAt'
        })
      } else {
        console.log('No Agency-Owner tenant found, getting all footers')
        footers = await payload.find({
          collection: 'footers',
          limit: 10,
          sort: '-createdAt'
        })
      }
    }
    
    console.log(`Found ${footers.docs.length} footer documents for tenant:`, tenantId)
    
    return Response.json(footers)
  } catch (error) {
    console.error('Error fetching footers:', error)
    return Response.json(
      { error: 'Failed to fetch footers' },
      { status: 500 }
    )
  }
}
