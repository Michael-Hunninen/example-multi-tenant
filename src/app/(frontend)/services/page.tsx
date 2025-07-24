import { Metadata } from 'next'
import { draftMode, headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import { getDomainInfo } from '@/utilities/getDomainInfo'

// Import from the original components directory
import ServicesPage from '../_components/ServicesPage'

export default async function Services() {
  // Get tenant context from middleware headers
  const headersList = await headers()
  const tenantDomain = headersList.get('x-tenant-domain') || 'localhost:3000'
  const tenant = await getTenantByDomain(tenantDomain)
  
  // Get domain info to check if custom pages are enabled
  const domainInfo = await getDomainInfo(tenantDomain)
  const customPagesEnabled = domainInfo?.enableCustomPages === true

  // If custom pages are enabled, show the custom services page
  if (customPagesEnabled) {
    return <ServicesPage />
  }

  // If custom pages are disabled, show 404 or redirect to home
  notFound()
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Services - JG Performance Horses',
    description: 'Discover our comprehensive horse training and reining services.',
  }
}
