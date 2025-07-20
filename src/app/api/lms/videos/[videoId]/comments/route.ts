import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    
    const payload = await getPayload({ config })
    
    // Get comments for this video
    const comments = await payload.find({
      collection: 'comments',
      where: {
        video: { equals: params.videoId },
        approved: { equals: true } // Only show approved comments
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
  { params }: { params: { videoId: string } }
) {
  try {
    const { content, userId } = await request.json()
    
    if (!content || !userId) {
      return NextResponse.json({ error: 'Content and user ID are required' }, { status: 400 })
    }
    
    const payload = await getPayload({ config })
    
    // Create new comment
    const newComment = await payload.create({
      collection: 'comments',
      data: {
        video: params.videoId,
        user: userId,
        content
      }
    })
    
    return NextResponse.json({ success: true, comment: newComment })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
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
