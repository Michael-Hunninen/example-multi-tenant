'use client'

import React from 'react'
import { useBrandingContext } from '@/contexts/BrandingContext'
import { getTenantFromClient } from '@/utilities/getTenantFromClient'

export const TenantBrandingTest: React.FC = () => {
  const { branding, loading, error, currentTenant } = useBrandingContext()
  const clientTenant = getTenantFromClient()

  if (loading) {
    return <div className="p-4 border rounded">Loading tenant branding...</div>
  }

  if (error) {
    return <div className="p-4 border rounded text-red-600">Error: {error}</div>
  }

  return (
    <div className="p-4 border rounded space-y-3 bg-gray-50">
      <h3 className="font-bold text-lg">Multi-Tenant Branding Test</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold">Tenant Information</h4>
          <div className="text-sm space-y-1">
            <div>Current Tenant (Context): <span className="font-mono">{currentTenant || 'None'}</span></div>
            <div>Client Detected Tenant: <span className="font-mono">{clientTenant || 'None'}</span></div>
            <div>Domain: <span className="font-mono">{typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</span></div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold">Branding Data</h4>
          <div className="text-sm space-y-1">
            <div>Branding Name: <span className="font-mono">{branding?.name || 'Not set'}</span></div>
            <div>Branding Tenant ID: <span className="font-mono">{branding?.tenantId || 'Not set'}</span></div>
            <div>Logo URL: <span className="font-mono text-xs">{branding?.logo?.url ? '✓ Set' : '✗ Not set'}</span></div>
            <div>Icon URL: <span className="font-mono text-xs">{branding?.icon?.url ? '✓ Set' : '✗ Not set'}</span></div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold">Brand Colors</h4>
        <div className="flex space-x-4 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Primary:</span>
            <div 
              className="w-6 h-6 border border-gray-300 rounded" 
              style={{ backgroundColor: branding?.primaryColor }}
            ></div>
            <span className="font-mono text-sm">{branding?.primaryColor}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Accent:</span>
            <div 
              className="w-6 h-6 border border-gray-300 rounded" 
              style={{ backgroundColor: branding?.accentColor }}
            ></div>
            <span className="font-mono text-sm">{branding?.accentColor}</span>
          </div>
        </div>
      </div>
      
      {branding?.logo?.url && (
        <div>
          <h4 className="font-semibold">Current Logo</h4>
          <img 
            src={branding.logo.url} 
            alt="Tenant Logo" 
            className="max-w-32 h-auto border border-gray-300 rounded"
          />
        </div>
      )}
      
      <div className="text-xs text-gray-600 mt-4">
        <strong>Instructions:</strong> Create different branding documents for different tenants in the admin panel. 
        Access the app through different domains or set tenant cookies to see different branding.
      </div>
    </div>
  )
}
