import { NextRequest, NextResponse } from 'next/server'
import { getDomainInfo } from '@/utilities/getDomainInfo'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 })
    }
    
    // Get domain info including enableCustomPages setting
    const domainInfo = await getDomainInfo(domain)
    
    // Handle localhost and development domains - find default tenant
    if (!domainInfo && (domain === 'localhost:3000' || domain === 'localhost' || domain === '127.0.0.1')) {
      try {
        const payload = await getPayload({ config: configPromise })
        
        // Find the Agency Owner tenant as default for localhost
        const tenantResult = await payload.find({
          collection: 'tenants',
          limit: 1,
          where: {
            name: {
              equals: 'Agency Owner',
            },
          },
        })
        
        if (tenantResult.docs && tenantResult.docs.length > 0) {
          const defaultTenant = tenantResult.docs[0]
          return NextResponse.json({
            enableCustomPages: false, // Default to false for localhost
            landingPageType: 'default',
            domain: domain,
            tenant: {
              id: defaultTenant.id,
              name: defaultTenant.name,
              slug: defaultTenant.slug
            }
          })
        }
      } catch (error) {
        console.error('Error finding default tenant for localhost:', error)
      }
      
      // If no default tenant found, return error
      return NextResponse.json({ error: 'No tenant configuration found for localhost' }, { status: 404 })
    }
    
    if (!domainInfo) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    }
    
    // Return domain info with tenant information
    return NextResponse.json({
      enableCustomPages: domainInfo.enableCustomPages || false,
      landingPageType: domainInfo.landingPageType || 'default',
      domain: domainInfo.domain,
      tenant: domainInfo.tenant ? {
        id: typeof domainInfo.tenant === 'string' ? domainInfo.tenant : domainInfo.tenant.id,
        name: typeof domainInfo.tenant === 'string' ? undefined : domainInfo.tenant.name,
        slug: typeof domainInfo.tenant === 'string' ? undefined : domainInfo.tenant.slug
      } : null
    })
  } catch (error) {
    console.error('Error fetching domain info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
