'use client'

import React, { useState, useEffect } from 'react'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowLeft, CreditCard, Shield, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTenantStripe, createTenantPaymentIntent } from '../_hooks/useTenantStripe'

interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  type: 'one_time' | 'subscription'
  recurringInterval?: 'month' | 'year'
  features: string[]
  accessLevel: 'basic' | 'premium' | 'vip' | 'enterprise'
  image?: {
    url: string
    alt: string
  }
}

interface CheckoutFormProps {
  product: Product
  clientSecret: string
}

function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [succeeded, setSucceeded] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setError('Card element not found')
      setIsLoading(false)
      return
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          // Add billing details from form if needed
        },
      },
    })

    if (stripeError) {
      setError(stripeError.message || 'An error occurred')
      setIsLoading(false)
    } else if (paymentIntent?.status === 'succeeded') {
      setSucceeded(true)
      setIsLoading(false)
      // Redirect to success page or dashboard
      setTimeout(() => {
        router.push('/dashboard?payment=success')
      }, 2000)
    }
  }

  if (succeeded) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. You now have access to {product.name}.
        </p>
        <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Payment Details</h3>
        <div className="bg-white p-4 rounded border">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay ${(product.price / 100).toFixed(2)}
            {product.type === 'subscription' && ` / ${product.recurringInterval}`}
          </>
        )}
      </Button>

      <div className="flex items-center justify-center text-sm text-gray-500">
        <Shield className="w-4 h-4 mr-1" />
        Secured by Stripe
      </div>
    </form>
  )
}

export default function CheckoutPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')

  // Use our tenant-specific Stripe hook instead of global initialization
  const { stripePromise, isLoading: stripeLoading, error: stripeError } = useTenantStripe()

  useEffect(() => {
    if (productId) {
      fetchProduct()
    } else {
      setError('No product selected')
      setLoading(false)
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)

      // Fetch product details
      const productRes = await fetch(`/api/products/${productId}`)
      if (!productRes.ok) {
        throw new Error('Failed to load product')
      }

      const productData = await productRes.json()
      setProduct(productData)

      // Create payment intent using tenant-specific endpoint
      try {
        const paymentIntent = await createTenantPaymentIntent({
          amount: productData.price,
          currency: productData.currency || 'usd',
          metadata: {
            productId: productData.id,
            productName: productData.name,
            type: productData.type,
          },
        })

        setClientSecret(paymentIntent.client_secret)
      } catch (paymentError) {
        throw new Error(
          paymentError instanceof Error 
            ? `Payment error: ${paymentError.message}` 
            : 'Failed to create payment intent'
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'Product not found'}</p>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your purchase details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.image && (
                  <img
                    src={product.image.url}
                    alt={product.image.alt}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                
                <div>
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-600 mt-1">{product.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={product.type === 'subscription' ? 'default' : 'secondary'}>
                    {product.type === 'subscription' ? 'Subscription' : 'One-time'}
                  </Badge>
                  <Badge variant="outline">{product.accessLevel}</Badge>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span>
                      ${(product.price / 100).toFixed(2)} {product.currency.toUpperCase()}
                      {product.type === 'subscription' && (
                        <span className="text-sm font-normal text-gray-500">
                          / {product.recurringInterval}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {product.features.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">What's included:</h4>
                    <ul className="space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Complete your purchase securely</CardDescription>
              </CardHeader>
              <CardContent>
                {stripeError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-semibold">Stripe configuration error</p>
                    <p className="text-gray-600 mt-2">{stripeError}</p>
                    <p className="text-sm text-gray-500 mt-4">Please contact support or try again later.</p>
                  </div>
                ) : stripeLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading payment provider...</p>
                  </div>
                ) : clientSecret && stripePromise ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm product={product} clientSecret={clientSecret} />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Setting up secure payment...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trust indicators */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  SSL Secured
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Instant Access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
