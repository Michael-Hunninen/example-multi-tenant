'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useServiceWorker } from '@/hooks/useServiceWorker'
import { formatBytes, getCacheUsagePercentage } from '@/utilities/serviceWorkerUtils'
import { 
  RefreshCw, 
  Trash2, 
  Download, 
  Wifi, 
  WifiOff, 
  HardDrive,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

interface CacheManagerProps {
  tenantSlug?: string
  className?: string
}

export default function CacheManager({ tenantSlug, className }: CacheManagerProps) {
  const { 
    status, 
    caches, 
    networkStatus, 
    isLoading, 
    refreshCaches, 
    clearCaches, 
    updateSW 
  } = useServiceWorker()
  
  const [storageUsage, setStorageUsage] = useState(0)
  const [clearing, setClearing] = useState(false)
  const [updating, setUpdating] = useState(false)

  // Get storage usage percentage
  useEffect(() => {
    getCacheUsagePercentage().then(setStorageUsage)
  }, [caches])

  const handleClearCaches = async () => {
    setClearing(true)
    try {
      const success = await clearCaches(tenantSlug)
      if (success) {
        // Show success message
        console.log('Caches cleared successfully')
      }
    } finally {
      setClearing(false)
    }
  }

  const handleUpdateServiceWorker = async () => {
    setUpdating(true)
    try {
      const success = await updateSW()
      if (success) {
        console.log('Service worker updated successfully')
      }
    } finally {
      setUpdating(false)
    }
  }

  const totalCacheSize = caches.reduce((total, cache) => total + cache.size, 0)
  const totalCacheEntries = caches.reduce((total, cache) => total + cache.entries, 0)

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Service Worker Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Service Worker Status
            </CardTitle>
            <CardDescription>
              Current status of the Progressive Web App service worker
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Supported</span>
                <Badge variant={status.isSupported ? "default" : "destructive"}>
                  {status.isSupported ? "Yes" : "No"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Registered</span>
                <Badge variant={status.isRegistered ? "default" : "secondary"}>
                  {status.isRegistered ? "Active" : "Not Registered"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Controlling</span>
                <Badge variant={status.isControlling ? "default" : "secondary"}>
                  {status.isControlling ? "Yes" : "No"}
                </Badge>
              </div>
            </div>

            {status.scriptURL && (
              <div className="text-xs text-gray-600 mt-2">
                <strong>Script URL:</strong> {status.scriptURL}
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleUpdateServiceWorker}
                disabled={updating || !status.isRegistered}
                size="sm"
                variant="outline"
              >
                {updating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Update Service Worker
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {networkStatus.isOnline ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600" />
              )}
              Network Status
            </CardTitle>
            <CardDescription>
              Current network connection information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Connection</span>
                <Badge variant={networkStatus.isOnline ? "default" : "destructive"}>
                  {networkStatus.isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
              
              {networkStatus.effectiveType && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Speed</span>
                  <Badge variant="secondary">
                    {networkStatus.effectiveType.toUpperCase()}
                  </Badge>
                </div>
              )}
            </div>
            
            {networkStatus.downlink && networkStatus.rtt && (
              <div className="mt-4 text-xs text-gray-600">
                <div><strong>Downlink:</strong> {networkStatus.downlink} Mbps</div>
                <div><strong>RTT:</strong> {networkStatus.rtt} ms</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cache Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-600" />
              Cache Storage
            </CardTitle>
            <CardDescription>
              Cached data for offline functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Storage Usage */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Usage</span>
                <span>{storageUsage}%</span>
              </div>
              <Progress value={storageUsage} className="h-2" />
            </div>

            {/* Cache Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Total Size</span>
                <Badge variant="secondary">
                  {formatBytes(totalCacheSize)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Cached Items</span>
                <Badge variant="secondary">
                  {totalCacheEntries} items
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                onClick={refreshCaches}
                disabled={isLoading}
                size="sm"
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleClearCaches}
                disabled={clearing || caches.length === 0}
                size="sm"
                variant="destructive"
              >
                {clearing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Caches
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Individual Cache Details */}
        {caches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-600" />
                Cache Details
              </CardTitle>
              <CardDescription>
                Breakdown of individual cache stores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {caches.map((cache, index) => (
                  <div 
                    key={cache.name} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{cache.name}</div>
                      <div className="text-xs text-gray-600">
                        {cache.entries} entries
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        {formatBytes(cache.size)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">About PWA Caching</p>
                <p>
                  This Progressive Web App uses intelligent caching to provide offline functionality. 
                  Cached data includes pages you've visited, images, and API responses to ensure 
                  a smooth experience even without an internet connection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
