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

    // Get all video progress records for the user
    const videoProgressRecords = await payload.find({
      collection: 'video-progress',
      where: {
        and: [
          { tenant: { equals: tenant.id } },
          { user: { equals: userId } }
        ]
      },
      depth: 2,
      limit: 1000 // Get all records
    })

    let totalWatchTimeSeconds = 0
    let totalVideosWatched = 0
    let totalVideosCompleted = 0

    // Calculate total watch time from all video progress records
    for (const progressRecord of videoProgressRecords.docs) {
      const video = progressRecord.video as any
      const currentTime = progressRecord.currentTime || 0
      const progress = progressRecord.progress || 0
      
      if (currentTime > 0) {
        totalVideosWatched++
        
        // Add the current time (how far they've watched) to total
        totalWatchTimeSeconds += currentTime
        
        // Count as completed if 90%+ watched
        if (progress >= 90) {
          totalVideosCompleted++
        }
      }
    }

    // Convert seconds to hours, minutes, seconds for display
    const hours = Math.floor(totalWatchTimeSeconds / 3600)
    const minutes = Math.floor((totalWatchTimeSeconds % 3600) / 60)
    const seconds = Math.floor(totalWatchTimeSeconds % 60)

    // Format time display
    let formattedTime = ''
    if (hours > 0) {
      formattedTime = `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      formattedTime = `${minutes}m ${seconds}s`
    } else {
      formattedTime = `${seconds}s`
    }

    return NextResponse.json({
      totalWatchTimeSeconds,
      formattedTime,
      totalVideosWatched,
      totalVideosCompleted,
      breakdown: {
        hours,
        minutes,
        seconds
      }
    })

  } catch (error) {
    console.error('Error fetching user learning time:', error)
    return NextResponse.json({ error: 'Failed to fetch learning time' }, { status: 500 })
  }
}
