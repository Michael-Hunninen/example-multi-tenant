import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'upcoming' or 'past'
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    
    const payload = await getPayload({ config })
    
    // Build where clause for filtering
    const where: any = {}
    const now = new Date()
    
    if (type === 'upcoming') {
      where.scheduledDate = { greater_than: now }
    } else if (type === 'past') {
      where.scheduledDate = { less_than: now }
    }
    
    const sort = type === 'upcoming' ? 'scheduledDate' : '-scheduledDate'
    
    // For now, we'll use a mock structure since lessons collection might not exist yet
    // This can be updated when the lessons collection is properly implemented
    const lessons = await payload.find({
      collection: 'programs', // Using programs as a placeholder
      where: {},
      limit,
      page,
      depth: 2,
      sort: '-createdAt'
    })
    
    // Transform the data to match lesson structure
    const transformedLessons = {
      ...lessons,
      docs: lessons.docs.map((program: any) => ({
        id: program.id,
        title: `Live Session: ${program.title}`,
        instructor: program.instructor?.name || 'Instructor',
        scheduledDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Random future date
        duration: 60,
        type: 'live',
        description: program.description,
        maxParticipants: 20,
        currentParticipants: Math.floor(Math.random() * 15),
        isRecorded: true,
        recordingUrl: null
      }))
    }
    
    return NextResponse.json(transformedLessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
  }
}
