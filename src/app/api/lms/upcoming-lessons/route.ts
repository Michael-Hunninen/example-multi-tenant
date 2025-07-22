import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '5')
    
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

    // Get user's active enrollments to find upcoming lessons
    const enrollments = await payload.find({
      collection: 'enrollments',
      where: {
        and: [
          { tenant: { equals: tenant.id } },
          { user: { equals: userId } },
          { status: { equals: 'active' } }
        ]
      },
      depth: 2,
      limit: 20
    })

    const upcomingLessons: any[] = []
    const now = new Date()

    // For each enrollment, find upcoming lessons in their programs
    for (const enrollment of enrollments.docs) {
      const program = enrollment.program as any
      
      if (!program || typeof program === 'string' || !program.lessons) continue

      // Get lessons from the program that are scheduled in the future
      for (const lesson of program.lessons) {
        // Check if lesson has a scheduled date/time
        if (lesson.scheduledDate) {
          const lessonDate = new Date(lesson.scheduledDate)
          
          // Only include future lessons
          if (lessonDate > now) {
            upcomingLessons.push({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              instructor: (program as any).instructor?.name || (lesson as any).instructor?.name || 'Unknown Instructor',
              date: lessonDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short', 
                day: 'numeric' 
              }),
              time: lessonDate.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              }),
              type: lesson.type || 'Lesson',
              programTitle: (program as any).title,
              scheduledDate: lessonDate.toISOString()
            })
          }
        }
      }
    }

    // Sort by scheduled date (earliest first) and limit results
    upcomingLessons.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    const limitedLessons = upcomingLessons.slice(0, limit)

    // If no real upcoming lessons, provide some helpful placeholder content
    if (limitedLessons.length === 0) {
      return NextResponse.json({
        lessons: [],
        message: 'No upcoming scheduled lessons. Check your enrolled programs for new content.',
        totalCount: 0
      })
    }

    return NextResponse.json({
      lessons: limitedLessons,
      totalCount: upcomingLessons.length
    })

  } catch (error) {
    console.error('Error fetching upcoming lessons:', error)
    return NextResponse.json({ error: 'Failed to fetch upcoming lessons' }, { status: 500 })
  }
}
