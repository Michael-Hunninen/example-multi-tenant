'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
        amount: 29, // $29.00
        currency: 'usd',
        interval: 'month',
        label: 'Monthly'
      },
      {
        amount: 290, // $290.00 (10 months price for 12 months)
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
        amount: 49, // $49.00
        currency: 'usd',
        interval: 'month',
        label: 'Monthly'
      },
      {
        amount: 490, // $490.00 (10 months price for 12 months)
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
        amount: 99, // $99.00
        currency: 'usd',
        interval: 'month',
        label: 'Monthly'
      },
      {
        amount: 990, // $990.00 (10 months price for 12 months)
        currency: 'usd',
        interval: 'year',
        label: 'Annual'
      }
    ]
  }
]

function ProductCard({ product, billingPeriod }: { product: Product, billingPeriod: 'annual' | 'monthly' }) {
  const Icon = AccessLevelIcons[product.accessLevel] || Users // Fallback to Users icon
  
  // Convert dashboard product structure to match Services page structure
  const tier = {
    name: product.name,
    description: product.description,
    features: product.features,
    popular: product.featured,
    icon: Icon,
    color: {
      basic: "from-gray-500 to-gray-600",
      premium: "from-teal-500 to-teal-600", 
      vip: "from-yellow-500 to-yellow-600",
      enterprise: "from-purple-500 to-purple-600"
    }[product.accessLevel] || "from-gray-500 to-gray-600",
    prices: (() => {
      // Find monthly and annual prices once to avoid redundant searches
      const monthlyPrice = product.prices?.find(p => 
        p.interval === 'month' || p.label?.toLowerCase().includes('monthly')
      )
      const annualPrice = product.prices?.find(p => 
        p.interval === 'year' || p.label?.toLowerCase().includes('annual')
      )
      
      const monthlyAmount = monthlyPrice?.amount || 29
      const annualAmount = annualPrice?.amount || (monthlyAmount * 10) // 10 months for 12 months pricing
      
      return {
        monthly: { 
          amount: monthlyAmount,
          display: `$${monthlyAmount}`
        },
        annual: { 
          amount: annualAmount,
          display: `$${(annualAmount / 12).toFixed(2)}`, // Monthly equivalent
          fullPrice: `$${annualAmount}`
        }
      }
    })()
  }
  
  if (!product.prices || product.prices.length === 0) {
    return null
  }

  const IconComponent = tier.icon
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative group ${
        tier.popular 
          ? 'transform scale-105 lg:scale-110' 
          : 'hover:transform hover:scale-105'
      } transition-all duration-500`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <Badge className="bg-gradient-to-r from-teal-500 to-teal-600 text-black font-semibold px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      
      <div className={`relative bg-gradient-to-br from-gray-900/90 to-gray-800/50 rounded-2xl p-8 border-2 ${
        tier.popular 
          ? 'border-teal-500/50 shadow-2xl shadow-teal-500/20' 
          : 'border-gray-800/50 hover:border-teal-500/30'
      } transition-all duration-500 backdrop-blur-sm h-full flex flex-col`}>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="relative z-10 flex-1">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-4xl font-bold text-teal-400">{tier.prices[billingPeriod].display}</span>
              <span className="text-gray-400">/mo</span>
            </div>
            {billingPeriod === 'annual' && (
              <div className="text-sm text-teal-500 font-medium mb-1">get 2 months free</div>
            )}
            {billingPeriod === 'annual' && (
              <div className="text-xs text-gray-400 mb-2">
                {tier.prices.annual.fullPrice} billed annually
              </div>
            )}
            <p className="text-gray-300 text-sm leading-relaxed">{tier.description}</p>
          </div>
          
          {/* What's Included - exactly like Services page */}
          <ul className="space-y-3 mb-8 flex-1">
            {tier.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-start gap-3 text-gray-300">
                <CheckCircle className="h-4 w-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Link 
          href={`/dashboard/checkout?product=${product.id}&price=${tier.prices[billingPeriod].amount}&billing=${billingPeriod}`}
          className={`inline-flex items-center justify-center gap-2 w-full mt-auto px-4 py-3 rounded-md font-medium transition-all duration-300 relative z-20 ${
            tier.popular
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold shadow-lg'
              : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-teal-500/50'
          }`}
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
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
                  Get 2 months free with annual billing - prices shown as monthly equivalent
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
