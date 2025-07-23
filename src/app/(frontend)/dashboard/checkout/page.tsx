'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  ArrowLeft, 
  CreditCard, 
  Shield, 
  Clock,
  Star,
  Crown,
  Zap,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProductPrice {
  amount: number
  currency: string
  interval?: 'month' | 'year' | 'week'
  stripePriceId?: string
  label: string
}

interface Product {
  id: string
  name: string
  description: string
  type: 'one_time' | 'subscription'
  features: string[]
  accessLevel: 'basic' | 'premium' | 'vip' | 'enterprise'
  active: boolean
  featured: boolean
  prices: ProductPrice[]
  stripeProductId?: string
}

const AccessLevelIcons = {
  basic: Users,
  premium: Star,
  vip: Crown,
  enterprise: Zap,
}

const AccessLevelColors = {
  basic: 'bg-gray-800 text-gray-300 border-gray-700',
  premium: 'bg-teal-900/50 text-teal-300 border-teal-700',
  vip: 'bg-purple-900/50 text-purple-300 border-purple-700',
  enterprise: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<ProductPrice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const productId = searchParams.get('product')
  const priceId = searchParams.get('price')

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('No product specified')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch('/api/lms/products?active=true&limit=50')
        if (response.ok) {
          const data = await response.json()
          const foundProduct = data.products.find((p: Product) => p.id === productId)
          
          if (foundProduct) {
            setProduct(foundProduct)
            
            // Find the selected price
            let price = foundProduct.prices.find((p: ProductPrice) => 
              p.stripePriceId === priceId || 
              p.interval === priceId ||
              p.label.toLowerCase() === priceId?.toLowerCase()
            )
            
            // Default to first price if no match
            if (!price && foundProduct.prices.length > 0) {
              price = foundProduct.prices[0]
            }
            
            setSelectedPrice(price || null)
          } else {
            setError('Product not found')
          }
        } else {
          setError('Failed to load product')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, priceId])

  const handleCheckout = async () => {
    if (!product || !selectedPrice) return
    
    try {
      setLoading(true)
      
      // Check if we have a Stripe price ID
      if (!selectedPrice.stripePriceId) {
        alert('This product is not configured for Stripe checkout. Please contact support.')
        return
      }
      
      // Create checkout session using tenant-aware Stripe endpoint
      const response = await fetch('/api/stripe/create-tenant-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedPrice.stripePriceId,
          mode: selectedPrice.interval ? 'subscription' : 'payment',
          successUrl: `${window.location.origin}/dashboard/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/dashboard/checkout/cancelled`,
          metadata: {
            productId: product.id,
            productName: product.name,
            priceLabel: selectedPrice.label,
          },
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create checkout session')
      }
      
      const { sessionId } = await response.json()
      
      // Get Stripe publishable key for this tenant
      const keyResponse = await fetch('/api/stripe/tenant-publishable-key')
      if (!keyResponse.ok) {
        throw new Error('Failed to get Stripe configuration')
      }
      
      const { publishableKey } = await keyResponse.json()
      
      // Dynamically import Stripe
      const { loadStripe } = await import('@stripe/stripe-js')
      const stripe = await loadStripe(publishableKey)
      
      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (error || !product || !selectedPrice) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Checkout Error</h1>
          <p className="text-gray-400 mb-6">{error || 'Product or price not found'}</p>
          <Button asChild>
            <Link href="/dashboard/pricing">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const Icon = AccessLevelIcons[product.accessLevel] || Users
  const colorClass = AccessLevelColors[product.accessLevel] || AccessLevelColors.basic

  // Calculate display price
  const isYearly = selectedPrice.interval === 'year' || selectedPrice.label.toLowerCase().includes('annual')
  const displayPrice = isYearly ? Math.round(selectedPrice.amount / 12) : selectedPrice.amount

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Checkout</h1>
              <p className="text-gray-400">Complete your subscription</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Icon className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Info */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Badge className={`${colorClass} px-3 py-1`}>
                      {product.accessLevel.charAt(0).toUpperCase() + product.accessLevel.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.description}</p>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Plan</span>
                    <span className="text-white font-semibold">{selectedPrice.label}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">
                      {isYearly ? 'Monthly equivalent' : 'Monthly price'}
                    </span>
                    <span className="text-white font-semibold">${displayPrice}/mo</span>
                  </div>
                  
                  {isYearly && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Billed annually</span>
                        <span className="text-white font-semibold">${selectedPrice.amount}</span>
                      </div>
                      <div className="flex justify-between items-center text-teal-400">
                        <span className="text-sm">Savings</span>
                        <span className="text-sm font-semibold">Get 2 months free</span>
                      </div>
                    </>
                  )}
                </div>

                <Separator className="bg-gray-800" />

                {/* Total */}
                <div className="flex justify-between items-center text-lg">
                  <span className="text-white font-semibold">Total</span>
                  <div className="text-right">
                    <div className="text-white font-bold">${selectedPrice.amount}</div>
                    <div className="text-xs text-gray-400">
                      {isYearly ? 'billed annually' : 'billed monthly'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card className="bg-gray-900 border-gray-800 mt-6">
              <CardHeader>
                <CardTitle className="text-white">What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-teal-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your payment information to complete your subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mock Payment Form */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="text-center text-gray-400">
                      <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                      <p className="text-sm">Secure payment processing with Stripe</p>
                      <p className="text-xs text-gray-500 mt-1">
                        This is a demo checkout page. Payment processing will be integrated here.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    size="lg"
                  >
                    Complete Purchase - ${selectedPrice.amount}
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Secure
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Instant Access
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    30-day Guarantee
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
