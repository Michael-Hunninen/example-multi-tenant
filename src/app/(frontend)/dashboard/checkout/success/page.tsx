'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        setError('No session ID provided')
        setLoading(false)
        return
      }

      try {
        // You could fetch session details from Stripe here if needed
        // For now, we'll just show a success message
        setLoading(false)
      } catch (error) {
        console.error('Error fetching session data:', error)
        setError('Failed to verify payment')
        setLoading(false)
      }
    }

    fetchSessionData()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="bg-gray-900 border-gray-800 text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white mb-2">
              Payment Successful!
            </CardTitle>
            <p className="text-gray-400">
              Thank you for your purchase. Your subscription is now active and you have full access to the platform.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {sessionId && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Session ID</p>
                <p className="text-xs text-gray-300 font-mono break-all">{sessionId}</p>
              </div>
            )}

            <div className="space-y-3">
              <Button asChild className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <Link href="/dashboard" className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Go to Dashboard
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                <Link href="/dashboard/videos" className="flex items-center justify-center gap-2">
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Need help? <Link href="/contact" className="text-teal-400 hover:text-teal-300">Contact support</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
