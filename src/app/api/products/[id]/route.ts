import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Fetch product from Payload
    const product = await payload.findByID({
      collection: 'products',
      id: id,
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform the product data for frontend consumption
    const transformedProduct = {
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
      relatedPrograms: product.relatedPrograms || [],
      relatedVideos: product.relatedVideos || [],
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
