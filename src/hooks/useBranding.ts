import { useEffect, useState } from 'react'
import type { BrandingSettings } from '../utilities/getBranding'

export const useBranding = () => {
  const [branding, setBranding] = useState<BrandingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/branding-simple')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch branding: ${response.status}`)
        }
        
        const data = await response.json()
        setBranding(data)
        setError(null)
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

    fetchBranding()
  }, [])

  // Function to refresh branding data (useful after updates)
  const refreshBranding = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/branding')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch branding: ${response.status}`)
      }
      
      const data = await response.json()
      setBranding(data)
      setError(null)
    } catch (err) {
      console.error('Error refreshing branding:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return {
    branding,
    loading,
    error,
    refreshBranding,
  }
}

// Hook for getting branding with tenant context
export const useTenantBranding = (tenantId?: string) => {
  const [branding, setBranding] = useState<BrandingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTenantBranding = async () => {
      try {
        setLoading(true)
        const url = tenantId ? `/api/branding?tenant=${tenantId}` : '/api/branding'
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tenant branding: ${response.status}`)
        }
        
        const data = await response.json()
        setBranding(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching tenant branding:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        // Fallback to default branding
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

    fetchTenantBranding()
  }, [tenantId])

  return {
    branding,
    loading,
    error,
  }
}
