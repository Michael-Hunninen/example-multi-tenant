import { NextRequest, NextResponse } from 'next/server'
import { getUserEnrollments } from '@/utilities/lmsData'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = searchParams.get('limit')
    const status = searchParams.get('status')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    const options: any = {}
    if (limit) options.limit = parseInt(limit)
    if (status) options.status = status
    
    const enrollments = await getUserEnrollments(userId, options)
    return NextResponse.json(enrollments)
  } catch (error) {
    console.error('Error fetching user enrollments:', error)
    return NextResponse.json({ error: 'Failed to fetch user enrollments' }, { status: 500 })
  }
}
