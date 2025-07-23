/**
 * Service Worker Management Utilities
 * Provides helper functions for managing tenant-aware service workers
 */

export interface CacheInfo {
  name: string
  size: number
  entries: number
  lastModified?: Date
}

export interface ServiceWorkerStatus {
  isSupported: boolean
  isRegistered: boolean
  isControlling: boolean
  registrationScope?: string
  scriptURL?: string
  state?: string
}

/**
 * Get current service worker status
 */
export async function getServiceWorkerStatus(): Promise<ServiceWorkerStatus> {
  if (!('serviceWorker' in navigator)) {
    return {
      isSupported: false,
      isRegistered: false,
      isControlling: false
    }
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    const controller = navigator.serviceWorker.controller

    return {
      isSupported: true,
      isRegistered: !!registration,
      isControlling: !!controller,
      registrationScope: registration?.scope,
      scriptURL: registration?.active?.scriptURL,
      state: registration?.active?.state
    }
  } catch (error) {
    console.error('Error getting service worker status:', error)
    return {
      isSupported: true,
      isRegistered: false,
      isControlling: false
    }
  }
}

/**
 * Get information about all caches
 */
export async function getCacheInfo(): Promise<CacheInfo[]> {
  if (!('caches' in window)) {
    return []
  }

  try {
    const cacheNames = await caches.keys()
    const cacheInfoPromises = cacheNames.map(async (name) => {
      try {
        const cache = await caches.open(name)
        const keys = await cache.keys()
        
        // Calculate approximate cache size
        let totalSize = 0
        for (const request of keys.slice(0, 10)) { // Sample first 10 entries
          try {
            const response = await cache.match(request)
            if (response) {
              const blob = await response.blob()
              totalSize += blob.size
            }
          } catch (e) {
            // Skip errors for individual entries
          }
        }
        
        // Estimate total size based on sample
        const estimatedSize = keys.length > 10 
          ? Math.round((totalSize / 10) * keys.length) 
          : totalSize

        return {
          name,
          size: estimatedSize,
          entries: keys.length
        } as CacheInfo
      } catch (error) {
        console.error(`Error getting cache info for ${name}:`, error)
        return {
          name,
          size: 0,
          entries: 0
        } as CacheInfo
      }
    })

    return await Promise.all(cacheInfoPromises)
  } catch (error) {
    console.error('Error getting cache info:', error)
    return []
  }
}

/**
 * Clear all caches for the current tenant
 */
export async function clearTenantCaches(tenantSlug?: string): Promise<boolean> {
  if (!('caches' in window)) {
    return false
  }

  try {
    const cacheNames = await caches.keys()
    const cachesToDelete = tenantSlug 
      ? cacheNames.filter(name => name.includes(tenantSlug))
      : cacheNames // Clear all if no tenant specified

    await Promise.all(
      cachesToDelete.map(cacheName => caches.delete(cacheName))
    )

    console.log(`Cleared ${cachesToDelete.length} caches`)
    return true
  } catch (error) {
    console.error('Error clearing caches:', error)
    return false
  }
}

/**
 * Update service worker and refresh the page
 */
export async function updateServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (!registration) {
      return false
    }

    // Check for updates
    await registration.update()

    // If there's a waiting service worker, activate it
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      return true
    }

    return false
  } catch (error) {
    console.error('Error updating service worker:', error)
    return false
  }
}

/**
 * Preload important resources into cache
 */
export async function preloadResources(resources: string[]): Promise<boolean> {
  if (!('caches' in window) || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const controller = navigator.serviceWorker.controller
    if (!controller) {
      console.warn('No service worker controller available for preloading')
      return false
    }

    // Send message to service worker to preload resources
    controller.postMessage({
      type: 'PRELOAD_RESOURCES',
      resources
    })

    return true
  } catch (error) {
    console.error('Error preloading resources:', error)
    return false
  }
}

/**
 * Check if a resource is cached
 */
export async function isResourceCached(url: string): Promise<boolean> {
  if (!('caches' in window)) {
    return false
  }

  try {
    const cacheNames = await caches.keys()
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const response = await cache.match(url)
      if (response) {
        return true
      }
    }
    
    return false
  } catch (error) {
    console.error('Error checking cached resource:', error)
    return false
  }
}

/**
 * Get network status and connection info
 */
export function getNetworkStatus(): {
  isOnline: boolean
  connectionType?: string
  effectiveType?: string
  downlink?: number
  rtt?: number
} {
  const isOnline = navigator.onLine

  // Get connection info if available (mainly on mobile)
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection

  return {
    isOnline,
    connectionType: connection?.type,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt
  }
}

/**
 * Register service worker update listener
 */
export function onServiceWorkerUpdate(callback: () => void): () => void {
  if (!('serviceWorker' in navigator)) {
    return () => {}
  }

  const handleControllerChange = () => {
    callback()
  }

  navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

  // Return cleanup function
  return () => {
    navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
  }
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Get estimated cache usage as percentage of storage quota
 */
export async function getCacheUsagePercentage(): Promise<number> {
  if (!('storage' in navigator && 'estimate' in navigator.storage)) {
    return 0
  }

  try {
    const estimate = await navigator.storage.estimate()
    const used = estimate.usage || 0
    const quota = estimate.quota || 0
    
    return quota > 0 ? Math.round((used / quota) * 100) : 0
  } catch (error) {
    console.error('Error getting storage estimate:', error)
    return 0
  }
}
