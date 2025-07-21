import { NextRequest, NextResponse } from 'next/server'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import { getTenantVideos } from '@/utilities/tenantAwareLmsData'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    
    // Get tenant from domain
    const domain = request.headers.get('host') || 'localhost:3000'
    const tenant = await getTenantByDomain(domain)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    
    // Use tenant-aware utility function
    const videos = await getTenantVideos(tenant.id, {
      limit,
      page,
      category: category || undefined,
      difficulty: difficulty || undefined,
      search: search || undefined
    })
    
    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}
