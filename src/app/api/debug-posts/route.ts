import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getTenantFromRequest } from '@/utilities/getTenantFromRequest'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const tenantId = await getTenantFromRequest()
    
    console.log('\n=== DEBUG POSTS API ===')
    console.log('Tenant ID from request:', tenantId)
    
    // Get domain info from request
    const host = req.headers.get('host')
    const domain = host?.split(':')[0]
    console.log('Request host:', host)
    console.log('Request domain:', domain)
    
    // Get all domains and their tenant mappings
    const allDomains = await payload.find({
      collection: 'domains',
      limit: 100,
      depth: 1
    })
    
    console.log('\n=== DOMAIN MAPPINGS ===')
    allDomains.docs.forEach((domainDoc, index) => {
      console.log(`Domain ${index + 1}:`, {
        domain: domainDoc.domain,
        tenantId: typeof domainDoc.tenant === 'object' ? domainDoc.tenant?.id : domainDoc.tenant,
        tenantName: typeof domainDoc.tenant === 'object' ? domainDoc.tenant?.name : 'Unknown',
        isActive: domainDoc.isActive
      })
    })
    
    // Get all tenants
    const allTenants = await payload.find({
      collection: 'tenants',
      limit: 100
    })
    
    console.log('\n=== ALL TENANTS ===')
    allTenants.docs.forEach((tenant, index) => {
      console.log(`Tenant ${index + 1}:`, {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug
      })
    })
    
    // Get ALL posts with tenant info
    const allPosts = await payload.find({
      collection: 'posts',
      limit: 100,
      depth: 0,
    })
    
    console.log('\n=== POSTS BY TENANT ===')
    const postsByTenant: Record<string, any[]> = {}
    allPosts.docs.forEach(post => {
      const tenantKey = (post as any).tenant || 'no-tenant'
      if (!postsByTenant[tenantKey]) {
        postsByTenant[tenantKey] = []
      }
      postsByTenant[tenantKey].push({
        id: post.id,
        title: (post as any).title,
        slug: (post as any).slug
      })
    })
    
    Object.entries(postsByTenant).forEach(([tenantKey, posts]) => {
      console.log(`Tenant ${tenantKey}: ${posts.length} posts`)
      posts.forEach(post => {
        console.log(`  - ${post.title} (${post.slug})`)
      })
    })
    
    return NextResponse.json({
      success: true,
      requestInfo: {
        host,
        domain,
        resolvedTenantId: tenantId
      },
      domainMappings: allDomains.docs.map(d => ({
        domain: d.domain,
        tenantId: typeof d.tenant === 'object' ? d.tenant?.id : d.tenant,
        tenantName: typeof d.tenant === 'object' ? d.tenant?.name : 'Unknown',
        isActive: d.isActive
      })),
      tenants: allTenants.docs.map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug
      })),
      postsByTenant,
      totalPosts: allPosts.docs.length
    })
  } catch (error) {
    console.error('DEBUG POSTS API Error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to debug posts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
