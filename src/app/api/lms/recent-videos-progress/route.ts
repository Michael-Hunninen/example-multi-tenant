import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'

export async function GET(request: NextRequest) {
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

    // Get user's video progress records
    const videoProgressRecords = await payload.find({
      collection: 'video-progress',
      where: {
        and: [
          { tenant: { equals: tenant.id } },
          { user: { equals: userId } },
          { progress: { greater_than: 0 } } // Only videos with some progress
        ]
      },
      depth: 2,
      sort: '-updatedAt', // Most recently watched first
      limit: 10
    })

    // Transform progress records to include video data and real progress
    const recentVideosWithProgress = videoProgressRecords.docs.map((progressRecord: any) => {
      const video = progressRecord.video
      
      return {
        id: video.id,
        title: video.title,
        duration: video.duration ? `${Math.round(video.duration / 60)}:${String(video.duration % 60).padStart(2, '0')}` : 'Unknown',
        thumbnail: video.thumbnail?.url || '/placeholder.svg?height=200&width=300',
        progress: Math.round(progressRecord.progress || 0), // Real progress from database
        category: video.category?.name || 'General',
        slug: video.slug,
        currentTime: progressRecord.currentTime || 0,
        lastWatched: progressRecord.updatedAt
      }
    })

    return NextResponse.json({
      videos: recentVideosWithProgress
    })

  } catch (error) {
    console.error('Error fetching recent videos with progress:', error)
    return NextResponse.json({ error: 'Failed to fetch recent videos' }, { status: 500 })
  }
}
