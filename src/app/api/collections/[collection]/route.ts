import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(req: NextRequest, { params }: { params: { collection: string }}) {
  try {
    const collection = params.collection
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)
    
    // Allow only specific collections for security
    const allowedCollections = ['posts', 'media']
    if (!allowedCollections.includes(collection)) {
      return NextResponse.json({ error: 'Collection not allowed' }, { status: 403 })
    }
    
    const payload = await getPayload({ config: configPromise })
    
    // Get tenant from cookie to respect multi-tenant isolation
    const cookieStore = cookies()
    const tenantCookie = cookieStore.get('payload-tenant')
    const tenant = tenantCookie?.value
    
    const result = await payload.find({
      collection: collection as any,
      limit,
      page,
      pagination: true,
      depth: 2, // To resolve nested relations like categories
      where: tenant ? {
        tenant: {
          equals: tenant
        }
      } : undefined
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching collection data:', error)
    return NextResponse.json({ error: 'Failed to fetch collection data' }, { status: 500 })
  }
}
