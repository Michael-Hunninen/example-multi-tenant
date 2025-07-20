import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    const payload = await getPayload({ config })
    
    // Get user data
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
      depth: 2
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Get user enrollments for stats
    const enrollments = await payload.find({
      collection: 'enrollments',
      where: { user: { equals: userId } },
      limit: 100,
      depth: 1
    })
    
    // Get user video progress for stats
    const videoProgress = await payload.find({
      collection: 'video-progress',
      where: { user: { equals: userId } },
      limit: 100,
      depth: 1
    })
    
    // Get user achievements
    const userAchievements = await payload.find({
      collection: 'user-achievements',
      where: { user: { equals: userId } },
      depth: 2
    })
    
    // Calculate stats
    const stats = {
      videosWatched: videoProgress.docs.length,
      programsCompleted: enrollments.docs.filter(e => e.status === 'completed').length,
      totalWatchTime: Math.round(videoProgress.docs.reduce((total, vp) => total + (vp.watchTime || 0), 0) / 3600 * 10) / 10, // Convert to hours
      currentStreak: 7, // Mock for now - would need streak calculation logic
      achievements: userAchievements.docs.length,
      points: userAchievements.docs.reduce((total, ua) => total + (ua.achievement?.points || 0), 0)
    }
    
    // Get recent activity (last 10 video progress updates and enrollments)
    const recentVideoProgress = await payload.find({
      collection: 'video-progress',
      where: { user: { equals: userId } },
      limit: 5,
      sort: '-lastWatchedAt',
      depth: 2
    })
    
    const recentEnrollments = await payload.find({
      collection: 'enrollments',
      where: { user: { equals: userId } },
      limit: 5,
      sort: '-enrolledAt',
      depth: 2
    })
    
    // Transform recent activity
    const recentActivity = [
      ...recentVideoProgress.docs.map(vp => ({
        id: vp.id,
        type: vp.completed ? 'video_completed' : 'video_progress',
        title: vp.completed ? `Completed '${vp.video?.title}'` : `Watched '${vp.video?.title}'`,
        date: new Date(vp.lastWatchedAt).toLocaleDateString(),
        timestamp: vp.lastWatchedAt
      })),
      ...recentEnrollments.docs.map(enrollment => ({
        id: enrollment.id,
        type: enrollment.status === 'completed' ? 'program_completed' : 'program_started',
        title: enrollment.status === 'completed' ? `Completed '${enrollment.program?.title}'` : `Started '${enrollment.program?.title}'`,
        date: new Date(enrollment.enrolledAt).toLocaleDateString(),
        timestamp: enrollment.enrolledAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)
    
    const profileData = {
      id: user.id,
      name: user.username || user.email.split('@')[0],
      email: user.email,
      phone: '', // User schema doesn't have phone field
      location: '', // User schema doesn't have location field
      bio: '', // User schema doesn't have bio field
      avatar: user.avatar?.url || null,
      joinDate: user.createdAt,
      role: user.roles?.includes('business') ? 'Business Member' : 
            user.roles?.includes('admin') ? 'Admin Member' : 
            user.roles?.includes('super-admin') ? 'Super Admin' : 'Regular Member',
      stats,
      achievements: userAchievements.docs.map(ua => ({
        id: ua.id,
        title: ua.achievement?.title || 'Achievement',
        description: ua.achievement?.description || '',
        icon: ua.achievement?.icon || '🏆',
        earnedDate: ua.earnedAt
      })),
      recentActivity
    }
    
    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Error fetching profile data:', error)
    return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    const updateData = await request.json()
    const payload = await getPayload({ config })
    
    // Update user profile (only username since other fields don't exist in User schema)
    const updatedUser = await payload.update({
      collection: 'users',
      id: userId,
      data: {
        username: updateData.name
        // Note: phone, location, bio fields don't exist in the User collection schema
        // These would need to be added to the Users collection configuration first
      }
    })
    
    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
