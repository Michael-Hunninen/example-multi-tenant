import React from 'react'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import { getDomainInfo } from '@/utilities/getDomainInfo'
import { notFound } from 'next/navigation'

// Import from the original components directory
import PricingPage from '@/app/(frontend)/_components/PricingPage'

export default async function Pricing() {
  // Get tenant context from middleware headers
  const headersList = await headers()
  const tenantDomain = headersList.get('x-tenant-domain') || 'localhost:3000'
  
  // Get domain info to check if custom pages are enabled
  const domainInfo = await getDomainInfo(tenantDomain)
  const customPagesEnabled = domainInfo?.enableCustomPages === true
  
  // If custom pages are disabled, return 404
  if (!customPagesEnabled) {
    notFound()
  }
  
  return <PricingPage />
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const tenantDomain = headersList.get('x-tenant-domain') || 'localhost:3000'
  const tenant = await getTenantByDomain(tenantDomain)
  
  return {
    title: `Pricing | ${tenant?.name || 'Multi-Tenant App'}`,
    description: 'View our pricing plans and options',
  }
}
