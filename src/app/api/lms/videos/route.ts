import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    
    const payload = await getPayload({ config })
    
    // Build where clause for filtering
    const where: any = {}
    
    if (category && category !== 'All') {
      where['category.name'] = { equals: category }
    }
    
    if (difficulty && difficulty !== 'All') {
      where.difficulty = { equals: difficulty.toLowerCase() }
    }
    
    if (search) {
      where.or = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }
    
    const videos = await payload.find({
      collection: 'videos',
      where,
      limit,
      page,
      depth: 2,
      sort: '-createdAt'
    })
    
    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}
