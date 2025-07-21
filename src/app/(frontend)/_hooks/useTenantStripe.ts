import { loadStripe } from '@stripe/stripe-js'
import { useState, useEffect } from 'react'

/**
 * Hook to fetch tenant-specific Stripe publishable key and initialize Stripe
 */
export const useTenantStripe = () => {
  const [stripePromise, setStripePromise] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        setIsLoading(true)
        // Fetch tenant's Stripe publishable key from our custom endpoint
        const response = await fetch('/api/stripe/tenant-publishable-key')
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to load Stripe configuration')
        }
        
        const { publishableKey } = await response.json()
        
        if (!publishableKey) {
          throw new Error('No Stripe publishable key found for this tenant')
        }

        // Initialize Stripe with tenant's publishable key
        const stripeInstance = await loadStripe(publishableKey)
        setStripePromise(stripeInstance)
        setError(null)
      } catch (err) {
        console.error('Error initializing Stripe:', err)
        setError(err instanceof Error ? err.message : 'Unknown error loading Stripe')
      } finally {
        setIsLoading(false)
      }
    }

    initializeStripe()
  }, [])

  return { stripePromise, isLoading, error }
}

/**
 * Creates a payment intent using tenant-specific Stripe credentials
 */
export const createTenantPaymentIntent = async (options: {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}) => {
  const { amount, currency = 'usd', metadata = {} } = options

  try {
    // Use our tenant-specific endpoint
    const response = await fetch('/api/stripe/create-tenant-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        metadata,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create payment intent')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating tenant payment intent:', error)
    throw error
  }
}

/**
 * Creates a checkout session using tenant-specific Stripe credentials
 */
export const createTenantCheckoutSession = async (options: {
  priceId: string
  mode?: 'payment' | 'subscription'
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) => {
  const {
    priceId,
    mode = 'payment',
    successUrl,
    cancelUrl,
    metadata = {},
  } = options

  try {
    // Use our tenant-specific endpoint
    const response = await fetch('/api/stripe/create-tenant-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        mode,
        successUrl,
        cancelUrl,
        metadata,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create checkout session')
    }

    const { sessionId } = await response.json()
    return sessionId
  } catch (error) {
    console.error('Error creating tenant checkout session:', error)
    throw error
  }
}
