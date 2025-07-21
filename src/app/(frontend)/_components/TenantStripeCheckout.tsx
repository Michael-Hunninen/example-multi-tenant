'use client'

import React, { useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, CreditCard } from 'lucide-react'
import { useTenantStripe, createTenantCheckoutSession } from '../_hooks/useTenantStripe'
import { useRouter } from 'next/navigation'

interface CheckoutProps {
  mode: 'payment' | 'subscription'
  productId: string
  amount: number
  name: string
  description?: string
  currency?: string
  successUrl?: string
  cancelUrl?: string
}

interface PaymentFormProps {
  clientSecret: string
  returnUrl: string
  productName: string
  amount: number
  currency: string
  isSubscription?: boolean
}

const PaymentForm = ({
  clientSecret,
  returnUrl,
  productName,
  amount,
  currency,
  isSubscription,
}: PaymentFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setPaymentStatus('processing')

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: 'if_required',
    })

    if (error) {
      setErrorMessage(error.message || 'An error occurred during payment')
      setPaymentStatus('error')
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setPaymentStatus('success')
      
      // Redirect after successful payment
      setTimeout(() => {
        router.push(returnUrl)
      }, 1500)
    } else {
      setPaymentStatus('idle')
    }
    
    setIsProcessing(false)
  }

  if (paymentStatus === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase of {productName}.
        </p>
        <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <PaymentElement />
      </div>

      {paymentStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="flex">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency.toUpperCase(),
            }).format(amount / 100)}
            {isSubscription ? ' / month' : ''}
          </>
        )}
      </Button>
    </form>
  )
}

export function TenantStripeCheckout({
  mode = 'payment',
  productId,
  amount,
  name,
  description,
  currency = 'usd',
  successUrl = '/dashboard?payment=success',
  cancelUrl = '/dashboard?payment=canceled',
}: CheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { stripePromise, isLoading, error: stripeError } = useTenantStripe()
  
  // Function to create a direct checkout session with Stripe (alternative to Payment Intent)
  const handleDirectCheckout = async () => {
    try {
      const sessionId = await createTenantCheckoutSession({
        priceId: productId,
        mode,
        successUrl,
        cancelUrl,
        metadata: {
          productId,
          productName: name,
        }
      })
      
      // Redirect to Stripe Checkout hosted page
      const stripe = await stripePromise
      if (stripe) {
        stripe.redirectToCheckout({ sessionId })
      }
    } catch (err) {
      console.error('Error creating checkout session:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize checkout')
    }
  }

  // Utility function to initialize a payment intent for the embedded checkout flow
  const initializePaymentIntent = async () => {
    try {
      const response = await fetch('/api/stripe/create-tenant-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata: {
            productId,
            productName: name,
            mode,
          }
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to initialize payment')
      }

      const data = await response.json()
      setClientSecret(data.client_secret)
    } catch (err) {
      console.error('Payment intent error:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize payment')
    }
  }

  // Initialize payment intent on component mount
  React.useEffect(() => {
    if (!isLoading && !stripeError) {
      initializePaymentIntent()
    }
  }, [isLoading, stripeError])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment provider...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (stripeError || error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-semibold">Payment configuration error</p>
            <p className="text-gray-600 mt-2">{stripeError || error}</p>
            <p className="text-sm text-gray-500 mt-4">Please contact support or try again later.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>{description || `Complete your ${mode === 'subscription' ? 'subscription' : 'purchase'}`}</CardDescription>
      </CardHeader>
      <CardContent>
        {clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
              },
            }}
          >
            <PaymentForm
              clientSecret={clientSecret}
              returnUrl={successUrl}
              productName={name}
              amount={amount}
              currency={currency}
              isSubscription={mode === 'subscription'}
            />
          </Elements>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing payment...</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-gray-500">
          Secure payment processed by Stripe. Your payment information is encrypted and secure.
        </p>
      </CardFooter>
    </Card>
  )
}
