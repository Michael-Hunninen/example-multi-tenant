'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TenantStripeCheckout } from '../../_components/TenantStripeCheckout'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PaymentDemoPage() {
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMode, setPaymentMode] = useState<'payment' | 'subscription'>('payment')
  
  // This would typically come from your database
  const demoProducts = [
    {
      id: 'demo-product-1',
      name: 'Basic Course',
      description: 'One-time payment for access to basic course materials',
      amount: 2500, // $25.00
      type: 'payment',
    },
    {
      id: 'demo-product-2',
      name: 'Premium Membership',
      description: 'Monthly subscription for premium course access',
      amount: 1999, // $19.99
      type: 'subscription',
    }
  ]
  
  const handlePurchase = (productType: 'payment' | 'subscription') => {
    setPaymentMode(productType)
    setShowCheckout(true)
  }
  
  const selectedProduct = demoProducts.find(p => p.type === paymentMode)
  
  return (
    <div className="container max-w-6xl mx-auto py-8">
      <Link href="/dashboard" className="flex items-center text-blue-600 mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Link>
      
      <h1 className="text-3xl font-bold mb-2">Tenant-Specific Stripe Demo</h1>
      <p className="text-gray-600 mb-8">
        This page demonstrates how each tenant can process payments through their own Stripe account.
        The payment form uses the tenant's Stripe configuration from the database.
      </p>
      
      {!showCheckout ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-2xl font-bold">
                    ${(product.amount / 100).toFixed(2)}
                    {product.type === 'subscription' && <span className="text-sm font-normal text-gray-500"> / month</span>}
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => handlePurchase(product.type as 'payment' | 'subscription')}
                >
                  {product.type === 'payment' ? 'Purchase Now' : 'Subscribe Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowCheckout(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Products
            </Button>
          </div>
          
          <TenantStripeCheckout 
            mode={paymentMode}
            productId={selectedProduct?.id || ''}
            amount={selectedProduct?.amount || 0}
            name={selectedProduct?.name || ''}
            description={selectedProduct?.description}
            currency="usd"
            successUrl="/dashboard/payment-demo?status=success"
            cancelUrl="/dashboard/payment-demo?status=canceled"
          />
        </div>
      )}
      
      <div className="mt-12 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Implementation Notes</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>This checkout uses the current tenant's Stripe API keys from the Tenants collection</li>
          <li>If tenant Stripe is not configured, it falls back to environment variables</li>
          <li>Payment intents and webhooks are processed using tenant-specific Stripe clients</li>
          <li>Webhook events are verified with tenant-specific webhook secrets</li>
        </ul>
      </div>
    </div>
  )
}
