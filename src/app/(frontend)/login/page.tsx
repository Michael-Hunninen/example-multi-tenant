'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthProvider, useAuth } from '@/components/LMSAuth/AuthWrapper'
import { Button } from '@/components/ui/button'

// Internal component that uses auth context
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
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
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred during login')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
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
