/**
 * Debug utilities for troubleshooting deployment issues
 */

import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Debug utility to log tenant resolution process
 * Creates a /api/debug endpoint that returns useful information
 */
export async function debugTenantResolution(domain: string) {
  // Only log in development or if DEBUG env var is set
  if (process.env.NODE_ENV !== 'development' && !process.env.DEBUG) {
    return
  }

  console.log('========================')
  console.log('DEBUG: TENANT RESOLUTION')
  console.log('========================')
  console.log('Domain:', domain)
  
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Check if we can connect to the database
    console.log('Database connection: Success')
    
    // Check for tenant with agency-owner slug (default tenant)
    const defaultTenantResult = await payload.find({
      collection: 'tenants',
      limit: 1,
      where: {
        slug: {
          equals: 'agency-owner',
        },
      },
    })
    
    console.log('Default tenant found:', defaultTenantResult.docs.length > 0 ? 'Yes' : 'No')
    
    if (defaultTenantResult.docs.length > 0) {
      console.log('Default tenant ID:', defaultTenantResult.docs[0].id)
      console.log('Default tenant slug:', defaultTenantResult.docs[0].slug)
    }
    
    // Check for domain
    const domainResult = await payload.find({
      collection: 'domains',
      limit: 1,
      where: {
        domain: {
          equals: domain,
        },
      },
    })
    
    console.log('Domain found in database:', domainResult.docs.length > 0 ? 'Yes' : 'No')
    
    // Environment check
    console.log('PAYLOAD_PUBLIC_SERVER_URL:', process.env.PAYLOAD_PUBLIC_SERVER_URL)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
  } catch (error) {
    console.error('DEBUG ERROR:', error)
    console.log('Database connection: Failed')
  }
  
  console.log('========================')
}
