import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { userId, bookmarked } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    // Get tenant from domain
    const domain = request.headers.get('host') || 'localhost:3000'
    const tenant = await getTenantByDomain(domain)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    
    const payload = await getPayload({ config })
    const { videoId } = await params
    
    // First verify the video exists and belongs to this tenant
    let video
    try {
      video = await payload.findByID({
        collection: 'videos',
        id: videoId
      })
      
      // Check if video belongs to the current tenant
      if (video && video.tenant) {
        const videoTenantId = typeof video.tenant === 'string' ? video.tenant : video.tenant.id
        if (videoTenantId !== tenant.id) {
          video = null
        }
      }
    } catch (error) {
      // Try by slug if ID lookup fails
      const results = await payload.find({
        collection: 'videos',
        where: {
          and: [
            { tenant: { equals: tenant.id } },
            { slug: { equals: videoId } }
          ]
        },
        limit: 1
      })
      
      if (results.docs.length > 0) {
        video = results.docs[0]
      }
    }
    
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    
    // Check if bookmark already exists
    const existingBookmark = await payload.find({
      collection: 'video-progress',
      where: {
        and: [
          { video: { equals: video.id } },
          { user: { equals: userId } }
        ]
      },
      limit: 1
    })
    
    if (existingBookmark.docs.length > 0) {
      // Update existing progress record with bookmark status
      await payload.update({
        collection: 'video-progress',
        id: existingBookmark.docs[0].id,
        data: {
          bookmarked: bookmarked
        } as any
      })
    } else {
      // Create new progress record with bookmark
      await payload.create({
        collection: 'video-progress',
        data: {
          tenant: tenant.id,
          video: video.id,
          user: userId,
          bookmarked: bookmarked,
          currentTime: 0,
          progress: 0,
          duration: 0,
          watchTime: 0,
          completed: false,
          lastWatchedAt: new Date().toISOString(),
          firstWatchedAt: new Date().toISOString()
        }
      })
    }
    
    return NextResponse.json({ success: true, bookmarked })
  } catch (error) {
    console.error('Error updating bookmark:', error)
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    // Get tenant from domain
    const domain = request.headers.get('host') || 'localhost:3000'
    const tenant = await getTenantByDomain(domain)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    
    const payload = await getPayload({ config })
    const { videoId } = await params
    
    // First verify the video exists and belongs to this tenant
    let video
    try {
      video = await payload.findByID({
        collection: 'videos',
        id: videoId
      })
      
      // Check if video belongs to the current tenant
      if (video && video.tenant) {
        const videoTenantId = typeof video.tenant === 'string' ? video.tenant : video.tenant.id
        if (videoTenantId !== tenant.id) {
          video = null
        }
      }
    } catch (error) {
      // Try by slug if ID lookup fails
      const results = await payload.find({
        collection: 'videos',
        where: {
          and: [
            { tenant: { equals: tenant.id } },
            { slug: { equals: videoId } }
          ]
        },
        limit: 1
      })
      
      if (results.docs.length > 0) {
        video = results.docs[0]
      }
    }
    
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    
    // Check if user has bookmarked this video
    const bookmark = await payload.find({
      collection: 'video-progress',
      where: {
        and: [
          { video: { equals: video.id } },
          { user: { equals: userId } }
        ]
      },
      limit: 1
    })
    
    const isBookmarked = bookmark.docs.length > 0 ? (bookmark.docs[0] as any).bookmarked || false : false
    
    return NextResponse.json({ bookmarked: isBookmarked })
  } catch (error) {
    console.error('Error fetching bookmark status:', error)
    return NextResponse.json({ error: 'Failed to fetch bookmark status' }, { status: 500 })
  }
}
