'use client'

/**
 * Client-side utility to get tenant information
 * Uses URL parameters, domain, or localStorage for tenant detection
 */
export function getTenantFromClient(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    // 1. Check URL parameters first (for tenant-specific routes)
    const urlParams = new URLSearchParams(window.location.search)
    const tenantParam = urlParams.get('tenant')
    if (tenantParam) {
      return tenantParam
    }

    // 2. Check if we're on a tenant-specific domain
    const hostname = window.location.hostname
    
    // Skip localhost and common development domains
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.includes('vercel.app')) {
      // In production, the domain itself could be the tenant identifier
      // You might want to map domains to tenant IDs here
      return hostname
    }

    // 3. Check for tenant in localStorage (set by login or domain detection)
    const storedTenant = localStorage.getItem('currentTenant')
    if (storedTenant) {
      return storedTenant
    }

    // 4. Check for tenant in cookies
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'tenant' && value) {
        return decodeURIComponent(value)
      }
    }

    return null
  } catch (error) {
    console.error('Error getting tenant from client:', error)
    return null
  }
}

/**
 * Set the current tenant in localStorage and cookie
 */
export function setCurrentTenant(tenantId: string): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem('currentTenant', tenantId)
    document.cookie = `tenant=${encodeURIComponent(tenantId)}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days
  } catch (error) {
    console.error('Error setting current tenant:', error)
  }
}
