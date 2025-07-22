import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  console.log('🚨 STATS API GET - Route called!', {
    url: request.url,
    method: request.method,
    host: request.headers.get('host')
  })
  
  try {
    // Get user ID from query params to return user-specific progress
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    // Get tenant from domain
    const domain = request.headers.get('host') || 'localhost:3000'
    const tenant = await getTenantByDomain(domain)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    
    const payload = await getPayload({ config })
    
    // Get video data with tenant verification
    let video
    const { videoId } = await params
    
    try {
      video = await payload.findByID({
        collection: 'videos',
        id: videoId,
        depth: 1
      })
      
      // Check if video belongs to the current tenant
      if (video && video.tenant) {
        const videoTenantId = typeof video.tenant === 'string' ? video.tenant : video.tenant.id
        if (videoTenantId !== tenant.id) {
          video = null // Video exists but doesn't belong to this tenant
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
        limit: 1,
        depth: 1
      })
      
      if (results.docs.length > 0) {
        video = results.docs[0]
      }
    }
    
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Get video progress records to calculate views (using video.id to ensure tenant isolation)
    const videoProgress = await payload.find({
      collection: 'video-progress',
      where: { video: { equals: video.id } },
      limit: 1000 // Get all progress records
    })

    // Get current user's specific progress if userId is provided
    let userProgress = null
    if (userId) {
      const userProgressResult = await payload.find({
        collection: 'video-progress',
        where: {
          and: [
            { video: { equals: video.id } },
            { user: { equals: userId } }
          ]
        },
        limit: 1
      })

      if (userProgressResult.docs.length > 0) {
        userProgress = userProgressResult.docs[0]
        console.log('📹 Video progress loaded - currentTime:', userProgress.currentTime, 'progress:', userProgress.progress + '%')
      }
    }
    
    // Count unique viewers (unique user IDs)
    const uniqueViewers = new Set(videoProgress.docs.map(vp => vp.user)).size
    
    // Get comments count (using video.id to ensure tenant isolation)
    const commentsResult = await payload.find({
      collection: 'comments',
      where: { 
        video: { equals: video.id },
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
    
    // Get likes count for this video
    const likesResult = await payload.find({
      collection: 'video-progress',
      where: {
        and: [
          { video: { equals: video.id } },
          { liked: { equals: true } }
        ]
      },
      limit: 1000
    })
    
    // Check if current user has liked this video (handle missing field gracefully)
    const userHasLiked = userProgress ? (userProgress as any).liked || false : false
    
    // Check if current user has bookmarked this video (handle missing field gracefully)
    const userHasBookmarked = userProgress ? (userProgress as any).bookmarked || false : false
    
    const stats = {
      views: uniqueViewers,
      likes: likesResult.totalDocs,
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      duration: video.duration?.toString() || '0:00',
      commentsCount: commentsResult.totalDocs,
      totalWatchTime: Math.round(totalWatchTime / 3600 * 10) / 10, // Convert to hours
      completionRate: Math.round(completionRate),
      uploadDate: video.createdAt,
      lastViewed: userProgress ? userProgress.currentTime : null,
      userHasLiked: userHasLiked,
      userHasBookmarked: userHasBookmarked
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    const { videoId } = await params
    console.error('🚨 Stats API Error Details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined,
      name: error instanceof Error ? error.name : 'Unknown',
      videoId: videoId,
      userId: new URL(request.url).searchParams.get('userId'),
      domain: request.headers.get('host')
    })
    return NextResponse.json({ error: 'Failed to fetch video stats' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { action, userId, currentTime, duration } = await request.json()
    
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
    
    if (action === 'like') {
      // Toggle like for video with tenant verification
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
      
      // Check if user has already liked this video
      const existingProgress = await payload.find({
        collection: 'video-progress',
        where: {
          and: [
            { video: { equals: video.id } },
            { user: { equals: userId } }
          ]
        },
        limit: 1
      })
      
      let hasLiked = false
      if (existingProgress.docs.length > 0) {
        // Toggle like status (handle missing field gracefully)
        const currentLiked = (existingProgress.docs[0] as any).liked || false
        hasLiked = !currentLiked
        
        await payload.update({
          collection: 'video-progress',
          id: existingProgress.docs[0].id,
          data: {
            liked: hasLiked
          } as any
        })
      } else {
        // Create new progress record with like
        hasLiked = true
        await payload.create({
          collection: 'video-progress',
          data: {
            tenant: tenant.id,
            video: video.id,
            user: userId,
            liked: hasLiked,
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
      
      // Get total likes count for this video
      const likesResult = await payload.find({
        collection: 'video-progress',
        where: {
          and: [
            { video: { equals: video.id } },
            { liked: { equals: true } }
          ]
        },
        limit: 1000
      })
      
      return NextResponse.json({ 
        success: true, 
        liked: hasLiked, 
        totalLikes: likesResult.totalDocs 
      })
    }
    
    if (action === 'view') {
      // Record a view/progress update
      const { watchTime, completed, currentTime } = await request.json()
      
      // First verify the video belongs to this tenant
      let video
      const { videoId } = await params
      try {
        video = await payload.findByID({
          collection: 'videos',
          id: videoId,
          depth: 0
        })  
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
      
      // Find existing progress record
      const existingProgress = await payload.find({
        collection: 'video-progress',
        where: {
          and: [
            { video: { equals: video.id } },
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
            video: video.id,
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
    
    if (action === 'progress') {
      // Save video watching progress
      let video
      const { videoId } = await params
      try {
        video = await payload.findByID({
          collection: 'videos',
          id: videoId,
          depth: 0
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
      
      // Find existing progress record
      const existingProgress = await payload.find({
        collection: 'video-progress',
        where: {
          and: [
            { video: { equals: video.id } },
            { user: { equals: userId } }
          ]
        },
        limit: 1
      })
      
      const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0
      const isCompleted = progressPercentage >= 90 // Consider 90%+ as completed
      
      if (existingProgress.docs.length > 0) {
        // Update existing progress
        await payload.update({
          collection: 'video-progress',
          id: existingProgress.docs[0].id,
          data: {
            currentTime: currentTime,
            progress: Math.round(progressPercentage),
            duration: duration,
            watchTime: Math.max(existingProgress.docs[0].watchTime || 0, currentTime),
            completed: isCompleted,
            lastWatchedAt: new Date().toISOString()
          }
        })
      } else {
        // Create new progress record
        await payload.create({
          collection: 'video-progress',
          data: {
            tenant: tenant.id,
            video: video.id,
            user: userId,
            currentTime: currentTime,
            progress: Math.round(progressPercentage),
            duration: duration,
            watchTime: currentTime,
            completed: isCompleted,
            lastWatchedAt: new Date().toISOString(),
            firstWatchedAt: new Date().toISOString()
          }
        })
      }
      
      return NextResponse.json({ success: true, currentTime, completed: isCompleted })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating video stats:', error)
    return NextResponse.json({ error: 'Failed to update video stats' }, { status: 500 })
  }
}
