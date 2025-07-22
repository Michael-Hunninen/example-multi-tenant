import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { userId, subscriptionId, tenantSlug } = await request.json()

    console.log('🧪 Testing customer creation for:', { userId, subscriptionId, tenantSlug })

    // The issue is authentication - the API needs to run with proper user context
    // Let's use the local API approach that bypasses authentication for testing
    console.log('🔑 Running with local API context (bypassing auth for testing)')

    // Set tenant context if provided
    let tenant = null
    if (tenantSlug) {
      console.log('🏢 Setting tenant context:', tenantSlug)
      // Find the tenant
      const tenantResult = await payload.find({
        collection: 'tenants',
        where: {
          slug: {
            equals: tenantSlug,
          },
        },
        limit: 1,
      })
      
      if (tenantResult.docs.length > 0) {
        tenant = tenantResult.docs[0]
        console.log('✅ Tenant found:', tenant.name, 'ID:', tenant.id)
      } else {
        console.log('⚠️ Tenant not found:', tenantSlug)
        return NextResponse.json({
          success: false,
          error: `Tenant not found: ${tenantSlug}`
        }, { status: 404 })
      }
    }

    // First, let's verify the subscription exists
    let subscription = null
    try {
      subscription = await payload.findByID({
        collection: 'subscriptions',
        id: subscriptionId,
      })
      console.log('📋 Subscription found:', subscription ? `ID: ${subscription.id}, User: ${subscription.user}, Status: ${subscription.status}` : 'Not found')
    } catch (error) {
      console.log('❌ Subscription lookup error:', error)
      return NextResponse.json({
        success: false,
        error: `Subscription not found: ${subscriptionId}`
      }, { status: 404 })
    }

    // Check if customer already exists for this user
    const existingCustomer = await payload.find({
      collection: 'customers',
      where: {
        user: {
          equals: userId,
        },
      },
      limit: 1,
    })

    console.log('🔍 Existing customer check:', existingCustomer.docs.length > 0 ? 'Found' : 'Not found')

    // If customer doesn't exist, create one
    if (existingCustomer.docs.length === 0) {
      // Get user details
      let user = null
      try {
        user = await payload.findByID({
          collection: 'users',
          id: userId,
        })
        console.log('👤 User found:', user ? `Email: ${user.email}, ID: ${user.id}, Tenants: ${JSON.stringify(user.tenants)}` : 'Not found')
      } catch (error) {
        console.log('❌ User lookup error:', error)
        console.log('❌ Full error details:', JSON.stringify(error, null, 2))
        return NextResponse.json({
          success: false,
          error: `User lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }, { status: 404 })
      }

      if (user) {
        const customerData: any = {
          user: userId,
          email: user.email,
          name: (user as any).name || user.email,
          currency: 'usd',
          metadata: {
            createdFrom: 'manual-test',
            subscriptionId: subscriptionId,
            createdAt: new Date().toISOString(),
          },
        }

        // Add tenant if available (required for multi-tenant setup)
        if (tenant) {
          customerData.tenant = tenant.id
          console.log('🏢 Adding tenant to customer data:', tenant.id)
        }

        const newCustomer = await payload.create({
          collection: 'customers',
          data: customerData,
          overrideAccess: true, // Bypass access control for testing
        })

        console.log('✅ Customer created successfully:', newCustomer.id)

        return NextResponse.json({
          success: true,
          message: 'Customer created successfully',
          customerId: newCustomer.id,
          customerEmail: newCustomer.email
        })
      } else {
        return NextResponse.json({
          success: false,
          error: 'User not found'
        }, { status: 404 })
      }
    } else {
      console.log('ℹ️ Customer already exists:', existingCustomer.docs[0].id)
      return NextResponse.json({
        success: true,
        message: 'Customer already exists',
        customerId: existingCustomer.docs[0].id,
        customerEmail: existingCustomer.docs[0].email
      })
    }
  } catch (error) {
    console.error('❌ Error in customer creation test:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
