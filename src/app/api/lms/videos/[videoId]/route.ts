import { NextRequest, NextResponse } from 'next/server'
import { getVideoBySlug } from '@/utilities/lmsData'

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const videoId = params.videoId
    
    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }
    
    // Try to get video by ID first, then by slug if that fails
    let video = null
    
    try {
      // First try to get by ID
      const { getPayload } = await import('payload')
      const config = (await import('@/payload.config')).default
      const payload = await getPayload({ config })
      
      const result = await payload.findByID({
        collection: 'videos',
        id: videoId,
        depth: 2
      })
      
      video = result
    } catch (error) {
      // If ID lookup fails, try by slug
      video = await getVideoBySlug(videoId)
    }
    
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    
    return NextResponse.json(video)
  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
  }
}
