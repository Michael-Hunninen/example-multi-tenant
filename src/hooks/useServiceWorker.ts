'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  getServiceWorkerStatus, 
  getCacheInfo, 
  clearTenantCaches, 
  updateServiceWorker,
  getNetworkStatus,
  onServiceWorkerUpdate,
  type ServiceWorkerStatus,
  type CacheInfo
} from '@/utilities/serviceWorkerUtils'

export interface UseServiceWorkerReturn {
  // Status
  status: ServiceWorkerStatus
  caches: CacheInfo[]
  networkStatus: ReturnType<typeof getNetworkStatus>
  isLoading: boolean
  
  // Actions
  refreshCaches: () => Promise<void>
  clearCaches: (tenantSlug?: string) => Promise<boolean>
  updateSW: () => Promise<boolean>
  
  // Events
  onUpdate: (callback: () => void) => () => void
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isControlling: false
  })
  const [caches, setCaches] = useState<CacheInfo[]>([])
  const [networkStatus, setNetworkStatus] = useState(getNetworkStatus())
  const [isLoading, setIsLoading] = useState(true)

  // Refresh service worker status
  const refreshStatus = useCallback(async () => {
    try {
      const swStatus = await getServiceWorkerStatus()
      setStatus(swStatus)
    } catch (error) {
      console.error('Error refreshing service worker status:', error)
    }
  }, [])

  // Refresh cache information
  const refreshCaches = useCallback(async () => {
    try {
      const cacheInfo = await getCacheInfo()
      setCaches(cacheInfo)
    } catch (error) {
      console.error('Error refreshing cache info:', error)
    }
  }, [])

  // Clear caches with refresh
  const clearCaches = useCallback(async (tenantSlug?: string) => {
    try {
      const success = await clearTenantCaches(tenantSlug)
      if (success) {
        await refreshCaches()
      }
      return success
    } catch (error) {
      console.error('Error clearing caches:', error)
      return false
    }
  }, [refreshCaches])

  // Update service worker
  const updateSW = useCallback(async () => {
    try {
      const success = await updateServiceWorker()
      if (success) {
        await refreshStatus()
      }
      return success
    } catch (error) {
      console.error('Error updating service worker:', error)
      return false
    }
  }, [refreshStatus])

  // Network status listener
  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(getNetworkStatus())
    }

    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    // Also listen for connection change if available
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus)
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus)
      }
    }
  }, [])

  // Initialize data
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true)
      await Promise.all([
        refreshStatus(),
        refreshCaches()
      ])
      setIsLoading(false)
    }

    initialize()
  }, [refreshStatus, refreshCaches])

  // Service worker update listener
  const onUpdate = useCallback((callback: () => void) => {
    return onServiceWorkerUpdate(callback)
  }, [])

  return {
    status,
    caches,
    networkStatus,
    isLoading,
    refreshCaches,
    clearCaches,
    updateSW,
    onUpdate
  }
}
