'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/LMSAuth/AuthWrapper'
import { Button } from '@/components/ui/button'
import CreateTenantAccount from './CreateTenantAccount'

export default function GenericLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateTenantAccount, setShowCreateTenantAccount] = useState(false)
  const [userEmailForTenantAccount, setUserEmailForTenantAccount] = useState('')
  
  const { login, user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      console.log('LOGIN DEBUG - Already authenticated, redirecting to dashboard')
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, user, router])
  
  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }
  
  // Don't show login form if already authenticated
  if (isAuthenticated && user) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
        <div className="text-center">
          <p className="text-gray-600">Already logged in. Redirecting...</p>
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
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-lg">LMS</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Sign in to access your learning portal</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
            required
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </Link>
          </div>
          <input 
            id="password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
            required
          />
        </div>
        
        <div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </div>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
