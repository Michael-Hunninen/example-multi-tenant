import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    
    // Get tenant from domain
    const domain = request.headers.get('host') || 'localhost:3000'
    const tenant = await getTenantByDomain(domain)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    
    const payload = await getPayload({ config })
    
    // First verify the video belongs to this tenant
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
          return NextResponse.json({ error: 'Video not found' }, { status: 404 })
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
        depth: 0
      })
      
      if (results.docs.length === 0) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 })
      }
      
      video = results.docs[0]
    }
    
    // Get comments for this video with explicit tenant filtering
    const comments = await payload.find({
      collection: 'comments',
      where: {
        and: [
          { video: { equals: video.id } },
          { status: { equals: 'approved' } }, // Use correct status field
          { tenant: { equals: tenant.id } } // Explicit tenant filtering
        ]
      },
      limit,
      page,
      sort: '-createdAt',
      depth: 2 // Include user data
    })
    
    // Transform comments data for frontend
    const transformedComments = comments.docs.map(comment => {
      const user = typeof comment.user === 'object' && comment.user !== null ? comment.user : null
      return {
        id: comment.id,
        user: user?.email?.split('@')[0] || 'Anonymous',
        avatar: null, // Avatar field may not exist in User collection
        content: comment.content,
        timestamp: formatTimeAgo(comment.createdAt),
        likes: 0, // Likes field may not exist in Comments collection
        createdAt: comment.createdAt
      }
    })
    
    return NextResponse.json({
      comments: transformedComments,
      totalDocs: comments.totalDocs,
      totalPages: comments.totalPages,
      page: comments.page,
      hasNextPage: comments.hasNextPage,
      hasPrevPage: comments.hasPrevPage
    })
  } catch (error) {
    console.error('Error fetching video comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  // Simple test to see if we can reach this endpoint
  console.log('=== COMMENT POST ENDPOINT REACHED ===')
  
  try {
    // Test basic response first
    const testMode = false // Set to true to test basic response
    if (testMode) {
      return NextResponse.json({ success: true, message: 'Test endpoint reached' })
    }
    
    console.log('POST /api/lms/videos/[videoId]/comments - Starting comment submission')
    const { content, userId } = await request.json()
    console.log('Request data:', { content: content?.substring(0, 50) + '...', userId })
    
    if (!content || !userId) {
      console.log('Missing required fields:', { content: !!content, userId: !!userId })
      return NextResponse.json({ error: 'Content and user ID are required' }, { status: 400 })
    }
    
    // Get tenant from domain
    const domain = request.headers.get('host') || 'localhost:3000'
    const tenant = await getTenantByDomain(domain)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    
    const payload = await getPayload({ config })
    
    // Set tenant context for multi-tenant operations
    // The multi-tenant plugin requires the tenant to be set in the request context
    const payloadWithTenant = {
      ...payload,
      req: {
        tenant: tenant.id
      }
    }
    
    // Verify the video belongs to this tenant
    let video
    const { videoId } = await params
    console.log('Looking for video with ID:', videoId)
    try {
      video = await payload.findByID({
        collection: 'videos',
        id: videoId,
        depth: 0
      })
      
      if (video && video.tenant) {
        const videoTenantId = typeof video.tenant === 'string' ? video.tenant : video.tenant.id
        if (videoTenantId !== tenant.id) {
          return NextResponse.json({ error: 'Video not found' }, { status: 404 })
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
        depth: 0
      })
      
      if (results.docs.length === 0) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 })
      }
      
      video = results.docs[0]
    }
    
    // Create new comment
    console.log('Creating comment with data:', {
      video: video.id,
      user: userId,
      content: content.substring(0, 50) + '...'
    })
    
    // Validate user exists
    try {
      const userExists = await payload.findByID({
        collection: 'users',
        id: userId,
        depth: 0
      })
      console.log('User validation:', { userId, exists: !!userExists })
    } catch (userError) {
      console.error('User validation failed:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const commentData = {
      video: video.id,
      user: userId,
      content,
      status: 'approved' as const, // Ensure comment is approved by default
      tenant: tenant.id // Add tenant field for multi-tenant plugin
    }
    
    console.log('About to create comment with payload.create:', commentData)
    
    const newComment = await payload.create({
      collection: 'comments',
      data: commentData
    })
    
    console.log('Comment created successfully:', newComment.id)
    
    // Transform the comment for frontend response
    const user = typeof newComment.user === 'object' && newComment.user !== null ? newComment.user : null
    const transformedComment = {
      id: newComment.id,
      user: user?.email?.split('@')[0] || 'Anonymous',
      avatar: null,
      content: newComment.content,
      timestamp: formatTimeAgo(newComment.createdAt),
      likes: newComment.likes || 0,
      createdAt: newComment.createdAt
    }
    
    return NextResponse.json(transformedComment)
  } catch (error) {
    console.error('Error creating comment:', error)
    
    // Return detailed error information for debugging
    const errorDetails = {
      error: 'Failed to create comment',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(errorDetails, { status: 500 })
  }
}

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} month${months > 1 ? 's' : ''} ago`
  }
}
