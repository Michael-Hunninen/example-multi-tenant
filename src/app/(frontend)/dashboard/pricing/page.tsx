'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  ArrowLeft 
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  type: 'one_time' | 'subscription'
  recurringInterval?: 'month' | 'year'
  features: string[]
  accessLevel: 'basic' | 'premium' | 'pro' | 'enterprise'
  active: boolean
  featured: boolean
}

const AccessLevelIcons = {
  basic: Users,
  premium: Star,
  pro: Crown,
  enterprise: Zap,
}

const AccessLevelColors = {
  basic: 'bg-gray-800 text-gray-300 border-gray-700',
  premium: 'bg-teal-900/50 text-teal-300 border-teal-700',
  pro: 'bg-purple-900/50 text-purple-300 border-purple-700',
  enterprise: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
}

// Mock data for development
const mockProducts: Product[] = [
  {
    id: 'basic-monthly',
    name: 'Basic',
    description: 'Essential features to get started with your learning journey',
    price: 2900, // $29.00
    currency: 'usd',
    type: 'subscription',
    recurringInterval: 'month',
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
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    description: 'Advanced features for serious learners',
    price: 5900, // $59.00
    currency: 'usd',
    type: 'subscription',
    recurringInterval: 'month',
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
  },
  {
    id: 'pro-monthly',
    name: 'Pro',
    description: 'Complete access to all features and content',
    price: 9900, // $99.00
    currency: 'usd',
    type: 'subscription',
    recurringInterval: 'month',
    features: [
      'Everything in Premium',
      'Access to live lessons',
      'One-on-one coaching sessions',
      'Custom learning paths',
      'Advanced achievements',
      'Priority access to new content',
      'Exclusive community features'
    ],
    accessLevel: 'pro',
    active: true,
    featured: false,
  },
  {
    id: 'masterclass-course',
    name: 'Advanced Masterclass',
    description: 'One-time purchase for exclusive masterclass content',
    price: 19900, // $199.00
    currency: 'usd',
    type: 'one_time',
    features: [
      'Lifetime access to masterclass videos',
      'Downloadable course materials',
      'Certificate of completion',
      'Bonus interview sessions',
      'Private community access'
    ],
    accessLevel: 'premium',
    active: true,
    featured: false,
  },
  {
    id: 'starter-pack',
    name: 'Starter Pack',
    description: 'One-time purchase to get started quickly',
    price: 4900, // $49.00
    currency: 'usd',
    type: 'one_time',
    features: [
      'Essential training videos',
      'Quick start guide',
      'Basic templates',
      '30-day email support'
    ],
    accessLevel: 'basic',
    active: true,
    featured: false,
  },
]

function ProductCard({ product }: { product: Product }) {
  const Icon = AccessLevelIcons[product.accessLevel]
  const colorClass = AccessLevelColors[product.accessLevel]

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-xl bg-gray-900 border-gray-800 ${
      product.featured ? 'ring-2 ring-teal-500 scale-105' : ''
    }`}>
      {product.featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-teal-500 text-black px-3 py-1 font-semibold">
            {Star && <Star className="w-3 h-3 mr-1" />}
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          <div className={`p-3 rounded-full border ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <CardTitle className="text-xl text-white">{product.name}</CardTitle>
        <CardDescription className="text-sm text-gray-400">{product.description}</CardDescription>
        
        <div className="mt-4">
          <div className="text-3xl font-bold text-white">
            ${(product.price / 100).toFixed(2)}
          </div>
          {product.type === 'subscription' && (
            <div className="text-sm text-gray-400">
              per {product.recurringInterval}
            </div>
          )}
          <Badge variant="outline" className="mt-2 border-gray-600 text-gray-300">
            {product.type === 'subscription' ? 'Subscription' : 'One-time'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {product.features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-300">
              {CheckCircle && <CheckCircle className="w-4 h-4 text-teal-400 mr-3 flex-shrink-0" />}
              {feature}
            </div>
          ))}
        </div>

        <Button 
          onClick={() => {
            // For development, show alert with plan details
            alert(`Selected: ${product.name} - $${(product.price / 100).toFixed(2)}${product.type === 'subscription' ? `/${product.recurringInterval}` : ' one-time'}\n\nThis would normally redirect to checkout.`)
          }}
          className={`w-full ${
            product.featured 
              ? 'bg-teal-500 hover:bg-teal-600 text-black' 
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
          size="lg"
        >
          Get Started
          {ArrowRight && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>

        <div className="flex items-center justify-center text-xs text-gray-400">
          {Shield && <Shield className="w-3 h-3 mr-1" />}
          30-day money-back guarantee
        </div>
      </CardContent>
    </Card>
  )
}

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'subscription' | 'one_time'>('all')
  const router = useRouter()

  // Use mock data for development, but also try to fetch real products
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [loading, setLoading] = useState(false)

  // Fetch real products from Payload API
  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/products?active=true&limit=50')
        if (response.ok) {
          const data = await response.json()
          if (data.docs && data.docs.length > 0) {
            // Use real products if available, otherwise fall back to mock data
            setProducts(data.docs)
          }
        }
      } catch (error) {
        console.log('Using mock data - real products not available yet')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    if (activeTab === 'all') return product.active
    return product.active && product.type === activeTab
  })

  const featuredProducts = filteredProducts.filter(product => product.featured)
  const regularProducts = filteredProducts.filter(product => !product.featured)

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
              Choose Your Learning Plan
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Unlock premium content, exclusive programs, and personalized coaching 
              to accelerate your learning journey.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-gray-800 border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-teal-500 data-[state=active]:text-black">
              All Plans ({products.length})
            </TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-teal-500 data-[state=active]:text-black">
              Subscriptions ({products.filter(p => p.type === 'subscription').length})
            </TabsTrigger>
            <TabsTrigger value="one_time" className="data-[state=active]:bg-teal-500 data-[state=active]:text-black">
              One-time ({products.filter(p => p.type === 'one_time').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="space-y-8">
              {/* Featured Products */}
              {featuredProducts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-center mb-6 text-white">Featured Plans</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
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
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="mt-8">
            <div className="space-y-8">
              {filteredProducts.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold text-center mb-6 text-white">Subscription Plans</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              ) : (
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

          <TabsContent value="one_time" className="mt-8">
            <div className="space-y-8">
              {filteredProducts.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold text-center mb-6 text-white">One-time Purchases</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No one-time purchases available
                  </h3>
                  <p className="text-gray-400">
                    Check back soon for new course options.
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
