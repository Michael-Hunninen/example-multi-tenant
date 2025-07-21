'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/LMSAuth/AuthWrapper'

interface TenantAccessGuardProps {
  children: React.ReactNode
}

export default function TenantAccessGuard({ children }: TenantAccessGuardProps) {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [isValidating, setIsValidating] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    async function validateTenantAccess() {
      console.log('TENANT ACCESS GUARD - Starting validation...')
      
      if (authLoading) {
        console.log('TENANT ACCESS GUARD - Auth still loading, waiting...')
        return
      }

      if (!isAuthenticated || !user) {
        console.log('TENANT ACCESS GUARD - User not authenticated, redirecting to login')
        router.push('/login')
        return
      }

      console.log('TENANT ACCESS GUARD - User authenticated:', user.email)
      console.log('TENANT ACCESS GUARD - User roles:', user.roles)
      console.log('TENANT ACCESS GUARD - User tenant context:', user.tenantId)

      // Check if user is super-admin (can access all tenants)
      const isSuperAdmin = user.roles && user.roles.includes('super-admin')
      if (isSuperAdmin) {
        console.log('TENANT ACCESS GUARD - Super-admin access granted')
        setHasAccess(true)
        setIsValidating(false)
        return
      }

      // For regular users, validate tenant access
      try {
        const hostname = window.location.hostname
        console.log('TENANT ACCESS GUARD - Validating access for hostname:', hostname)
        
        const domainResponse = await fetch(`/api/domain-info?domain=${encodeURIComponent(hostname)}`)
        
        if (!domainResponse.ok) {
          console.log('TENANT ACCESS GUARD - Failed to get domain info, denying access')
          await logout()
          router.push('/login')
          return
        }

        const domainData = await domainResponse.json()
        const currentTenant = domainData.tenant

        if (!currentTenant) {
          console.log('TENANT ACCESS GUARD - No tenant found for domain, denying access')
          await logout()
          router.push('/login')
          return
        }

        console.log('TENANT ACCESS GUARD - Current tenant:', currentTenant.id, currentTenant.name)
        console.log('TENANT ACCESS GUARD - User tenant ID from auth:', user.tenantId)

        // Check if user has access to this tenant
        if (user.tenantId === currentTenant.id) {
          console.log('TENANT ACCESS GUARD - Tenant access granted')
          setHasAccess(true)
        } else {
          console.log('TENANT ACCESS GUARD - User does not have access to current tenant')
          console.log('TENANT ACCESS GUARD - Expected:', currentTenant.id, 'Got:', user.tenantId)
          
          // Log out user and redirect to login where they can create account for this tenant
          await logout()
          router.push('/login')
          return
        }
      } catch (error) {
        console.error('TENANT ACCESS GUARD - Error validating tenant access:', error)
        await logout()
        router.push('/login')
        return
      }

      setIsValidating(false)
    }

    validateTenantAccess()
  }, [isAuthenticated, user, authLoading, router, logout])

  // Show loading state while validating
  if (authLoading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Validating access...</p>
        </div>
      </div>
    )
  }

  // Show access denied state (shouldn't normally be seen due to redirects)
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have access to this tenant's dashboard.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Render children if access is granted
  return <>{children}</>
}
