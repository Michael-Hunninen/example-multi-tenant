'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  Star, 
  Crown, 
  Zap, 
  ArrowRight, 
  Clock, 
  Users, 
  Shield, 
  Video, 
  BookOpen, 
  Trophy, 
  MessageCircle, 
  ArrowLeft, 
  Check 
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

// Mock data for development
const mockProducts: Product[] = [
  {
    id: 'basic-subscription',
    name: 'Basic',
    description: 'Essential features to get started with your learning journey',
    type: 'subscription',
    features: [
      'Access to basic video library',
      'Progress tracking',
      'Mobile app access',
      'Community forum access',
      'Basic achievements'
    ],
    accessLevel: 'basic',
    active: true,
    featured: false,
    prices: [
      {
        amount: 2900, // $29.00
        currency: 'usd',
        interval: 'month',
        label: 'Monthly'
      },
      {
        amount: 27900, // $279.00 (save ~20%)
        currency: 'usd',
        interval: 'year',
        label: 'Annual'
      }
    ]
  },
  {
    id: 'premium-subscription',
    name: 'Premium',
    description: 'Advanced features for serious learners',
    type: 'subscription',
    features: [
      'Everything in Basic',
      'Access to premium programs',
      'Advanced video content',
      'Priority support',
      'Downloadable resources',
      'Advanced progress analytics'
    ],
    accessLevel: 'premium',
    active: true,
    featured: true,
    prices: [
      {
        amount: 5900, // $59.00
        currency: 'usd',
        interval: 'month',
        label: 'Monthly'
      },
      {
        amount: 56900, // $569.00 (save ~20%)
        currency: 'usd',
        interval: 'year',
        label: 'Annual'
      }
    ]
  },
  {
    id: 'vip-subscription',
    name: 'VIP',
    description: 'Complete access to all features and content',
    type: 'subscription',
    features: [
      'Everything in Premium',
      'Access to live lessons',
      'One-on-one coaching sessions',
      'Custom learning paths',
      'Advanced achievements',
      'Priority access to new content',
      'Exclusive community features'
    ],
    accessLevel: 'vip',
    active: true,
    featured: false,
    prices: [
      {
        amount: 9900, // $99.00
        currency: 'usd',
        interval: 'month',
        label: 'Monthly'
      },
      {
        amount: 95900, // $959.00 (save ~20%)
        currency: 'usd',
        interval: 'year',
        label: 'Annual'
      }
    ]
  }
]

function ProductCard({ product, billingPeriod }: { product: Product, billingPeriod: 'annual' | 'monthly' }) {
  const Icon = AccessLevelIcons[product.accessLevel] || Users // Fallback to Users icon
  const colorClass = AccessLevelColors[product.accessLevel] || AccessLevelColors.basic // Fallback to basic styling

  // Find the appropriate price based on billing period
  const currentPrice = product.prices?.find(price => {
    // Use both interval and label to identify annual/monthly prices
    const interval = price.interval || '';
    const label = price.label || '';
    
    if (billingPeriod === 'annual') {
      return interval === 'year' || 
             interval.includes('year') || 
             interval.includes('annual') ||
             label.toLowerCase().includes('annual') || 
             label.toLowerCase().includes('yearly');
    } else {
      return interval === 'month' || 
             interval.includes('month') ||
             label.toLowerCase().includes('monthly');
    }
  }) || product.prices?.[0] // Fallback to first price if no match
  
  // Ensure prices array exists
  if (!product.prices || product.prices.length === 0) {
    console.error('No prices found for product:', product.name)
    return null // Don't render products without prices
  }

  // Ensure we have a valid price
  if (!currentPrice || typeof currentPrice.amount !== 'number' || currentPrice.amount <= 0) {
    // Try to find any price in the product that has a valid amount
    const anyPrice = product.prices.find(p => 
      p && typeof p.amount === 'number' && p.amount > 0
    )
    
    if (!anyPrice) {
      console.error('No valid price found for product:', product.name)
      return null // Don't render the card if no valid price
    }
    
    // Use the alternative price
    const altDisplayPrice = anyPrice.amount
    console.log('Using alternative price for', product.name, ':', altDisplayPrice)
    
    // Return a card with the alternative price
    return (
      <Card className={`relative transition-all duration-200 hover:shadow-xl bg-gray-900 border-gray-800 ${product.featured ? 'ring-2 ring-teal-500 scale-105' : ''}`}>
        <CardHeader className="pb-2">
          <div className="text-center">
            <CardTitle className="text-xl text-white mb-2">{product.name}</CardTitle>
            <CardDescription className="text-gray-400">{product.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-bold text-white">${altDisplayPrice.toFixed(0)}</span>
              <span className="text-gray-400 ml-1">/mo</span>
            </div>
            {(anyPrice.interval?.includes('year') || anyPrice.label?.toLowerCase().includes('annual') || anyPrice.label?.toLowerCase().includes('yearly')) && (
              <>
                <div className="text-sm text-teal-500 font-medium">get 2 months free</div>
                <div className="text-xs text-gray-400 mt-1">
                  ${anyPrice.amount.toFixed(0)} billed annually
                </div>
              </>
            )}
          </div>
          
          {/* What's Included */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">What's Included</h3>
            <ul className="space-y-2">
              {product.features?.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="h-4 w-4 text-teal-500 mr-2" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" asChild>
            <Link href={`/dashboard/checkout?product=${product.id}&price=${anyPrice.stripePriceId || anyPrice.interval || 'monthly'}`}>Get Started</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // We have a valid price, calculate display price
  // For annual, show monthly equivalent (yearly price ÷ 12)
  const interval = currentPrice.interval || '';
  const label = currentPrice.label || '';
  
  // Check both interval and label for annual pricing
  const isYearly = interval === 'year' || 
                  interval.includes('year') || 
                  interval.includes('annual') ||
                  label.toLowerCase().includes('annual') || 
                  label.toLowerCase().includes('yearly');
                  
  const displayPrice = isYearly
    ? Math.round(currentPrice.amount / 12) 
    : currentPrice.amount
    
  // Ensure displayPrice is a valid number
  const safeDisplayPrice = displayPrice > 0 ? displayPrice : currentPrice.amount
  
  console.log(
    'Price for', product.name, 
    'Period:', billingPeriod, 
    'Amount:', currentPrice.amount,
    'Display:', safeDisplayPrice,
    'Final:', (safeDisplayPrice / 100).toFixed(0)
  )

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-xl bg-gray-900 border-gray-800 ${
      product.featured ? 'ring-2 ring-teal-500 scale-105' : ''
    }`}>
      {product.featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-teal-500 text-black px-3 py-1 font-semibold">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="text-center">
          <CardTitle className="text-xl text-white">{product.name}</CardTitle>
          <CardDescription className="text-gray-400">{product.description}</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-bold text-white">
              ${safeDisplayPrice.toFixed(0)}
            </span>
            <span className="text-gray-400 ml-1">/mo</span>
          </div>
          {billingPeriod === 'annual' && isYearly && (
            <div className="text-sm text-teal-500 font-medium">get 2 months free</div>
          )}
          {billingPeriod === 'annual' && isYearly && (
            <div className="text-xs text-gray-400 mt-1">
              ${currentPrice.amount.toFixed(0)} billed annually
            </div>
          )}
          {billingPeriod === 'annual' && !isYearly && (
            <div className="text-sm text-gray-400">${currentPrice.amount.toFixed(0)} billed annually</div>
          )}
        </div>
        
        {/* What's Included */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">What's Included</h3>
          <ul className="space-y-3">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-teal-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button
          onClick={() => {
            // Navigate to checkout with product ID and price ID
            window.location.href = `/dashboard/checkout?product=${product.id}&price=${currentPrice.stripePriceId || currentPrice.interval || 'monthly'}`
          }}
          className={`w-full ${
            product.featured 
              ? 'bg-teal-500 hover:bg-teal-600 text-black' 
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
          size="lg"
        >
          Get Started
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <div className="flex items-center justify-center text-xs text-gray-400">
          <Shield className="w-3 h-3 mr-1" />
          30-day money-back guarantee
        </div>
      </CardContent>
    </Card>
  )
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'annual' | 'monthly'>('annual')
  const router = useRouter()

  // State for real-time products from CMS
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch real products from Payload API
  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/lms/products?active=true&limit=50')
        if (response.ok) {
          const data = await response.json()
          console.log('API Response:', data)
          if (data.products && data.products.length > 0) {
            console.log('Using CMS products:', data.products)
            // Log each product's prices for debugging
            data.products.forEach((product: any) => {
              console.log(`Product: ${product.name}`, {
                prices: product.prices,
                priceCount: product.prices?.length || 0
              })
              product.prices?.forEach((price: any, index: number) => {
                console.log(`  Price ${index + 1}:`, {
                  amount: price.amount,
                  currency: price.currency,
                  interval: price.interval,
                  label: price.label,
                  stripePriceId: price.stripePriceId
                })
              })
            })
            setProducts(data.products)
          } else {
            console.log('No CMS products found, using mock data')
            setProducts(mockProducts)
          }
        } else {
          throw new Error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        console.log('Using mock data as fallback')
        // Use mock data as fallback
        setProducts(mockProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on type - only show subscription products
  const filteredProducts = products.filter(product => 
    product.type === 'subscription' && 
    product.active &&
    product.prices && 
    product.prices.length > 0
  )

  const featuredProducts = filteredProducts.filter(product => product.featured)
  const regularProducts = filteredProducts.filter(product => !product.featured)

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading pricing plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Select the perfect plan to unlock your learning potential and access premium content.
            </p>
            
            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg text-yellow-400 text-sm max-w-md mx-auto">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={billingPeriod} onValueChange={(value: any) => setBillingPeriod(value)} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto bg-gray-800 border-gray-700">
            <TabsTrigger value="annual" className="data-[state=active]:bg-teal-500 data-[state=active]:text-black">
              Annual
              <span className="ml-1 text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full">2 months free</span>
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-teal-500 data-[state=active]:text-black">
              Monthly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="annual" className="mt-8">
            <div className="space-y-8">
              {/* Billing Period Info */}
              <div className="text-center mb-8">
                <p className="text-gray-400">
                  Save 20% with annual billing - prices shown as monthly equivalent
                </p>
              </div>
              
              {/* Featured Products */}
              {featuredProducts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-center mb-6 text-white">Featured Plans</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} billingPeriod={billingPeriod} />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Products */}
              {regularProducts.length > 0 && (
                <div>
                  {featuredProducts.length > 0 && (
                    <h2 className="text-2xl font-bold text-center mb-6 mt-12 text-white">All Plans</h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularProducts.map((product) => (
                      <ProductCard key={product.id} product={product} billingPeriod={billingPeriod} />
                    ))}
                  </div>
                </div>
              )}
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No subscription plans available
                  </h3>
                  <p className="text-gray-400">
                    Check back soon for new subscription options.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-8">
            <div className="space-y-8">
              {/* Billing Period Info */}
              <div className="text-center mb-8">
                <p className="text-gray-400">
                  Monthly billing - cancel anytime
                </p>
              </div>
              
              {/* Featured Products */}
              {featuredProducts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-center mb-6 text-white">Featured Plans</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} billingPeriod={billingPeriod} />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Products */}
              {regularProducts.length > 0 && (
                <div>
                  {featuredProducts.length > 0 && (
                    <h2 className="text-2xl font-bold text-center mb-6 mt-12 text-white">All Plans</h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularProducts.map((product) => (
                      <ProductCard key={product.id} product={product} billingPeriod={billingPeriod} />
                    ))}
                  </div>
                </div>
              )}
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No subscription plans available
                  </h3>
                  <p className="text-gray-400">
                    Check back soon for new subscription options.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>


        </Tabs>

        {/* Feature comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-800">
              <Video className="w-8 h-8 text-teal-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Video Library</h3>
              <p className="text-sm text-gray-400">Access to comprehensive video content</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-800">
              <BookOpen className="w-8 h-8 text-teal-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Programs</h3>
              <p className="text-sm text-gray-400">Structured learning programs</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-800">
              <Trophy className="w-8 h-8 text-teal-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Achievements</h3>
              <p className="text-sm text-gray-400">Track your progress and earn badges</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-800">
              <MessageCircle className="w-8 h-8 text-teal-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Community</h3>
              <p className="text-sm text-gray-400">Connect with other learners</p>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-teal-400 mb-2" />
              <h3 className="font-semibold mb-1 text-white">Secure Payments</h3>
              <p className="text-sm text-gray-400">Protected by Stripe</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-teal-400 mb-2" />
              <h3 className="font-semibold mb-1 text-white">Instant Access</h3>
              <p className="text-sm text-gray-400">Start learning immediately</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-teal-400 mb-2" />
              <h3 className="font-semibold mb-1 text-white">Money-back Guarantee</h3>
              <p className="text-sm text-gray-400">30-day refund policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
