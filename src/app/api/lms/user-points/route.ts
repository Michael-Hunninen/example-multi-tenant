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

    // Get user achievements to calculate total points
    const userAchievements = await payload.find({
      collection: 'user-achievements',
      where: {
        and: [
          { tenant: { equals: tenant.id } },
          { user: { equals: userId } }
        ]
      },
      depth: 2
    })

    // Calculate total points ONLY from achievements in the CMS
    let totalPoints = 0
    const achievements = userAchievements.docs.map((userAchievement: any) => {
      const achievement = userAchievement.achievement
      if (achievement && achievement.points) {
        totalPoints += achievement.points
      }
      return {
        id: achievement?.id,
        title: achievement?.title,
        description: achievement?.description,
        points: achievement?.points || 0,
        earnedAt: userAchievement.createdAt,
        icon: achievement?.icon
      }
    })

    // Get user video progress for stats only (no automatic points)
    const videoProgress = await payload.find({
      collection: 'video-progress',
      where: {
        and: [
          { tenant: { equals: tenant.id } },
          { user: { equals: userId } },
          { progress: { greater_than: 90 } } // Videos 90%+ complete
        ]
      }
    })

    return NextResponse.json({
      totalPoints, // Only points from achievements
      achievements,
      completedVideos: videoProgress.totalDocs // For stats display only
    })

  } catch (error) {
    console.error('Error fetching user points:', error)
    return NextResponse.json({ error: 'Failed to fetch user points' }, { status: 500 })
  }
}
