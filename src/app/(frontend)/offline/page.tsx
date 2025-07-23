'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = async () => {
    setRetrying(true)
    
    try {
      // Try to fetch the home page to check connectivity
      const response = await fetch('/', { 
        method: 'HEAD',
        cache: 'no-cache'
      })
      
      if (response.ok) {
        // Connection restored, redirect to home
        window.location.href = '/'
      } else {
        throw new Error('Connection test failed')
      }
    } catch (error) {
      console.log('Still offline:', error)
      setTimeout(() => setRetrying(false), 1000)
    }
  }

  const handleClearCache = async () => {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        // Clear all caches
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
        
        // Unregister service worker
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(
          registrations.map(registration => registration.unregister())
        )
        
        alert('Cache cleared! The page will reload.')
        window.location.reload()
      } catch (error) {
        console.error('Error clearing cache:', error)
        alert('Error clearing cache. Please try manually refreshing the page.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Connection Status Icon */}
        <div className="mb-6">
          {isOnline ? (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wifi className="w-8 h-8 text-green-600" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <WifiOff className="w-8 h-8 text-red-600" />
            </div>
          )}
        </div>

        {/* Status Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isOnline ? 'Connection Restored!' : 'You\'re Offline'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {isOnline 
            ? 'Your internet connection has been restored. You can now access all features.'
            : 'It looks like you\'ve lost your internet connection. Some features may be limited while offline.'
          }
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isOnline ? (
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button 
              onClick={handleRetry}
              disabled={retrying}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
            >
              {retrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking Connection...
                </>
              ) : (
                'Try Again'
              )}
            </Button>
          )}
          
          <Button 
            onClick={handleClearCache}
            variant="outline"
            className="w-full"
          >
            Clear Cache & Refresh
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'}
            variant="ghost"
            className="w-full"
          >
            Go to Homepage
          </Button>
        </div>

        {/* Offline Features Info */}
        {!isOnline && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Available Offline:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Previously viewed dashboard pages</li>
              <li>• Cached video content</li>
              <li>• Profile and settings (view only)</li>
              <li>• Already downloaded course materials</li>
            </ul>
          </div>
        )}

        {/* Connection Tips */}
        <div className="mt-6 text-xs text-gray-500">
          <p>
            Having trouble? Try switching between Wi-Fi and mobile data, 
            or check your internet connection settings.
          </p>
        </div>
      </div>
    </div>
  )
}
