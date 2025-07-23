import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import Stripe from 'stripe'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
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
      return NextResponse.json({
        hasSubscription: false,
        subscriptions: [],
        paymentMethods: [],
        invoices: [],
        message: 'No billing information found'
      })
    }

    const customer = customerRecord.docs[0]
    const stripeCustomerId = customer.stripeCustomerId

    if (!stripeCustomerId) {
      return NextResponse.json({
        hasSubscription: false,
        subscriptions: [],
        paymentMethods: [],
        invoices: [],
        message: 'No Stripe customer ID found'
      })
    }

    // Initialize Stripe with tenant-specific credentials
    const stripeSecretKey = (tenant as any).stripeSecretKey || process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe not configured for this tenant' }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-08-01'
    })

    // Fetch customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'all',
      expand: ['data.default_payment_method', 'data.items.data.price.product']
    })

    // Fetch customer's payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: 'card'
    })

    // Fetch recent invoices
    const invoices = await stripe.invoices.list({
      customer: stripeCustomerId,
      limit: 10,
      expand: ['data.payment_intent']
    })

    // Format subscription data
    const formattedSubscriptions = subscriptions.data.map(subscription => {
      const product = subscription.items.data[0]?.price?.product as Stripe.Product
      const price = subscription.items.data[0]?.price
      
      return {
        id: subscription.id,
        status: subscription.status,
        productName: product?.name || 'Unknown Product',
        productDescription: product?.description || '',
        amount: price?.unit_amount ? price.unit_amount / 100 : 0,
        currency: price?.currency || 'usd',
        interval: price?.recurring?.interval || 'month',
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at,
        trialEnd: subscription.trial_end,
        defaultPaymentMethod: subscription.default_payment_method
      }
    })

    // Format payment methods
    const formattedPaymentMethods = paymentMethods.data.map(pm => ({
      id: pm.id,
      type: pm.type,
      card: pm.card ? {
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year
      } : null
    }))

    // Format invoices
    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      number: invoice.number,
      status: invoice.status,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      created: invoice.created,
      paidAt: invoice.status_transitions?.paid_at,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdf: invoice.invoice_pdf,
      description: invoice.lines.data[0]?.description || 'Subscription payment'
    }))

    return NextResponse.json({
      hasSubscription: subscriptions.data.length > 0,
      subscriptions: formattedSubscriptions,
      paymentMethods: formattedPaymentMethods,
      invoices: formattedInvoices,
      stripeCustomerId
    })

  } catch (error) {
    console.error('Error fetching billing data:', error)
    return NextResponse.json({ error: 'Failed to fetch billing data' }, { status: 500 })
  }
}
