import { cookies, headers } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Gets the current tenant ID from the request context
 * Uses domain matching or cookie-based tenant selection
 */
export async function getTenantFromRequest(): Promise<string | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()
    const cookieStore = await cookies()
    
    // 1. Check for tenant cookie first
    const tenantCookie = cookieStore.get('tenant')
    if (tenantCookie?.value) {
      return tenantCookie.value
    }
    
    // 2. Try to match domain to a tenant
    const host = headersList.get('host')
    if (host) {
      const domain = host.split(':')[0] // Remove port if present
      
      // Find tenant by domain
      const tenants = await payload.find({
        collection: 'tenants',
        where: {
          domain: {
            equals: domain
          }
        },
        limit: 1
      })
      
      if (tenants.docs.length > 0) {
        return tenants.docs[0].id
      }
    }
    
    // 3. If no tenant found, return default tenant (for development)
    // In production, you might want to throw an error instead
    return process.env.DEFAULT_TENANT_ID || null
  } catch (error) {
    console.error('Error getting tenant from request:', error)
    return null
  }
}
