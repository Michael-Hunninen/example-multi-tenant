import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    
    const payload = await getPayload({ config })
    
    // Build where clause for filtering
    const where: any = {}
    
    if (category && category !== 'All') {
      where['category.name'] = { equals: category }
    }
    
    if (level && level !== 'All') {
      where.level = { equals: level.toLowerCase() }
    }
    
    if (search) {
      where.or = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }
    
    const programs = await payload.find({
      collection: 'programs',
      where,
      limit,
      page,
      depth: 2,
      sort: '-createdAt'
    })
    
    return NextResponse.json(programs)
  } catch (error) {
    console.error('Error fetching programs:', error)
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
  }
}
