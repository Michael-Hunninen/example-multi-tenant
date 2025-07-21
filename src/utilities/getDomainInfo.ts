// Temporary type definition until payload types are regenerated
type DomainWithCustomPages = {
  id: string
  domain: string
  enableCustomPages?: boolean
  isActive?: boolean
  tenant?: any
  landingPageType?: string
  landingPage?: any
  isRootDomain?: boolean
  isDefault?: boolean
  redirectTo?: string
  createdAt: string
  updatedAt: string
}

// Use the temporary type instead of Domain from payload-types
// import type { Domain } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

/**
 * Server-side utility to get domain information including custom pages settings
 * This function is cached to avoid multiple database queries for the same domain
 */
export const getDomainInfo = cache(async (domain: string): Promise<DomainWithCustomPages | null> => {
  try {
    const payload = await getPayload({ config: configPromise })

    // Handle localhost and development domains
    if (domain === 'localhost:3000' || domain === 'localhost' || domain === '127.0.0.1') {
      // For localhost, try to find a domain entry for agency-owner tenant
      const result = await payload.find({
        collection: 'domains',
        limit: 1,
        where: {
          domain: {
            equals: domain,
          },
        },
        depth: 2,
      })

      if (result.docs && result.docs.length > 0) {
        return result.docs[0] as DomainWithCustomPages
      }

      // If no localhost domain entry exists, return null (custom pages disabled by default)
      return null
    }

    // For production domains, find the exact domain match
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
      return domainResult.docs[0] as DomainWithCustomPages
    }

    // If no exact domain match, try subdomain pattern matching
    const subdomainMatch = domain.split('.')[0]
    if (subdomainMatch && subdomainMatch !== domain) {
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
        return subdomainResult.docs[0] as DomainWithCustomPages
      }
    }

    return null
  } catch (error) {
    console.error('Error getting domain info:', error)
    return null
  }
})

/**
 * Check if custom pages are enabled for a domain
 */
export const isCustomPagesEnabled = cache(async (domain: string): Promise<boolean> => {
  const domainInfo = await getDomainInfo(domain)
  return domainInfo?.enableCustomPages === true
})
