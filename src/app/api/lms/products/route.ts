import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get tenant from domain
    const domain = request.headers.get('host') || 'localhost:3000'
    const tenant = await getTenantByDomain(domain)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const payload = await getPayload({ config })

    // Build query conditions
    const whereConditions: any = {
      and: [
        { tenant: { equals: tenant.id } }
      ]
    }

    // Add active filter if specified
    if (active === 'true') {
      whereConditions.and.push({ active: { equals: true } })
    }

    // Fetch products from the CMS
    const products = await payload.find({
      collection: 'products',
      where: whereConditions,
      limit,
      sort: '-createdAt',
      depth: 2
    })

    // Format products for the frontend
    const formattedProducts = products.docs.map(product => {
      console.log('Raw product from CMS:', JSON.stringify(product, null, 2))
      console.log('Product prices array:', product.prices)
      console.log('Prices length:', product.prices?.length || 0)
      
      // Ensure prices are properly formatted as numbers
      const formattedPrices = product.prices?.map(price => {
        // Parse amount to ensure it's a number
        let priceAmount = 0
        if (typeof price.amount === 'string') {
          // If it's a string, try to parse it
          priceAmount = parseInt(price.amount, 10) || 0
        } else if (typeof price.amount === 'number') {
          priceAmount = price.amount
        }
        
        // Log price conversion
        console.log('Price conversion:', price.amount, '->', priceAmount, 'for', product.name)
        
        return {
          amount: priceAmount,
          currency: price.currency || 'usd',
          interval: price.interval,
          stripePriceId: price.stripePriceId,
          label: price.label || (price.interval ? `${price.interval}ly` : 'one-time')
        }
      }) || []

      // If no prices, create default ones for testing
      if (!formattedPrices.length) {
        console.log('No prices found for product, creating default test prices')
        formattedPrices.push({
          amount: product.name.includes('Premium') ? 4900 : (product.name.includes('VIP') ? 9900 : 2900),
          currency: 'usd',
          interval: 'month',
          stripePriceId: '',
          label: 'Monthly'
        },
        {
          amount: product.name.includes('Premium') ? 47900 : (product.name.includes('VIP') ? 97900 : 27900),
          currency: 'usd',
          interval: 'year',
          stripePriceId: '',
          label: 'Yearly'
        })
      }
      
      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        type: product.type || 'one_time',
        features: product.features?.map(f => f.feature) || [],
        accessLevel: product.accessLevel || 'basic',
        active: product.active || false,
        featured: product.featured || false,
        stripeProductId: product.stripeProductId,
        prices: formattedPrices
      }
    })

    return NextResponse.json({
      products: formattedProducts,
      totalDocs: products.totalDocs,
      limit: products.limit,
      page: products.page,
      totalPages: products.totalPages
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
