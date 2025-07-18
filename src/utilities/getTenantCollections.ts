import type { Config } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { getTenantFromRequest } from './getTenantFromRequest'

type Collection = keyof Config['collections'] | string

async function getTenantCollection<T = any>(
  collection: Collection, 
  tenantId?: string | null,
  options: {
    depth?: number,
    limit?: number,
    where?: any
  } = {}
) {
  const payload = await getPayload({ config: configPromise })
  const resolvedTenantId = tenantId || await getTenantFromRequest()
  
  if (!resolvedTenantId) {
    throw new Error('No tenant ID available')
  }

  const { depth = 0, limit = 1, where = {} } = options
  
  // Query the collection with tenant filter
  const result = await payload.find({
    collection: collection as any, // Type assertion to avoid CollectionSlug constraint
    depth,
    limit,
    where: {
      ...where,
      tenant: {
        equals: resolvedTenantId
      }
    }
  })

  return result.docs[0] as T
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the collection and tenant
 */
export const getCachedTenantCollection = <T = any>(
  collection: Collection, 
  tenantId?: string | null,
  options: {
    depth?: number,
    limit?: number,
    where?: any
  } = {}
) =>
  unstable_cache(
    async () => getTenantCollection<T>(collection, tenantId, options), 
    [collection, tenantId || 'current-tenant', JSON.stringify(options)], 
    {
      tags: [`collection_${collection}_tenant_${tenantId || 'current'}`],
    }
  )

// Specific helper for Headers collection
export const getCachedHeader = (tenantId?: string | null, depth = 0) => 
  getCachedTenantCollection('headers', tenantId, { depth })

// Specific helper for Footers collection
export const getCachedFooter = (tenantId?: string | null, depth = 0) => 
  getCachedTenantCollection('footers', tenantId, { depth })
