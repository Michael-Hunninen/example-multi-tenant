import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') // 'subscription' | 'one_time' | etc.
    const featured = searchParams.get('featured') === 'true'
    const active = searchParams.get('active') !== 'false' // default to true

    // Build query conditions
    const where: any = {}
    
    if (active) {
      where.active = { equals: true }
    }
    
    if (type) {
      where.type = { equals: type }
    }
    
    if (featured) {
      where.featured = { equals: true }
    }

    // Fetch products from Payload
    const products = await payload.find({
      collection: 'products',
      where,
      page,
      limit,
      sort: '-createdAt',
    })

    // Transform products for frontend consumption
    const transformedProducts = products.docs.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      type: product.type,
      recurringInterval: product.recurringInterval,
      features: product.features?.map((f: any) => f.feature) || [],
      accessLevel: product.accessLevel,
      active: product.active,
      featured: product.featured,
      image: product.image ? {
        url: typeof product.image === 'object' ? product.image.url : '',
        alt: typeof product.image === 'object' ? product.image.alt : product.name,
      } : null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    return NextResponse.json({
      docs: transformedProducts,
      totalDocs: products.totalDocs,
      limit: products.limit,
      totalPages: products.totalPages,
      page: products.page,
      pagingCounter: products.pagingCounter,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
