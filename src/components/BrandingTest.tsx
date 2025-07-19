'use client'

import React from 'react'
import { useBrandingContext } from '@/contexts/BrandingContext'

export const BrandingTest: React.FC = () => {
  const { branding, loading, error } = useBrandingContext()

  if (loading) {
    return <div className="p-4 border rounded">Loading branding...</div>
  }

  if (error) {
    return <div className="p-4 border rounded text-red-600">Error: {error}</div>
  }

  return (
    <div className="p-4 border rounded space-y-2">
      <h3 className="font-bold">Dynamic Branding Test</h3>
      <div>Name: {branding?.name || 'Not set'}</div>
      <div>Primary Color: 
        <span 
          className="inline-block w-4 h-4 ml-2 border" 
          style={{ backgroundColor: branding?.primaryColor }}
        ></span>
        {branding?.primaryColor}
      </div>
      <div>Accent Color: 
        <span 
          className="inline-block w-4 h-4 ml-2 border" 
          style={{ backgroundColor: branding?.accentColor }}
        ></span>
        {branding?.accentColor}
      </div>
      <div>Logo URL: {branding?.logo?.url || 'Not set'}</div>
      <div>Icon URL: {branding?.icon?.url || 'Not set'}</div>
      <div>Title Suffix: {branding?.titleSuffix || 'Not set'}</div>
    </div>
  )
}
