import { NextRequest, NextResponse } from 'next/server'
import { getFeaturedContent } from '@/utilities/lmsData'

export async function GET(request: NextRequest) {
  try {
    const content = await getFeaturedContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching featured content:', error)
    return NextResponse.json({ error: 'Failed to fetch featured content' }, { status: 500 })
  }
}
