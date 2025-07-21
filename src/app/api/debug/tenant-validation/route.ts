import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    const payload = await getPayload({ config: configPromise })
    
    // Get user data
    const userResult = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })
    
    if (!userResult.docs || userResult.docs.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const user = userResult.docs[0]
    
    // Get current tenant from domain
    const hostname = request.headers.get('host') || 'localhost:3000'
    const domainResponse = await fetch(`${request.nextUrl.origin}/api/domain-info?domain=${encodeURIComponent(hostname)}`)
    
    let currentTenant = null
    if (domainResponse.ok) {
      const domainData = await domainResponse.json()
      currentTenant = domainData.tenant
    }
    
    return NextResponse.json({
      debug: {
        email: user.email,
        userId: user.id,
        userRoles: user.roles,
        userTenants: user.tenants,
        userTenantsCount: user.tenants?.length || 0,
        userTenantsRaw: JSON.stringify(user.tenants, null, 2),
        currentTenant: currentTenant,
        currentTenantId: currentTenant?.id,
        hostname: hostname,
        validation: {
          hasTenantsArray: !!user.tenants,
          isTenantsArray: Array.isArray(user.tenants),
          tenantComparisons: user.tenants?.map((t: any, index: number) => ({
            index,
            tenantAssociation: t,
            extractedTenantId: typeof t.tenant === 'string' ? t.tenant : t.tenant?.id,
            extractedTenantIdType: typeof (typeof t.tenant === 'string' ? t.tenant : t.tenant?.id),
            currentTenantId: currentTenant?.id,
            currentTenantIdType: typeof currentTenant?.id,
            strictMatch: (typeof t.tenant === 'string' ? t.tenant : t.tenant?.id) === currentTenant?.id,
            looseMatch: (typeof t.tenant === 'string' ? t.tenant : t.tenant?.id) == currentTenant?.id,
          }))
        }
      }
    })
    
  } catch (error) {
    console.error('DEBUG TENANT VALIDATION ERROR:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
