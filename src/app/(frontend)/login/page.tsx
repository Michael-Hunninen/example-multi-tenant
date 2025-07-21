'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthProvider, useAuth } from '@/components/LMSAuth/AuthWrapper'
import { Button } from '@/components/ui/button'
import GenericLogin from '../_components/GenericLogin'
import CreateTenantAccount from '../_components/CreateTenantAccount'

// Internal component that uses auth context
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateTenantAccount, setShowCreateTenantAccount] = useState(false)
  const [userEmailForTenantAccount, setUserEmailForTenantAccount] = useState('')
  const [customPagesEnabled, setCustomPagesEnabled] = useState<boolean | null>(null)
  const [layoutLoading, setLayoutLoading] = useState(true)
  
  const { login, user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    async function checkCustomPagesStatus() {
      try {
        // Get current domain from window location
        const currentDomain = window.location.host
        
        // Fetch domain info to check if custom pages are enabled
        const response = await fetch(`/api/domain-info?domain=${currentDomain}`)
        if (response.ok) {
          const domainInfo = await response.json()
          setCustomPagesEnabled(domainInfo?.enableCustomPages === true)
        } else {
          // Default to false if we can't fetch domain info
          setCustomPagesEnabled(false)
        }
      } catch (error) {
        console.error('Error checking custom pages status:', error)
        // Default to false on error
        setCustomPagesEnabled(false)
      } finally {
        setLayoutLoading(false)
      }
    }
    
    checkCustomPagesStatus()
  }, [])
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      console.log('LOGIN DEBUG - Already authenticated, redirecting to dashboard')
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, user, router])
  
  // Show loading while we determine which layout to use
  if (layoutLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  // If custom pages are NOT enabled, use the generic login
  if (customPagesEnabled === false) {
    return <GenericLogin />
  }
  
  // Otherwise, use the branded JG Performance Horses login (rest of existing code)
  
  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Checking authentication...</p>
        </div>
      </div>
    )
  }
  
  // Don't show login form if already authenticated
  if (isAuthenticated && user) {
    return (
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <p className="text-gray-300">Already logged in. Redirecting...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password)
      
      if (success) {
        // Check if there's a redirect URL stored in session
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin')
        if (redirectUrl) {
          sessionStorage.removeItem('redirectAfterLogin')
          router.push(redirectUrl)
        } else {
          // Default redirect to dashboard
          router.push('/dashboard')
        }
      } else {
        // Check if this might be a tenant access issue
        // We'll show a more helpful error and potentially the create account flow
        try {
          // Check if user exists but doesn't have tenant access
          const userCheckResponse = await fetch(`/api/users?where[email][equals]=${encodeURIComponent(email)}&limit=1`)
          if (userCheckResponse.ok) {
            const userData = await userCheckResponse.json()
            if (userData.docs && userData.docs.length > 0) {
              // User exists, might be a tenant access issue
              setUserEmailForTenantAccount(email)
              setShowCreateTenantAccount(true)
              setError('')
              return
            }
          }
        } catch (checkError) {
          console.error('Error checking user existence:', checkError)
        }
        
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred during login')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // If we're showing the create tenant account flow, render that instead
  if (showCreateTenantAccount) {
    return (
      <CreateTenantAccount 
        email={userEmailForTenantAccount}
        onSuccess={() => {
          // Redirect to dashboard after successful account creation
          const redirectUrl = sessionStorage.getItem('redirectAfterLogin')
          if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin')
            router.push(redirectUrl)
          } else {
            router.push('/dashboard')
          }
        }}
        onCancel={() => {
          setShowCreateTenantAccount(false)
          setUserEmailForTenantAccount('')
          setEmail('')
          setPassword('')
        }}
      />
    )
  }

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to continue your learning journey</p>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <Link href="/forgot-password" className="text-sm text-teal-400 hover:text-teal-300">
                Forgot password?
              </Link>
            </div>
            <input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div>
            <Button 
              type="submit" 
              className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium py-3 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-teal-400 hover:text-teal-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
    </div>
  )
}

// Main page component that provides auth context
export default function LoginPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </AuthProvider>
  )
}
