'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Star, Crown, Zap, ArrowRight, Clock, Users, Shield } from 'lucide-react'
import Link from 'next/link'

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
  active: boolean
  featured: boolean
  image?: {
    url: string
    alt: string
  }
}

const AccessLevelIcons = {
  basic: Users,
  premium: Star,
  vip: Crown,
  enterprise: Zap,
}

const AccessLevelColors = {
  basic: 'bg-gray-100 text-gray-800',
  premium: 'bg-blue-100 text-blue-800',
  vip: 'bg-purple-100 text-purple-800',
  enterprise: 'bg-yellow-100 text-yellow-800',
}

function ProductCard({ product }: { product: Product }) {
  const Icon = AccessLevelIcons[product.accessLevel]
  const colorClass = AccessLevelColors[product.accessLevel]

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-lg ${
      product.featured ? 'ring-2 ring-blue-500 scale-105' : ''
    }`}>
      {product.featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          <div className={`p-3 rounded-full ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription className="text-sm">{product.description}</CardDescription>
        
        <div className="mt-4">
          <div className="text-3xl font-bold">
            ${(product.price / 100).toFixed(2)}
          </div>
          {product.type === 'subscription' && (
            <div className="text-sm text-gray-500">
              per {product.recurringInterval}
            </div>
          )}
          <Badge variant="outline" className="mt-2">
            {product.type === 'subscription' ? 'Subscription' : 'One-time'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {product.features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>

        <Link href={`/checkout?product=${product.id}`} className="block">
          <Button 
            className={`w-full ${
              product.featured 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
            size="lg"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>

        <div className="flex items-center justify-center text-xs text-gray-500">
          <Shield className="w-3 h-3 mr-1" />
          30-day money-back guarantee
        </div>
      </CardContent>
    </Card>
  )
}

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'subscription' | 'one_time'>('all')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use Payload's REST API to fetch products
        const response = await fetch('/api/products?active=true&limit=20')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data.docs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    if (activeTab === 'all') return true
    return product.type === activeTab
  })

  const featuredProducts = filteredProducts.filter(p => p.featured)
  const regularProducts = filteredProducts.filter(p => !p.featured)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing options...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Learning Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock premium content, exclusive programs, and personalized coaching 
              to accelerate your equestrian journey.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
            <TabsTrigger value="one_time">One-time</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products available
                </h3>
                <p className="text-gray-600">
                  Check back soon for new pricing options.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-center mb-6">Featured Plans</h2>
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
                      <h2 className="text-2xl font-bold text-center mb-6 mt-12">All Plans</h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {regularProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">Secure Payments</h3>
              <p className="text-sm text-gray-600">Protected by Stripe</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">Instant Access</h3>
              <p className="text-sm text-gray-600">Start learning immediately</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">Money-back Guarantee</h3>
              <p className="text-sm text-gray-600">30-day refund policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
