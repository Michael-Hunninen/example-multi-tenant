import { NextRequest, NextResponse } from 'next/server'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params
    
    console.log('🎥 Video API - Received videoId:', videoId)
    
    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }
    
    // Get tenant from domain
    const domain = request.headers.get('host') || 'localhost:3000'
    const tenant = await getTenantByDomain(domain)
    
    console.log('🏢 Video API - Tenant found:', tenant?.id)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    
    // Get video with tenant filtering
    const { getPayload } = await import('payload')
    const config = (await import('@/payload.config')).default
    const payload = await getPayload({ config })
    
    let video = null
    
    try {
      // First try to get by ID
      console.log('🔍 Video API - Trying to fetch by ID:', videoId)
      video = await payload.findByID({
        collection: 'videos',
        id: videoId,
        depth: 2
      })
      
      console.log('✅ Video API - Found by ID:', video ? 'Yes' : 'No')
      
      // Check if video belongs to the current tenant
      if (video && video.tenant) {
        const videoTenantId = typeof video.tenant === 'string' ? video.tenant : video.tenant.id
        console.log('🏢 Video API - Video tenant:', videoTenantId, 'Current tenant:', tenant.id)
        if (videoTenantId !== tenant.id) {
          console.log('❌ Video API - Video belongs to different tenant')
          video = null // Video exists but doesn't belong to this tenant
        }
      }
    } catch (error) {
      console.log('❌ Video API - ID lookup failed, trying slug:', error instanceof Error ? error.message : String(error))
      // If ID lookup fails, try by slug
      const results = await payload.find({
        collection: 'videos',
        where: {
          and: [
            { tenant: { equals: tenant.id } },
            { slug: { equals: videoId } }
          ]
        },
        limit: 1,
        depth: 2
      })
      
      console.log('🔍 Video API - Slug search results:', results.docs.length)
      
      if (results.docs.length > 0) {
        video = results.docs[0]
        console.log('✅ Video API - Found by slug:', video.title)
      }
    }
    
    if (!video) {
      console.log('❌ Video API - No video found for:', videoId)
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    
    console.log('✅ Video API - Returning video:', video.title)
    return NextResponse.json(video)
  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
  }
}
