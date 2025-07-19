import { cookies, headers } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Gets the current tenant ID from the request context
 * Uses domain matching or cookie-based tenant selection
 */
export async function getTenantFromRequest(): Promise<string | null> {
  try {
    console.log('\n===== TENANT RESOLUTION DEBUG =====')
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()
    const cookieStore = await cookies()
    
    // 1. Check for tenant cookie first
    const tenantCookie = cookieStore.get('tenant')
    console.log('Cookie check - tenant cookie:', tenantCookie?.value || 'not found')
    if (tenantCookie?.value) {
      console.log('Using tenant from cookie:', tenantCookie.value)
      return tenantCookie.value
    }
    
    // 2. Try to match domain to a tenant
    const host = headersList.get('host')
    console.log('Host from headers:', host)
    if (host) {
      const domain = host.split(':')[0] // Remove port if present
      console.log('Domain (without port):', domain)
      
      // Find tenant by domain using the Domains collection
      console.log('Searching Domains collection for domain:', domain)
      const domains = await payload.find({
        collection: 'domains',
        where: {
          domain: {
            equals: domain
          },
          isActive: {
            equals: true
          }
        },
        depth: 1, // Ensure we get tenant relation data
        limit: 1
      })
      
      console.log('Domains search result:', JSON.stringify(domains, null, 2))
      
      if (domains.docs.length > 0) {
        const domainDoc = domains.docs[0]
        console.log('Found domain document:', JSON.stringify(domainDoc, null, 2))
        
        // Extract tenant ID from the domain document
        if (domainDoc.tenant) {
          console.log('Domain has tenant field:', typeof domainDoc.tenant, domainDoc.tenant)
          const tenantId = typeof domainDoc.tenant === 'object' ? domainDoc.tenant.id : domainDoc.tenant
          console.log('Resolved tenant ID:', tenantId)
          return tenantId || null
        } else {
          console.log('Domain document has no tenant field!')
        }
      } else {
        console.log('No matching domain found in database')
      }
    }
    
    // 3. If no tenant found, return default tenant (for development)
    // In production, you might want to throw an error instead
    console.log('Falling back to default tenant:', process.env.DEFAULT_TENANT_ID || 'null')
    return process.env.DEFAULT_TENANT_ID || null
  } catch (error) {
    console.error('Error getting tenant from request:', error)
    return null
  } finally {
    console.log('===== END TENANT RESOLUTION DEBUG =====\n')
  }
}
