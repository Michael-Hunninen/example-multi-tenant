import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode, headers } from 'next/headers'
import React, { cache } from 'react'


import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import { getDomainInfo } from '@/utilities/getDomainInfo'
// Client component removed to avoid Vercel manifest issues
import { LivePreviewListener } from '@/components/LivePreviewListener'
import CustomHomepage from '../_components/CustomHomepage'
import { notFound } from 'next/navigation'
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
  
  // If custom pages are enabled and accessing a custom page route, render the appropriate component
  if (customPagesEnabled && customPageRoutes.includes(slug)) {
    switch (slug) {
      case 'about':
        const { default: AboutPage } = await import('../_components/AboutPage')
        return <AboutPage />
      case 'services':
        const { default: ServicesPage } = await import('../_components/ServicesPage')
        return <ServicesPage />
      case 'pricing':
        const { default: PricingPage } = await import('../_components/PricingPage')
        return <PricingPage />
      case 'contact':
        const { default: ContactPage } = await import('../_components/ContactPage')
        return <ContactPage />
      default:
        notFound()
    }
  }

  // Check if this is the home page and if there's a custom landing page configured
  if (slug === 'home' && tenant) {
    // If custom pages are enabled, always show custom homepage for root
    if (customPagesEnabled) {
      return <CustomHomepage />
    }
    
    const domainConfig = await queryDomainByDomain(tenantDomain)
    
    // Type assertion for the new landingPageType field until types are regenerated
    const landingPageType = (domainConfig as any)?.landingPageType
    
    // If custom homepage is selected, render it
    if (landingPageType === 'custom-homepage') {
      return <CustomHomepage />
    }
    
    // If default dashboard is selected, redirect to dashboard
    if (landingPageType === 'default') {
      return <PayloadRedirects url="/dashboard" />
    }
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
