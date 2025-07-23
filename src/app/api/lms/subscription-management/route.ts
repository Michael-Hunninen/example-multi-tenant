import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, subscriptionId, priceId, paymentMethodId } = body
    
    if (!userId || !action) {
      return NextResponse.json({ error: 'User ID and action are required' }, { status: 400 })
    }

    // Get tenant from domain
    const domain = request.headers.get('host') || 'localhost:3000'
    const tenant = await getTenantByDomain(domain)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const payload = await getPayload({ config })

    // Get user's customer record
    const customerRecord = await payload.find({
      collection: 'customers',
      where: {
        and: [
          { tenant: { equals: tenant.id } },
          { user: { equals: userId } }
        ]
      },
      limit: 1
    })

    if (customerRecord.docs.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const customer = customerRecord.docs[0]
    const stripeCustomerId = customer.stripeCustomerId

    if (!stripeCustomerId) {
      return NextResponse.json({ error: 'Stripe customer ID not found' }, { status: 404 })
    }

    // Initialize Stripe with tenant-specific credentials
    const stripeSecretKey = (tenant as any).stripeSecretKey || process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe not configured for this tenant' }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-08-01'
    })

    let result: any = {}

    switch (action) {
      case 'cancel_subscription':
        if (!subscriptionId) {
          return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 })
        }
        
        // Cancel subscription at period end
        const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true
        })
        
        result = {
          success: true,
          message: 'Subscription will be canceled at the end of the current billing period',
          subscription: {
            id: canceledSubscription.id,
            cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
            currentPeriodEnd: canceledSubscription.current_period_end
          }
        }
        break

      case 'reactivate_subscription':
        if (!subscriptionId) {
          return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 })
        }
        
        // Reactivate subscription (remove cancel_at_period_end)
        const reactivatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: false
        })
        
        result = {
          success: true,
          message: 'Subscription has been reactivated',
          subscription: {
            id: reactivatedSubscription.id,
            cancelAtPeriodEnd: reactivatedSubscription.cancel_at_period_end
          }
        }
        break

      case 'change_plan':
        if (!subscriptionId || !priceId) {
          return NextResponse.json({ error: 'Subscription ID and price ID are required' }, { status: 400 })
        }
        
        // Get current subscription
        const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId)
        
        // Update subscription to new price
        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          items: [{
            id: currentSubscription.items.data[0].id,
            price: priceId
          }],
          proration_behavior: 'create_prorations'
        })
        
        result = {
          success: true,
          message: 'Plan has been updated successfully',
          subscription: {
            id: updatedSubscription.id,
            status: updatedSubscription.status
          }
        }
        break

      case 'update_payment_method':
        if (!paymentMethodId) {
          return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 })
        }
        
        // Attach payment method to customer
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: stripeCustomerId
        })
        
        // Set as default payment method
        await stripe.customers.update(stripeCustomerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId
          }
        })
        
        // Update all active subscriptions to use this payment method
        const subscriptions = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          status: 'active'
        })
        
        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.update(subscription.id, {
            default_payment_method: paymentMethodId
          })
        }
        
        result = {
          success: true,
          message: 'Payment method has been updated successfully'
        }
        break

      case 'create_customer_portal_session':
        // Create Stripe Customer Portal session for self-service
        const session = await stripe.billingPortal.sessions.create({
          customer: stripeCustomerId,
          return_url: `${request.headers.get('origin')}/dashboard/settings?tab=billing`
        })
        
        result = {
          success: true,
          url: session.url
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error managing subscription:', error)
    return NextResponse.json({ 
      error: 'Failed to manage subscription',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
