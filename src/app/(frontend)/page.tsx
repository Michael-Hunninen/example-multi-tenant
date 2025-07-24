import { Metadata } from 'next'
import { draftMode, headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import { getDomainInfo } from '@/utilities/getDomainInfo'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import CustomHomepage from './_components/CustomHomepage'

// Import client component directly to avoid reference issues
import ClientWrapper from './_components/ClientWrapper'

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  
  // Get tenant context from middleware headers
  const headersList = await headers()
  const tenantDomain = headersList.get('x-tenant-domain') || 'localhost:3000'
  const tenant = await getTenantByDomain(tenantDomain)
  
  // Get domain info to check if custom pages are enabled
  const domainInfo = await getDomainInfo(tenantDomain)
  const customPagesEnabled = domainInfo?.enableCustomPages === true
  
  // If custom pages are enabled, always show custom homepage for root
  if (customPagesEnabled) {
    return <CustomHomepage />
  }
  
  // Default page behavior for the home page
  const payload = await getPayload({ config: configPromise })
  
  // Build the where clause with tenant filtering if tenant is provided
  const whereClause: any = {
    slug: {
      equals: 'home',
    },
  }
  
  if (tenant?.id) {
    whereClause['tenant.id'] = {
      equals: tenant.id,
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
  
  const page = result.docs?.[0] || null
  
  if (!page) {
    notFound()
  }
  
  const { hero, layout } = page
  
  return (
    <article className="pt-16 pb-24">
      <ClientWrapper />
      {draft && <LivePreviewListener />}
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  // Get tenant context from middleware headers
  const headersList = await headers()
  const tenantDomain = headersList.get('x-tenant-domain') || 'localhost:3000'
  const tenant = await getTenantByDomain(tenantDomain)
  
  const payload = await getPayload({ config: configPromise })
  
  // Build the where clause with tenant filtering if tenant is provided
  const whereClause: any = {
    slug: {
      equals: 'home',
    },
  }
  
  if (tenant?.id) {
    whereClause['tenant.id'] = {
      equals: tenant.id,
    }
  }
  
  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    pagination: false,
    where: whereClause,
  })
  
  const page = result.docs?.[0] || null
  
  return generateMeta({ doc: page })
}
