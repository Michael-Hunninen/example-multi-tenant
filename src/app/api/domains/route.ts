import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Get all domain mappings
    const domains = await payload.find({
      collection: 'domains',
      limit: 100,
      sort: 'domain'
    })
    
    console.log(`Found ${domains.docs.length} domain mappings:`)
    domains.docs.forEach(domain => {
      const tenantName = typeof domain.tenant === 'object' && domain.tenant !== null ? domain.tenant.name : domain.tenant
      const tenantId = typeof domain.tenant === 'object' && domain.tenant !== null ? domain.tenant.id : domain.tenant
      console.log(`- ${domain.domain} -> Tenant: ${tenantName} (ID: ${tenantId})`)
    })
    
    return Response.json(domains)
  } catch (error) {
    console.error('Error fetching domains:', error)
    return Response.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    )
  }
}
