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

    // Get user's video progress activity as a proxy for login activity
    // This gives us dates when the user was active in the system
    const videoProgressRecords = await payload.find({
      collection: 'video-progress',
      where: {
        and: [
          { tenant: { equals: tenant.id } },
          { user: { equals: userId } }
        ]
      },
      sort: '-updatedAt',
      limit: 1000 // Get all records to analyze activity pattern
    })

    // Also check for any other user activity (enrollments, comments, etc.)
    const enrollmentActivity = await payload.find({
      collection: 'enrollments',
      where: {
        and: [
          { tenant: { equals: tenant.id } },
          { user: { equals: userId } }
        ]
      },
      sort: '-updatedAt',
      limit: 100
    })

    // Combine all activity dates
    const allActivityDates = [
      ...videoProgressRecords.docs.map(record => new Date(record.updatedAt)),
      ...enrollmentActivity.docs.map(record => new Date(record.updatedAt))
    ]

    // Get unique dates (ignore time, just date)
    const uniqueActivityDates = [...new Set(
      allActivityDates.map(date => date.toDateString())
    )].map(dateString => new Date(dateString))
      .sort((a, b) => b.getTime() - a.getTime()) // Sort newest first

    // Calculate streak
    let currentStreak = 0
    const today = new Date()
    const oneDayMs = 24 * 60 * 60 * 1000

    if (uniqueActivityDates.length > 0) {
      const mostRecentActivity = uniqueActivityDates[0]
      const daysSinceLastActivity = Math.floor((today.getTime() - mostRecentActivity.getTime()) / oneDayMs)
      
      // If last activity was today or yesterday, start counting streak
      if (daysSinceLastActivity <= 1) {
        currentStreak = 1
        
        // Count consecutive days backwards
        for (let i = 1; i < uniqueActivityDates.length; i++) {
          const currentDate = uniqueActivityDates[i]
          const previousDate = uniqueActivityDates[i - 1]
          const daysDiff = Math.floor((previousDate.getTime() - currentDate.getTime()) / oneDayMs)
          
          // If exactly 1 day apart, continue streak
          if (daysDiff === 1) {
            currentStreak++
          } else {
            // Gap found, break streak
            break
          }
        }
      }
    }

    // Get some additional stats for context
    const totalActiveDays = uniqueActivityDates.length
    const firstActivityDate = uniqueActivityDates.length > 0 ? uniqueActivityDates[uniqueActivityDates.length - 1] : null
    const lastActivityDate = uniqueActivityDates.length > 0 ? uniqueActivityDates[0] : null

    return NextResponse.json({
      currentStreak,
      totalActiveDays,
      firstActivityDate,
      lastActivityDate,
      recentActivityDates: uniqueActivityDates.slice(0, 7), // Last 7 days of activity
      streakStatus: currentStreak > 0 ? 'active' : 'inactive'
    })

  } catch (error) {
    console.error('Error fetching user login streak:', error)
    return NextResponse.json({ error: 'Failed to fetch login streak' }, { status: 500 })
  }
}
