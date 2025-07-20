import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getTenantFromRequest } from '@/utilities/getTenantFromRequest'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  // Get current tenant ID for static generation
  // Note: This will use the default tenant for static generation
  const tenantId = await getTenantFromRequest()
  
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    where: tenantId ? {
      tenant: {
        equals: tenantId
      }
    } : undefined,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/posts/' + slug
  const post = await queryPostBySlug({ slug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const tenantId = await getTenantFromRequest()

  const payload = await getPayload({ config: configPromise })
  
  // Determine which tenant to use for post filtering
  let effectiveTenantId = tenantId
  
  // If no tenant ID (root domain), default to Agency-Owner tenant
  if (!tenantId) {
    console.log('[POST DETAIL] No tenant found, looking for Agency-Owner tenant...')
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
          console.log('[POST DETAIL] Found Agency-Owner tenant with name:', name)
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
          console.log('[POST DETAIL] Found Agency-Owner tenant by isAgencyOwner flag')
        }
      }
      
      if (agencyOwnerTenant && agencyOwnerTenant.docs.length > 0) {
        effectiveTenantId = agencyOwnerTenant.docs[0].id
        console.log('[POST DETAIL] Using Agency-Owner tenant ID:', effectiveTenantId)
      } else {
        console.log('[POST DETAIL] Agency-Owner tenant not found, trying fallback...')
        // Fallback: use the tenant ID from branding logs (6879c321cff2dfe063ff102c)
        effectiveTenantId = '6879c321cff2dfe063ff102c'
        console.log('[POST DETAIL] Using hardcoded Agency-Owner tenant ID as fallback:', effectiveTenantId)
      }
    } catch (error) {
      console.error('[POST DETAIL] Error finding Agency-Owner tenant:', error)
      // Fallback: use the tenant ID from branding logs
      effectiveTenantId = '6879c321cff2dfe063ff102c'
      console.log('[POST DETAIL] Using hardcoded Agency-Owner tenant ID due to error:', effectiveTenantId)
    }
  }

  // Build where clause with both slug and tenant filters
  const whereClause: any = {
    slug: {
      equals: slug,
    },
  }
  
  // Add tenant filter if tenant ID is available
  if (effectiveTenantId) {
    whereClause.tenant = {
      equals: effectiveTenantId
    }
    console.log('[POST DETAIL] Using tenant filter for:', effectiveTenantId)
  }

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: whereClause,
  })

  return result.docs?.[0] || null
})
