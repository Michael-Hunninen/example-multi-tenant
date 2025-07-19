'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { BrandingSettings } from '../utilities/getBranding'
import { getTenantFromClient } from '../utilities/getTenantFromClient'

interface BrandingContextType {
  branding: BrandingSettings | null
  loading: boolean
  error: string | null
  currentTenant: string | null
  refreshBranding: () => Promise<void>
  applyBrandingStyles: () => void
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined)

export const useBrandingContext = () => {
  const context = useContext(BrandingContext)
  if (context === undefined) {
    throw new Error('useBrandingContext must be used within a BrandingProvider')
  }
  return context
}

interface BrandingProviderProps {
  children: React.ReactNode
  tenantId?: string
}

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children, tenantId }) => {
  const [branding, setBranding] = useState<BrandingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTenant, setCurrentTenant] = useState<string | null>(null)

  const fetchBranding = async () => {
    try {
      setLoading(true)
      
      // Get current tenant from props, client detection, or URL
      const detectedTenant = tenantId || getTenantFromClient()
      setCurrentTenant(detectedTenant)
      
      console.log('BrandingProvider: Fetching branding for tenant:', detectedTenant)
      
      // The API will automatically detect tenant from request context
      // But we can also pass it as a parameter for explicit control
      const url = detectedTenant ? `/api/branding-simple?tenant=${detectedTenant}` : '/api/branding-simple'
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch branding: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('BrandingProvider: Received branding data:', data)
      setBranding(data)
      setError(null)
      
      // Update current tenant from API response if available
      if (data.tenantId) {
        setCurrentTenant(data.tenantId)
      }
    } catch (err) {
      console.error('Error fetching branding:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Set default branding on error
      setBranding({
        name: 'Multi-Tenant Platform',
        logo: { url: '/default-logo.svg', filename: 'default-logo.svg', mimeType: 'image/svg+xml', filesize: 0, width: 193, height: 34 },
        icon: { url: '/default-icon.svg', filename: 'default-icon.svg', mimeType: 'image/svg+xml', filesize: 0, width: 32, height: 32 },
        favicon: { url: '/favicon.ico', filename: 'favicon.ico', mimeType: 'image/x-icon', filesize: 0, width: 32, height: 32 },
        ogImage: { url: '/og-image.png', filename: 'og-image.png', mimeType: 'image/png', filesize: 0, width: 800, height: 600 },
        titleSuffix: '- Multi-Tenant Platform',
        metaDescription: 'Multi-Tenant SaaS Platform',
        ogDescription: 'Enterprise Multi-Tenant SaaS Platform',
        ogTitle: 'Multi-Tenant Dashboard',
        primaryColor: '#0C0C0C',
        accentColor: '#2D81FF',
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshBranding = async () => {
    await fetchBranding()
  }

  const applyBrandingStyles = () => {
    if (!branding) return

    // Apply CSS custom properties for dynamic theming
    const root = document.documentElement
    
    if (branding.primaryColor) {
      root.style.setProperty('--brand-primary', branding.primaryColor)
    }
    
    if (branding.accentColor) {
      root.style.setProperty('--brand-accent', branding.accentColor)
    }

    // Update document title if available
    if (branding.name && branding.titleSuffix) {
      document.title = `${branding.name} ${branding.titleSuffix}`
    }

    // Update meta description
    if (branding.metaDescription) {
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', branding.metaDescription)
      }
    }

    // Update favicon
    if (branding.favicon?.url) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (favicon) {
        favicon.href = branding.favicon.url
      }
    }

    // Update OG meta tags
    if (branding.ogTitle) {
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) {
        ogTitle.setAttribute('content', branding.ogTitle)
      }
    }

    if (branding.ogDescription) {
      const ogDescription = document.querySelector('meta[property="og:description"]')
      if (ogDescription) {
        ogDescription.setAttribute('content', branding.ogDescription)
      }
    }

    if (branding.ogImage?.url) {
      const ogImage = document.querySelector('meta[property="og:image"]')
      if (ogImage) {
        ogImage.setAttribute('content', branding.ogImage.url)
      }
    }
  }

  useEffect(() => {
    fetchBranding()
  }, [tenantId])
  
  // Re-fetch branding when tenant changes (e.g., domain change)
  useEffect(() => {
    const detectedTenant = getTenantFromClient()
    if (detectedTenant && detectedTenant !== currentTenant) {
      console.log('BrandingProvider: Tenant changed, re-fetching branding')
      fetchBranding()
    }
  }, [currentTenant])

  useEffect(() => {
    if (branding && !loading) {
      applyBrandingStyles()
    }
  }, [branding, loading])

  const value: BrandingContextType = {
    branding,
    loading,
    error,
    currentTenant,
    refreshBranding,
    applyBrandingStyles,
  }

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  )
}
