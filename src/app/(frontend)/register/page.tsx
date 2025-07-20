'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthProvider, useAuth } from '@/components/LMSAuth/AuthWrapper'
import { Button } from '@/components/ui/button'

// Internal component for registration form
function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setIsLoading(true)

    try {
      console.log('REGISTER PAGE DEBUG - Starting registration process')
      const success = await register(email, password, name)
      
      if (success) {
        console.log('REGISTER PAGE DEBUG - Registration successful, redirecting to dashboard')
        // Registration was successful and user is automatically logged in
        router.push('/dashboard')
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (err) {
      console.error('REGISTER PAGE DEBUG - Registration error:', err)
      setError('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Join our learning platform today</p>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input 
              id="name" 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="John Smith"
              required
            />
          </div>
          
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input 
              id="confirmPassword" 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium py-3 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-400 hover:text-teal-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
    </div>
  )
}

// Main page component that provides auth context
export default function RegisterPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <RegisterForm />
      </div>
    </AuthProvider>
  )
}
