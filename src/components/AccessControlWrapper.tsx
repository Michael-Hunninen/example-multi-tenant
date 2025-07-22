'use client'

import { useAuth } from '@/components/LMSAuth/AuthWrapper'
import { getUserPermissions } from '@/utilities/userPermissions'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Crown, Zap, Star } from 'lucide-react'
import Link from 'next/link'

interface AccessControlWrapperProps {
  children: React.ReactNode
  requiredPermission: 'canAccessPrograms' | 'canAccessLiveLessons'
  featureName: string
  upgradeMessage: string
}

export default function AccessControlWrapper({
  children,
  requiredPermission,
  featureName,
  upgradeMessage
}: AccessControlWrapperProps) {
  const { user } = useAuth()
  const [permissions, setPermissions] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPermissions() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const userPermissions = await getUserPermissions(user)
        setPermissions(userPermissions)
      } catch (error) {
        console.error('Error loading permissions:', error)
        // Default to no access on error
        setPermissions({ [requiredPermission]: false })
      } finally {
        setLoading(false)
      }
    }

    loadPermissions()
  }, [user, requiredPermission])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  // If user has access, show the content normally
  if (permissions && permissions[requiredPermission]) {
    return <>{children}</>
  }

  // If user doesn't have access, show the upgrade prompt with blurred content
  return (
    <div className="relative">
      {/* Blurred content in background */}
      <div className="blur-sm pointer-events-none select-none opacity-30">
        {children}
      </div>
      
      {/* Access denied overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
        <Card className="max-w-md mx-4 bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-teal-500/20 rounded-full w-fit">
              <Lock className="w-8 h-8 text-teal-400" />
            </div>
            <CardTitle className="text-white text-xl">
              {featureName} Access Required
            </CardTitle>
            <CardDescription className="text-gray-300">
              {upgradeMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current tier info */}
            {permissions?.tier && (
              <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-400">Current Plan</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  {permissions.tier === 'basic' && <Star className="w-4 h-4 text-gray-400" />}
                  {permissions.tier === 'premium' && <Crown className="w-4 h-4 text-blue-400" />}
                  {permissions.tier === 'vip' && <Zap className="w-4 h-4 text-purple-400" />}
                  {permissions.tier === 'enterprise' && <Star className="w-4 h-4 text-gold-400" />}
                  <span className="text-white font-medium capitalize">
                    {permissions.tier}
                  </span>
                </div>
              </div>
            )}

            {/* Upgrade buttons */}
            <div className="space-y-2">
              <Button 
                asChild 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Link href="/dashboard/pricing">
                  Upgrade to Unlock
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Link href="/dashboard">
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            {/* Feature preview */}
            <div className="text-center text-xs text-gray-500 mt-4">
              <p>Upgrade to access {featureName.toLowerCase()} and unlock your full potential</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
