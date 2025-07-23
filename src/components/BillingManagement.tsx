"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Download, ExternalLink, AlertTriangle, CheckCircle, Clock, X } from "lucide-react"
import { useAuth } from '@/components/LMSAuth/AuthWrapper'

interface BillingData {
  hasSubscription: boolean
  subscriptions: Array<{
    id: string
    status: string
    productName: string
    productDescription: string
    amount: number
    currency: string
    interval: string
    currentPeriodStart: number
    currentPeriodEnd: number
    cancelAtPeriodEnd: boolean
    canceledAt: number | null
    trialEnd: number | null
    defaultPaymentMethod: any
  }>
  paymentMethods: Array<{
    id: string
    type: string
    card: {
      brand: string
      last4: string
      expMonth: number
      expYear: number
    } | null
  }>
  invoices: Array<{
    id: string
    number: string | null
    status: string
    amount: number
    currency: string
    created: number
    paidAt: number | null
    hostedInvoiceUrl: string | null
    invoicePdf: string | null
    description: string
  }>
  stripeCustomerId: string
}

interface BillingManagementProps {
  userId: string
}

export default function BillingManagement({ userId }: BillingManagementProps) {
  const [billingData, setBillingData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [availablePlans, setAvailablePlans] = useState<any[]>([])

  // Fetch billing data
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/lms/user-billing?userId=${userId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch billing data')
        }
        
        const data = await response.json()
        setBillingData(data)
        
        // Also fetch available plans for plan changes
        const plansResponse = await fetch('/api/lms/products')
        if (plansResponse.ok) {
          const plansData = await plansResponse.json()
          setAvailablePlans(plansData.products || [])
        }
        
      } catch (err) {
        console.error('Error fetching billing data:', err)
        setError('Failed to load billing information')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchBillingData()
    }
  }, [userId])

  const handleSubscriptionAction = async (action: string, subscriptionId?: string, priceId?: string) => {
    try {
      setActionLoading(action)
      
      if (action === 'create_customer_portal_session') {
        // Open Stripe Customer Portal
        const response = await fetch('/api/lms/subscription-management', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            action
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to create portal session')
        }
        
        const data = await response.json()
        if (data.url) {
          window.open(data.url, '_blank')
        }
        return
      }
      
      const response = await fetch('/api/lms/subscription-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action,
          subscriptionId,
          priceId
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update subscription')
      }
      
      const result = await response.json()
      
      // Refresh billing data
      const billingResponse = await fetch(`/api/lms/user-billing?userId=${userId}`)
      if (billingResponse.ok) {
        const updatedData = await billingResponse.json()
        setBillingData(updatedData)
      }
      
      // Show success message (you could add a toast notification here)
      alert(result.message || 'Action completed successfully')
      
    } catch (err) {
      console.error('Error updating subscription:', err)
      alert('Failed to update subscription. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-900/20 text-green-400', label: 'Active' },
      trialing: { color: 'bg-blue-900/20 text-blue-400', label: 'Trial' },
      past_due: { color: 'bg-yellow-900/20 text-yellow-400', label: 'Past Due' },
      canceled: { color: 'bg-red-900/20 text-red-400', label: 'Canceled' },
      unpaid: { color: 'bg-red-900/20 text-red-400', label: 'Unpaid' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.canceled
    return <Badge className={config.color}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!billingData?.hasSubscription) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">No Active Subscription</CardTitle>
          <CardDescription className="text-gray-400">
            You don't have an active subscription yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="bg-teal-500 hover:bg-teal-600">
            <a href="/dashboard/pricing">View Plans</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      {billingData.subscriptions.map((subscription) => (
        <Card key={subscription.id} className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Current Subscription
              {getStatusBadge(subscription.status)}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Manage your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-teal/10 border border-teal/20 rounded-lg">
              <div>
                <h3 className="font-semibold text-white">{subscription.productName}</h3>
                <p className="text-sm text-gray-400">{subscription.productDescription}</p>
                {subscription.cancelAtPeriodEnd && (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <p className="text-sm text-yellow-400">
                      Cancels on {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-teal">
                  {formatCurrency(subscription.amount, subscription.currency)}/{subscription.interval}
                </p>
                <p className="text-sm text-gray-400">
                  Next billing: {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300"
                onClick={() => handleSubscriptionAction('create_customer_portal_session')}
                disabled={actionLoading === 'create_customer_portal_session'}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
              
              {subscription.cancelAtPeriodEnd ? (
                <Button
                  variant="outline"
                  className="border-green-700 text-green-400 hover:bg-green-900/20"
                  onClick={() => handleSubscriptionAction('reactivate_subscription', subscription.id)}
                  disabled={actionLoading === 'reactivate_subscription'}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Reactivate Subscription
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="border-red-700 text-red-400 hover:bg-red-900/20"
                  onClick={() => handleSubscriptionAction('cancel_subscription', subscription.id)}
                  disabled={actionLoading === 'cancel_subscription'}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Payment Method */}
      {billingData.paymentMethods.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Payment Method</CardTitle>
            <CardDescription className="text-gray-400">
              Your current payment method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {billingData.paymentMethods.map((pm) => (
              <div key={pm.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    {pm.card?.brand.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white">•••• •••• •••• {pm.card?.last4}</p>
                    <p className="text-sm text-gray-400">
                      Expires {pm.card?.expMonth}/{pm.card?.expYear}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => handleSubscriptionAction('create_customer_portal_session')}
                >
                  Update
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Billing History</CardTitle>
          <CardDescription className="text-gray-400">
            Your recent billing history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {billingData.invoices.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No billing history available</p>
            ) : (
              billingData.invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-white">{formatDate(invoice.created)}</p>
                    <p className="text-sm text-gray-400">{invoice.description}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-white">{formatCurrency(invoice.amount, invoice.currency)}</p>
                      {getStatusBadge(invoice.status)}
                    </div>
                    {invoice.hostedInvoiceUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <a href={invoice.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
