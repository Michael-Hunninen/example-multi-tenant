"use client"

import React, { useEffect, useState } from 'react'
import { BrandingSettings } from '../../utilities/getBranding'

const css = `
  html[data-theme="dark"] .text {
    fill: white;
  }

  html[data-theme="dark"] .bg {
    fill: #0C0C0C;
  }

  .graphic-icon {
    width: 50px;
    height: 50px;
  }
`

// Default icon as fallback
const DefaultIcon = () => (
  <svg
    className="graphic-icon"
    fill="none"
    height="50"
    viewBox="0 0 50 50"
    width="50"
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{css}</style>
    <rect
      className="bg"
      fill="#0C0C0C"
      height="50"
      width="50"
      rx="10"
    />
    <path
      className="text"
      d="M10 25.5C10 24.1193 11.1193 23 12.5 23H37.5C38.8807 23 40 24.1193 40 25.5C40 26.8807 38.8807 28 37.5 28H12.5C11.1193 28 10 26.8807 10 25.5Z"
      fill="white"
    />
    <path
      className="text"
      d="M23 12.5C23 11.1193 24.1193 10 25.5 10C26.8807 10 28 11.1193 28 12.5V37.5C28 38.8807 26.8807 40 25.5 40C24.1193 40 23 38.8807 23 37.5V12.5Z"
      fill="white"
    />
  </svg>
)

export const Icon = () => {
  const [branding, setBranding] = useState<BrandingSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const brandingResponse = await fetch('/api/branding-simple')
        if (brandingResponse.ok) {
          const data = await brandingResponse.json()
          setBranding(data)
          console.log('Icon: Fetched branding data for tenant:', data.tenantId || 'default', data)
        } else {
          console.error('Icon: Failed to fetch branding, status:', brandingResponse.status)
        }
      } catch (error) {
        console.error('Icon: Failed to fetch branding:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBranding()
  }, [])

  // Show default icon during loading or if no branding is found
  if (loading || !branding?.icon?.url) {
    return <DefaultIcon />
  }

  // When custom icon is available
  return (
    <img
      src={branding.icon.url}
      alt="Admin Icon"
      className="graphic-icon"
      style={{ maxWidth: '50px', height: 'auto' }}
    />
  )
}

export default Icon
