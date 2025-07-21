'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/LMSAuth/AuthWrapper'

interface CreateTenantAccountProps {
  email: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CreateTenantAccount({ email, onSuccess, onCancel }: CreateTenantAccountProps) {
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Call the create tenant account API
      const response = await fetch('/api/users/create-tenant-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create account')
      }

      const result = await response.json()
      console.log('CREATE TENANT ACCOUNT DEBUG - Success:', result)

      // Now try to login with the new tenant association
      const loginSuccess = await login(email, password)
      
      if (loginSuccess) {
        console.log('CREATE TENANT ACCOUNT DEBUG - Login successful after account creation')
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/dashboard')
        }
      } else {
        setError('Account created but login failed. Please try logging in again.')
      }
    } catch (err: any) {
      console.error('CREATE TENANT ACCOUNT ERROR:', err)
      setError(err.message || 'An error occurred while creating your account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-lg">LMS</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-600 mt-2">
          We found an existing account with <strong>{email}</strong>, but you don't have access to this platform yet.
        </p>
        <p className="text-gray-600 mt-1">
          Please verify your credentials to create an account for this platform.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input 
            id="email" 
            type="email" 
            value={email}
            disabled
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-600 rounded-md cursor-not-allowed"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input 
            id="password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name (Optional)
          </label>
          <input 
            id="name" 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your display name"
          />
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button 
            type="submit" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
          
          {onCancel && (
            <Button 
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 py-3"
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          This will create a separate account for this platform while keeping your existing accounts intact.
        </p>
      </div>
    </div>
  )
}
