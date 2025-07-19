import type { Page, Domain } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

/**
 * Get the landing page for a specific domain
 * Uses the Domains collection to determine which page should be shown
 */
export const getDomainLandingPage = cache(async (domain: string): Promise<Page | null> => {
  try {
    const payload = await getPayload({ config: configPromise })

    // Find the domain configuration
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
      depth: 3, // Populate tenant and landingPage relationships
    })

    if (domainResult.docs && domainResult.docs.length > 0) {
      const domainDoc = domainResult.docs[0] as Domain
      
      // If a specific landing page is configured, return it
      if (domainDoc.landingPage && typeof domainDoc.landingPage === 'object') {
        return domainDoc.landingPage as Page
      }

      // Otherwise, find the home page for this tenant
      const tenant = typeof domainDoc.tenant === 'object' ? domainDoc.tenant : null
      if (tenant) {
        const homePageResult = await payload.find({
          collection: 'pages',
          limit: 1,
          where: {
            and: [
              {
                slug: {
                  equals: 'home',
                },
              },
              {
                'tenant.id': {
                  equals: tenant.id,
                },
              },
            ],
          },
        })

        return homePageResult.docs?.[0] || null
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching domain landing page:', error)
    return null
  }
})

/**
 * Get the agency owner's home page (for root domain)
 */
export const getAgencyOwnerHomePage = cache(async (): Promise<Page | null> => {
  try {
    const payload = await getPayload({ config: configPromise })

    // Find the agency owner tenant
    const agencyOwnerResult = await payload.find({
      collection: 'tenants',
      limit: 1,
      where: {
        isAgencyOwner: {
          equals: true,
        },
      },
    })

    if (agencyOwnerResult.docs && agencyOwnerResult.docs.length > 0) {
      const agencyOwner = agencyOwnerResult.docs[0]
      
      // Find the home page for the agency owner
      const homePageResult = await payload.find({
        collection: 'pages',
        limit: 1,
        where: {
          and: [
            {
              slug: {
                equals: 'home',
              },
            },
            {
              'tenant.id': {
                equals: agencyOwner.id,
              },
            },
          ],
        },
      })

      return homePageResult.docs?.[0] || null
    }

    return null
  } catch (error) {
    console.error('Error fetching agency owner home page:', error)
    return null
  }
})
