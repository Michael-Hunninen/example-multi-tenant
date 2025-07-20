'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        const response = await fetch('/api/auth/check-admin')
        const data = await response.json()
        
        if (data.isAdmin) {
          setIsAuthorized(true)
        } else {
          // Redirect regular users to their dashboard
          router.push('/dashboard')
          return
        }
      } catch (error) {
        console.error('Admin access check failed:', error)
        // Redirect to login on error
        router.push('/login')
        return
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAccess()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Checking access permissions...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have permission to access the admin panel.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
