import { NextRequest, NextResponse } from 'next/server'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import { getTenantFeaturedContent } from '@/utilities/tenantAwareLmsData'

export async function GET(request: NextRequest) {
  try {
    // Get tenant from domain
    const domain = request.headers.get('host') || 'localhost:3000'
    const tenant = await getTenantByDomain(domain)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    
    const content = await getTenantFeaturedContent(tenant.id)
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching featured content:', error)
    return NextResponse.json({ error: 'Failed to fetch featured content' }, { status: 500 })
  }
}
