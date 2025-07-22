'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/LMSAuth/AuthWrapper'
import { canAccessAdmin } from '@/utilities/userPermissions'

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Check if user can access admin
      if (!canAccessAdmin(user)) {
        // Redirect regular users away from admin
        router.push('/dashboard')
        return
      }
    }
  }, [user, isLoading, router])

  // Show loading while checking permissions
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // Don't render admin content for regular users
  if (user && !canAccessAdmin(user)) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
            <h1 className="text-xl font-bold text-red-400 mb-2">Access Denied</h1>
            <p className="text-gray-300">
              You don't have permission to access the admin dashboard. 
              Only administrators can access this area.
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Render admin content for authorized users
  return <>{children}</>
}
