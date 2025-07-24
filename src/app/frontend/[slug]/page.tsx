import type { Metadata } from 'next'
import { cache } from 'react'
import { draftMode, headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import configPromise from '@payload-config'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import { getDomainInfo } from '@/utilities/getDomainInfo'
import { withSafeStaticGeneration } from '../../../utils/buildStaticGeneration'

// Original function wrapped with safety utility to skip DB access during build
const originalGenerateStaticParams = async () => {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

// Export the safe version that won't try to connect during build
export const generateStaticParams = withSafeStaticGeneration(originalGenerateStaticParams)

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug
  
  // Get tenant context from middleware headers
  const headersList = await headers()
  const tenantDomain = headersList.get('x-tenant-domain') || 'localhost:3000'
  const tenant = await getTenantByDomain(tenantDomain)
  
  // Get domain info to check if custom pages are enabled
  const domainInfo = await getDomainInfo(tenantDomain)
  const customPagesEnabled = domainInfo?.enableCustomPages === true
  
  // Handle custom pages routing
  const customPageRoutes = ['about', 'services', 'pricing', 'contact']
  
  // If trying to access a custom page but custom pages are disabled, return 404
  if (customPageRoutes.includes(slug) && !customPagesEnabled) {
    notFound()
  }
  
  // If custom pages are enabled and accessing a custom page route, redirect to the dedicated route
  if (customPagesEnabled && customPageRoutes.includes(slug)) {
    return <PayloadRedirects url={`/${slug}`} />
  }

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug,
    tenantId: tenant?.id,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  
  // Get tenant context from middleware headers
  const headersList = await headers()
  const tenantDomain = headersList.get('x-tenant-domain') || 'localhost:3000'
  const tenant = await getTenantByDomain(tenantDomain)
  
  const page = await queryPageBySlug({
    slug,
    tenantId: tenant?.id,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug, tenantId }: { slug: string; tenantId?: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  // Build the where clause with tenant filtering if tenantId is provided
  const whereClause: any = {
    slug: {
      equals: slug,
    },
  }

  // Add tenant filtering if tenantId is available
  if (tenantId) {
    whereClause['tenant.id'] = {
      equals: tenantId,
    }
  }

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: whereClause,
  })

  return result.docs?.[0] || null
})

const queryDomainByDomain = cache(async (domain: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'domains',
    limit: 1,
    pagination: false,
    where: {
      domain: {
        equals: domain,
      },
      isActive: {
        equals: true,
      },
    },
  })

  return result.docs?.[0] || null
})
