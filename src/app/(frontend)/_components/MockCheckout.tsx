'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, CreditCard, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

interface MockProduct {
  id: string
  name: string
  description: string
  price: number
  currency: string
  type: 'subscription'
  recurringInterval: 'month' | 'year'
  features: string[]
  accessLevel: 'basic' | 'premium' | 'vip'
}

export default function MockCheckout() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const planName = searchParams.get('plan')
  const price = searchParams.get('price')
  const interval = searchParams.get('interval') || 'month'
  const trial = searchParams.get('trial') === 'true'

  // Create mock product from URL parameters
  const createMockProduct = (): MockProduct => {
    const planFeatures = {
      basic: [
        'Access to fundamental training videos',
        'Basic reining patterns and techniques', 
        'Monthly group Q&A sessions',
        'Training progress tracking',
        'Mobile app access',
        'Community forum access'
      ],
      premium: [
        'Everything in Basic plan',
        'Advanced training techniques',
        'Weekly live Q&A sessions',
        'Video submission reviews',
        'Personalized training plans',
        'Direct messaging with trainers',
        'Competition preparation guides',
        'Priority support'
      ],
      elite: [
        'Everything in Premium plan',
        'One-on-one video coaching sessions',
        'Custom training program development',
        'Competition strategy planning',
        'Phone consultations',
        'Early access to new content',
        'Exclusive masterclass sessions',
        'Show preparation support'
      ]
    }

    const planDescriptions = {
      basic: 'Perfect for beginners starting their reining journey',
      premium: 'Comprehensive training for serious riders',
      elite: 'Professional-level training and personal coaching'
    }

    return {
      id: `${planName}-subscription`,
      name: `${planName?.charAt(0).toUpperCase()}${planName?.slice(1)} Plan` || 'Unknown Plan',
      description: planDescriptions[planName as keyof typeof planDescriptions] || 'Professional reining training subscription',
      price: parseInt(price || '0') * 100,
      currency: 'usd',
      type: 'subscription',
      recurringInterval: interval as 'month' | 'year',
      features: planFeatures[planName as keyof typeof planFeatures] || [],
      accessLevel: planName === 'elite' ? 'vip' : planName as 'basic' | 'premium',
    }
  }

  const product = createMockProduct()

  const handleMockPayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setIsComplete(true)
    
    // Simulate redirect to onboarding after success
    setTimeout(() => {
      router.push('/onboarding?payment=success&plan=' + encodeURIComponent(planName || 'premium'))
    }, 2000)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for subscribing to {product.name}. You now have access to all features.
                </p>
                {trial && (
                  <p className="text-sm text-blue-600 mb-4">
                    Your 7-day free trial has started!
                  </p>
                )}
                <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/pricing" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Subscription</h1>
          <p className="text-gray-600 mt-2">
            {trial ? 'Start your 7-day free trial' : 'Subscribe to unlock professional training'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your subscription details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600 mt-1">{product.description}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>{trial ? 'After trial:' : 'Total:'}</span>
                    <span>
                      ${(product.price / 100).toFixed(2)} USD
                      <span className="text-sm font-normal text-gray-500">
                        / {product.recurringInterval}
                      </span>
                    </span>
                  </div>
                  {trial && (
                    <p className="text-sm text-green-600 mt-1">
                      First 7 days free, then ${(product.price / 100).toFixed(2)}/{product.recurringInterval}
                    </p>
                  )}
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

          {/* Mock Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium mr-2">
                    DEMO MODE
                  </span>
                  This is a mock checkout for testing purposes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mock Payment Form */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">Mock Payment Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-500">
                        4242 4242 4242 4242 (Test Card)
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-500">
                          12/25
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-500">
                          123
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleMockPayment}
                  disabled={isProcessing}
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
                      {trial ? 'Start Free Trial' : `Subscribe for $${(product.price / 100).toFixed(2)}/${product.recurringInterval}`}
                    </>
                  )}
                </Button>

                <div className="text-center text-xs text-gray-500">
                  <p className="mb-2">🔒 This is a secure mock checkout for demonstration</p>
                  <p>No real payment will be processed</p>
                </div>
              </CardContent>
            </Card>

            {/* Trust indicators */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  Mock SSL Secured
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-blue-500" />
                  Instant Demo Access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
