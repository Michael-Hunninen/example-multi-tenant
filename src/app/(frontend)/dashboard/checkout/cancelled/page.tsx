'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="bg-gray-900 border-gray-800 text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white mb-2">
              Payment Cancelled
            </CardTitle>
            <p className="text-gray-400">
              Your payment was cancelled. No charges were made to your account.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-300">
                Don't worry - you can try again at any time. Your subscription selection has been saved.
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <Link href="/dashboard/pricing" className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                <Link href="/dashboard" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Questions about pricing? <Link href="/contact" className="text-teal-400 hover:text-teal-300">Contact support</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
