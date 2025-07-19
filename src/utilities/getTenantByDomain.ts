import type { Tenant, Domain } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

/**
 * Server-side utility to resolve tenant by domain using the Domains collection
 * This function is cached to avoid multiple database queries for the same domain
 */
export const getTenantByDomain = cache(async (domain: string): Promise<Tenant | null> => {
  try {
    const payload = await getPayload({ config: configPromise })

    // Handle localhost and development domains - always return agency-owner
    if (domain === 'localhost:3000' || domain === 'localhost' || domain === '127.0.0.1') {
      const result = await payload.find({
        collection: 'tenants',
        limit: 1,
        where: {
          isAgencyOwner: {
            equals: true,
          },
        },
      })

      if (result.docs && result.docs.length > 0) {
        return result.docs[0]
      }

      // Fallback: get any tenant with slug 'agency-owner'
      const fallbackResult = await payload.find({
        collection: 'tenants',
        limit: 1,
        where: {
          slug: {
            equals: 'agency-owner',
          },
        },
      })

      return fallbackResult.docs?.[0] || null
    }

    // For production domains, use the Domains collection to find the mapping
    const domainResult = await payload.find({
      collection: 'domains',
      limit: 1,
      where: {
        and: [
          {
            domain: {
              equals: domain,
            },
          },
          {
            isActive: {
              equals: true,
            },
          },
        ],
      },
      depth: 2, // Populate the tenant relationship
    })

    if (domainResult.docs && domainResult.docs.length > 0) {
      const domainDoc = domainResult.docs[0] as Domain
      return typeof domainDoc.tenant === 'object' ? domainDoc.tenant : null
    }

    // If no exact domain match, try subdomain pattern matching
    // This handles cases like tenant.yourdomain.com
    const subdomainMatch = domain.split('.')[0]
    if (subdomainMatch && subdomainMatch !== domain) {
      // Try to find a domain with the subdomain
      const subdomainResult = await payload.find({
        collection: 'domains',
        limit: 1,
        where: {
          and: [
            {
              domain: {
                contains: subdomainMatch,
              },
            },
            {
              isActive: {
                equals: true,
              },
            },
          ],
        },
        depth: 2,
      })

      if (subdomainResult.docs && subdomainResult.docs.length > 0) {
        const domainDoc = subdomainResult.docs[0] as Domain
        return typeof domainDoc.tenant === 'object' ? domainDoc.tenant : null
      }

      // Last resort: try to find tenant by slug matching subdomain
      const tenantBySlugResult = await payload.find({
        collection: 'tenants',
        limit: 1,
        where: {
          slug: {
            equals: subdomainMatch,
          },
        },
      })

      if (tenantBySlugResult.docs && tenantBySlugResult.docs.length > 0) {
        return tenantBySlugResult.docs[0]
      }
    }

    return null
  } catch (error) {
    console.error('Error resolving tenant by domain:', error)
    return null
  }
})

/**
 * Get tenant ID from domain (lighter weight version)
 */
export const getTenantIdByDomain = cache(async (domain: string): Promise<string | null> => {
  const tenant = await getTenantByDomain(domain)
  return tenant?.id || null
})
