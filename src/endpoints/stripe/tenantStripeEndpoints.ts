import { Payload } from 'payload'
import type { PayloadRequest } from 'payload/types'
import Stripe from 'stripe'
import { initTenantStripe, getTenantStripeConfig } from '../../utilities/getTenantStripeConfig'

type EndpointHandler = (req: PayloadRequest, res: any, next: any) => Promise<any>

/**
 * Create a tenant-aware Stripe payment intent endpoint
 * Replaces the default /api/stripe/create-payment-intent endpoint from the plugin
 */
export const createTenantPaymentIntentEndpoint = {
  path: '/stripe/create-tenant-payment-intent',
  method: 'post',
  handler: async (req: PayloadRequest, res: any, next: any) => {
    const { payload } = req
    
    try {
      // Get tenant-specific Stripe instance
      const stripeInstance = await initTenantStripe(req, payload)
      
      if (!stripeInstance) {
        return res.status(400).json({
          message: 'Stripe is not configured for this tenant',
        })
      }

      // Extract data from request body
      const { amount, currency = 'usd', customerId, paymentMethodId, metadata = {} } = req.body

      if (!amount) {
        return res.status(400).json({
          message: 'Missing required fields',
        })
      }

      // Create payment intent with tenant's Stripe account
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount,
        currency,
        customer: customerId || undefined,
        payment_method: paymentMethodId || undefined,
        metadata,
      })

      return res.status(200).json(paymentIntent)
    } catch (error) {
      console.error('Error creating tenant payment intent:', error)
      return res.status(500).json({
        message: 'Error creating payment intent',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}

/**
 * Create a tenant-aware Stripe checkout session endpoint
 */
export const createTenantCheckoutSessionEndpoint = {
  path: '/stripe/create-tenant-checkout-session',
  method: 'post',
  handler: async (req: PayloadRequest, res: any, next: any) => {
    const { payload } = req
    
    try {
      // Get tenant-specific Stripe instance
      const stripeInstance = await initTenantStripe(req, payload)
      
      if (!stripeInstance) {
        return res.status(400).json({
          message: 'Stripe is not configured for this tenant',
        })
      }

      // Extract data from request body
      const { 
        priceId, 
        mode = 'payment',
        successUrl,
        cancelUrl,
        customerId,
        metadata = {}
      } = req.body

      if (!priceId || !successUrl || !cancelUrl) {
        return res.status(400).json({
          message: 'Missing required fields',
        })
      }

      // Create checkout session with tenant's Stripe account
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: mode as Stripe.Checkout.SessionCreateParams.Mode,
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer: customerId || undefined,
        metadata,
      })

      return res.status(200).json({ sessionId: session.id })
    } catch (error) {
      console.error('Error creating tenant checkout session:', error)
      return res.status(500).json({
        message: 'Error creating checkout session',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}

/**
 * Endpoint to get publishable key for current tenant
 */
export const getTenantPublishableKeyEndpoint = {
  path: '/stripe/tenant-publishable-key',
  method: 'get',
  handler: async (req: PayloadRequest, res: any, next: any) => {
    const { payload } = req
    
    try {
      // Get tenant-specific Stripe config
      const config = await getTenantStripeConfig(req, payload)
      
      if (!config.publishableKey || !config.enabled) {
        return res.status(400).json({
          message: 'Stripe is not configured for this tenant',
        })
      }

      return res.status(200).json({ publishableKey: config.publishableKey })
    } catch (error) {
      console.error('Error getting tenant publishable key:', error)
      return res.status(500).json({
        message: 'Error getting publishable key',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}

/**
 * Create a tenant-aware Stripe webhook handler endpoint
 * This will process webhooks using the tenant's webhook secret
 */
export const tenantWebhookEndpoint = {
  path: '/stripe/tenant-webhooks',
  method: 'post',
  handler: async (req: PayloadRequest, res: any, next: any) => {
    const { payload } = req
    
    try {
      // Get raw body from request
      const rawBody = req.body
      if (!rawBody) {
        return res.status(400).json({ message: 'Missing request body' })
      }

      // Get signature from headers
      const signature = req.headers['stripe-signature']
      if (!signature) {
        return res.status(400).json({ message: 'Missing Stripe signature' })
      }

      // Get tenant-specific Stripe config
      const config = await getTenantStripeConfig(req, payload)
      
      if (!config.webhookSecret || !config.secretKey || !config.enabled) {
        return res.status(400).json({
          message: 'Stripe webhook is not configured for this tenant',
        })
      }

      const stripeInstance = new Stripe(config.secretKey as string, {
        apiVersion: '2022-08-01',
      })

      // Verify webhook signature
      let event: Stripe.Event
      try {
        event = stripeInstance.webhooks.constructEvent(
          rawBody,
          signature as string,
          config.webhookSecret as string
        )
      } catch (err) {
        return res.status(400).json({
          message: 'Invalid webhook signature',
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }

      // Process the webhook event based on type
      switch (event.type) {
        case 'payment_intent.succeeded':
          // Handle successful payment
          const paymentIntent = event.data.object as Stripe.PaymentIntent
          // Record transaction in database
          await payload.create({
            collection: 'transactions',
            data: {
              stripeId: paymentIntent.id,
              amount: paymentIntent.amount,
              status: 'succeeded',
              customer: paymentIntent.customer?.toString() || null,
              metadata: paymentIntent.metadata,
            },
          })
          break

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          // Handle subscription events
          const subscription = event.data.object as Stripe.Subscription
          // Update subscription in database
          await payload.create({
            collection: 'subscriptions',
            data: {
              stripeId: subscription.id,
              status: subscription.status,
              customer: subscription.customer?.toString() || null,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              metadata: subscription.metadata,
            },
          })
          break

        // Add more event handlers as needed
      }

      return res.status(200).json({ received: true })
    } catch (error) {
      console.error('Error processing tenant webhook:', error)
      return res.status(500).json({
        message: 'Error processing webhook',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}

// Export all tenant-aware Stripe endpoints
export const tenantStripeEndpoints = [
  createTenantPaymentIntentEndpoint,
  createTenantCheckoutSessionEndpoint,
  getTenantPublishableKeyEndpoint,
  tenantWebhookEndpoint,
]
