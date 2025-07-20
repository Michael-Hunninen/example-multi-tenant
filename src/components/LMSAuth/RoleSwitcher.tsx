'use client'

import React from 'react'
import { useAuth } from './AuthWrapper'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'

export function RoleSwitcher() {
  const { user, logout } = useAuth()
  
  if (!user || !user.roles) return null
  
  // Get primary role (first in array) or default to 'regular'
  const primaryRole = user.roles[0] || 'regular'
  
  const switchRole = (newRole: 'regular' | 'business' | 'admin' | 'super-admin') => {
    // We can't directly modify user roles with localStorage anymore since we're using Payload auth
    // This is just for testing purposes - in a real app, this would call an API
    // to update the user's roles in the database
    
    // For demo purposes, we'll make a request to a mock endpoint
    console.log(`Switch role to: ${newRole} (would call API in production)`)
    
    // For now, just reload the page to simulate the change
    // In a real implementation, this would update the user's roles in the database
    setTimeout(() => window.location.reload(), 500)
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black border border-gray-700 rounded-lg shadow-lg p-3">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-400 mb-1 text-center">Test User Roles</div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={primaryRole === 'regular' ? 'default' : 'outline'}
            className={cn(
              "text-xs py-1 h-auto", 
              primaryRole === 'regular' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-600 text-blue-400'
            )}
            onClick={() => switchRole('regular')}
          >
            Regular
          </Button>
          <Button
            size="sm"
            variant={primaryRole === 'business' ? 'default' : 'outline'}
            className={cn(
              "text-xs py-1 h-auto", 
              primaryRole === 'business' ? 'bg-teal-600 hover:bg-teal-700' : 'border-teal-600 text-teal-400'
            )}
            onClick={() => switchRole('business')}
          >
            Business
          </Button>
          <Button
            size="sm"
            variant={primaryRole === 'admin' ? 'default' : 'outline'}
            className={cn(
              "text-xs py-1 h-auto", 
              primaryRole === 'admin' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-600 text-purple-400'
            )}
            onClick={() => switchRole('admin')}
          >
            Admin
          </Button>
        </div>
        <Button 
          size="sm" 
          variant="destructive"
          className="text-xs py-1 h-auto mt-1"
          onClick={logout}
        >
          Logout
        </Button>
        <div className="text-xs text-gray-500 mt-1 text-center">
          Current: {primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1)}
        </div>
      </div>
    </div>
  )
}
