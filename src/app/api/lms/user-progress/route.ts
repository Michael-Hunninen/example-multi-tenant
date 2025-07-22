import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get current user to determine tenant context
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's tenant
    const userTenant = user.tenants?.[0]?.tenant
    const tenantId = typeof userTenant === 'string' ? userTenant : userTenant?.id

    if (!tenantId) {
      return NextResponse.json({ error: 'User tenant not found' }, { status: 404 })
    }

    // Fetch user enrollments to calculate progress
    const enrollments = await payload.find({
      collection: 'enrollments',
      where: {
        and: [
          { user: { equals: userId } },
          { tenant: { equals: tenantId } }
        ]
      },
      limit: 100
    })

    // Fetch user's video progress
    const videoProgress = await payload.find({
      collection: 'video-progress',
      where: {
        and: [
          { user: { equals: userId } },
          { tenant: { equals: tenantId } }
        ]
      },
      limit: 1000
    })

    // Calculate overall progress
    const totalEnrollments = enrollments.docs.length
    const completedEnrollments = enrollments.docs.filter(enrollment => 
      (enrollment.progress || 0) >= 100
    ).length

    const overallProgress = totalEnrollments > 0 
      ? (completedEnrollments / totalEnrollments) * 100 
      : 0

    // Calculate monthly video progress (current month)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthlyVideos = videoProgress.docs.filter(progress => {
      const progressDate = new Date(progress.updatedAt)
      return progressDate.getMonth() === currentMonth && 
             progressDate.getFullYear() === currentYear &&
             progress.completed === true
    }).length

    // Calculate monthly progress as percentage of monthly goal (assume 20 videos per month)
    const monthlyGoal = 20
    const monthlyProgress = Math.min((monthlyVideos / monthlyGoal) * 100, 100)

    // Calculate goal progress (programs completed vs total enrolled)
    const goalProgress = totalEnrollments > 0 
      ? (completedEnrollments / totalEnrollments) * 100 
      : 0

    // Get total programs available for context
    const totalPrograms = await payload.find({
      collection: 'programs',
      where: {
        tenant: { equals: tenantId }
      },
      limit: 1
    })

    // Calculate total watch time in seconds from video progress
    const totalWatchTimeSeconds = videoProgress.docs.reduce((total, progress) => {
      return total + (progress.watchTime || 0)
    }, 0)

    // Calculate login streak by checking user's login history
    // Get user's recent login dates from updatedAt field (approximation)
    const userLoginHistory = await payload.find({
      collection: 'users',
      where: {
        id: { equals: userId }
      },
      limit: 1
    })

    // Calculate streak based on consecutive days of activity
    // For now, we'll use video progress activity as a proxy for login activity
    const today = new Date()
    const oneDayMs = 24 * 60 * 60 * 1000
    let currentStreak = 0
    
    // Get unique activity dates from video progress (sorted by date)
    const activityDates = [...new Set(
      videoProgress.docs.map(progress => {
        const date = new Date(progress.updatedAt)
        return date.toDateString()
      })
    )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    // Calculate consecutive days
    if (activityDates.length > 0) {
      const mostRecentActivity = new Date(activityDates[0])
      const daysSinceLastActivity = Math.floor((today.getTime() - mostRecentActivity.getTime()) / oneDayMs)
      
      // If last activity was today or yesterday, start counting streak
      if (daysSinceLastActivity <= 1) {
        currentStreak = 1
        
        // Count consecutive days backwards
        for (let i = 1; i < activityDates.length; i++) {
          const currentDate = new Date(activityDates[i])
          const previousDate = new Date(activityDates[i - 1])
          const daysDiff = Math.floor((previousDate.getTime() - currentDate.getTime()) / oneDayMs)
          
          if (daysDiff === 1) {
            currentStreak++
          } else {
            break
          }
        }
      }
    }

    const progressData = {
      overallProgress: Math.round(overallProgress),
      monthlyVideos,
      monthlyProgress: Math.round(monthlyProgress),
      completedPrograms: completedEnrollments,
      totalPrograms: totalEnrollments,
      goalProgress: Math.round(goalProgress),
      totalAvailablePrograms: totalPrograms.totalDocs,
      totalWatchTimeSeconds,
      currentStreak
    }

    return NextResponse.json(progressData)

  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user progress' },
      { status: 500 }
    )
  }
}
