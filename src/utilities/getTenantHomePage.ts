import type { Page } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

/**
 * Get the home page for a specific tenant
 */
export const getTenantHomePage = cache(async (tenantId: string): Promise<Page | null> => {
  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
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
              equals: tenantId,
            },
          },
        ],
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching tenant home page:', error)
    return null
  }
})
