import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { getTenantFromRequest } from '@/utilities/getTenantFromRequest'

export const dynamic = 'force-dynamic'
// Removed revalidate since we're now using dynamic rendering

export default async function Page() {
  const payload = await getPayload({ config: configPromise })
  
  // Get current tenant ID from request
  const tenantId = await getTenantFromRequest()
  console.log('[POSTS PAGE] Tenant ID from request:', tenantId)
  
  // Determine which tenant to use for posts filtering
  let effectiveTenantId = tenantId
  
  // If no tenant ID (root domain), default to Agency-Owner tenant
  if (!tenantId) {
    console.log('[POSTS PAGE] No tenant found, looking for Agency-Owner tenant...')
    try {
      // Try multiple possible names for Agency Owner tenant
      const possibleNames = ['Agency Owner', 'Agency-Owner', 'AgencyOwner']
      let agencyOwnerTenant = null
      
      for (const name of possibleNames) {
        const result = await payload.find({
          collection: 'tenants',
          where: {
            name: {
              equals: name
            }
          },
          limit: 1
        })
        
        if (result.docs.length > 0) {
          agencyOwnerTenant = result
          console.log('[POSTS PAGE] Found Agency-Owner tenant with name:', name)
          break
        }
      }
      
      // Also try to find by checking if tenant has isAgencyOwner flag
      if (!agencyOwnerTenant) {
        const agencyOwnerByFlag = await payload.find({
          collection: 'tenants',
          where: {
            isAgencyOwner: {
              equals: true
            }
          },
          limit: 1
        })
        
        if (agencyOwnerByFlag.docs.length > 0) {
          agencyOwnerTenant = agencyOwnerByFlag
          console.log('[POSTS PAGE] Found Agency-Owner tenant by isAgencyOwner flag')
        }
      }
      
      if (agencyOwnerTenant && agencyOwnerTenant.docs.length > 0) {
        effectiveTenantId = agencyOwnerTenant.docs[0].id
        console.log('[POSTS PAGE] Using Agency-Owner tenant ID:', effectiveTenantId)
      } else {
        console.log('[POSTS PAGE] Agency-Owner tenant not found, trying fallback...')
        // Fallback: use the tenant ID from branding logs (6879c321cff2dfe063ff102c)
        effectiveTenantId = '6879c321cff2dfe063ff102c'
        console.log('[POSTS PAGE] Using hardcoded Agency-Owner tenant ID as fallback:', effectiveTenantId)
      }
    } catch (error) {
      console.error('[POSTS PAGE] Error finding Agency-Owner tenant:', error)
      // Fallback: use the tenant ID from branding logs
      effectiveTenantId = '6879c321cff2dfe063ff102c'
      console.log('[POSTS PAGE] Using hardcoded Agency-Owner tenant ID due to error:', effectiveTenantId)
    }
  }
  
  // Add tenant filter to posts query
  let whereClause: any = undefined
  
  if (effectiveTenantId) {
    whereClause = {
      tenant: {
        equals: effectiveTenantId
      }
    }
    console.log('[POSTS PAGE] Using tenant filter for:', effectiveTenantId)
  } else {
    // Fallback: show no posts if we can't determine any tenant
    whereClause = {
      id: {
        equals: 'no-tenant-found'
      }
    }
    console.log('[POSTS PAGE] No tenant available, showing no posts')
  }
  
  console.log('[POSTS PAGE] Where clause:', JSON.stringify(whereClause, null, 2))
  
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: whereClause,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      tenant: true, // Include tenant field in results for debugging
    },
  })
  
  console.log('[POSTS PAGE] Found posts:', posts.docs.length)
  console.log('[POSTS PAGE] Posts with tenant info:', posts.docs.map(post => ({ 
    title: post.title, 
    slug: post.slug, 
    tenant: post.tenant 
  })))

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  // Get tenant name for dynamic title
  const tenantId = await getTenantFromRequest()
  let tenantName = "Payload Website Template"
  
  if (tenantId) {
    try {
      const payload = await getPayload({ config: configPromise })
      const tenant = await payload.findByID({
        collection: 'tenants',
        id: tenantId
      })
      if (tenant && tenant.name) {
        tenantName = tenant.name
      }
    } catch (error) {
      console.error('Error fetching tenant name for metadata:', error)
    }
  }
  
  return {
    title: `${tenantName} - Posts`,
  }
}
