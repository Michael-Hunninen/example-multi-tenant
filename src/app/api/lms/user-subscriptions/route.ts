import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status') || 'active'

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Fetch user's subscriptions with the specified status
    const subscriptions = await payload.find({
      collection: 'subscriptions',
      where: {
        and: [
          {
            user: {
              equals: userId,
            },
          },
          {
            status: {
              equals: status,
            },
          },
        ],
      },
      depth: 2, // Include product details
      limit: 50,
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Error fetching user subscriptions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user subscriptions' },
      { status: 500 }
    )
  }
}
