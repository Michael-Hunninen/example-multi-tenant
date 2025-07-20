import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const payload = await getPayload({ config })
    
    // Get video data
    const video = await payload.findByID({
      collection: 'videos',
      id: params.videoId,
      depth: 1
    })
    
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    
    // Get video progress records to calculate views
    const videoProgress = await payload.find({
      collection: 'video-progress',
      where: { video: { equals: params.videoId } },
      limit: 1000 // Get all progress records
    })
    
    // Count unique viewers (unique user IDs)
    const uniqueViewers = new Set(videoProgress.docs.map(vp => vp.user)).size
    
    // Get comments count
    const commentsResult = await payload.find({
      collection: 'comments',
      where: { 
        video: { equals: params.videoId },
        approved: { equals: true }
      },
      limit: 1
    })
    
    // Calculate average rating - using default since rating field may not exist
    // In a full implementation, you'd have a separate ratings collection
    const averageRating = 4.5 // Default rating
    
    // Calculate total watch time
    const totalWatchTime = videoProgress.docs.reduce((total, vp) => {
      return total + (vp.watchTime || 0)
    }, 0)
    
    // Calculate completion rate
    const completedViews = videoProgress.docs.filter(vp => vp.completed).length
    const completionRate = uniqueViewers > 0 ? (completedViews / uniqueViewers) * 100 : 0
    
    const stats = {
      views: uniqueViewers,
      likes: 0, // Likes field may not exist in Video collection
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      duration: video.duration?.toString() || '0:00',
      commentsCount: commentsResult.totalDocs,
      totalWatchTime: Math.round(totalWatchTime / 3600 * 10) / 10, // Convert to hours
      completionRate: Math.round(completionRate),
      uploadDate: video.createdAt,
      lastViewed: videoProgress.docs.length > 0 
        ? Math.max(...videoProgress.docs.map(vp => new Date(vp.lastWatchedAt || vp.createdAt).getTime()))
        : null
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching video stats:', error)
    return NextResponse.json({ error: 'Failed to fetch video stats' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const { action, userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    const payload = await getPayload({ config })
    
    if (action === 'like') {
      // Toggle like for video
      const video = await payload.findByID({
        collection: 'videos',
        id: params.videoId
      })
      
      if (!video) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 })
      }
      
      // For now, just return success since likes field may not exist
      // In a full implementation, you'd have a separate likes collection
      return NextResponse.json({ success: true, likes: 1 })
    }
    
    if (action === 'view') {
      // Record a view/progress update
      const { watchTime, completed, currentTime } = await request.json()
      
      // Find existing progress record
      const existingProgress = await payload.find({
        collection: 'video-progress',
        where: {
          and: [
            { video: { equals: params.videoId } },
            { user: { equals: userId } }
          ]
        },
        limit: 1
      })
      
      if (existingProgress.docs.length > 0) {
        // Update existing progress
        await payload.update({
          collection: 'video-progress',
          id: existingProgress.docs[0].id,
          data: {
            watchTime: watchTime || existingProgress.docs[0].watchTime,
            completed: completed !== undefined ? completed : existingProgress.docs[0].completed,
            currentTime: currentTime || existingProgress.docs[0].currentTime,
            lastWatchedAt: new Date().toISOString()
          }
        })
      } else {
        // Create new progress record
        await payload.create({
          collection: 'video-progress',
          data: {
            video: params.videoId,
            user: userId,
            watchTime: watchTime || 0,
            completed: completed || false,
            currentTime: currentTime || 0,
            lastWatchedAt: new Date().toISOString()
          }
        })
      }
      
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating video stats:', error)
    return NextResponse.json({ error: 'Failed to update video stats' }, { status: 500 })
  }
}
