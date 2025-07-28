'use client'

import { useEffect } from 'react'
import Head from 'next/head'

interface PWAMetadataProps {
  tenantName?: string
  tenantDescription?: string
  themeColor?: string
}

export default function PWAMetadata({ 
  tenantName = 'JG Performance Horses',
  tenantDescription = 'Professional reining training and horse performance education platform',
  themeColor = '#14b8a6'
}: PWAMetadataProps) {
  useEffect(() => {
    // Register tenant-aware service worker
    if ('serviceWorker' in navigator) {
      // Register the dynamic service worker
      navigator.serviceWorker
        .register('/api/sw.js')
        .then((registration) => {
          console.log(`Tenant-aware SW registered for ${tenantName}:`, registration)
          
          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            console.log('Service worker update found')
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New service worker available')
                  // Optionally notify user about update
                  if (window.confirm('A new version is available. Reload to update?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' })
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((registrationError) => {
          console.log('SW registration failed:', registrationError)
        })
        
      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATE_READY') {
          console.log('Service worker update ready')
        }
      })
      
      // Handle service worker controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker controller changed - reloading page')
        window.location.reload()
      })
    }
  }, [tenantName])

  return (
    <>
      {/* PWA Manifest */}
      <link rel="manifest" href="/api/manifest" />
      
      {/* iOS PWA Support */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={tenantName} />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Theme Colors */}
      <meta name="theme-color" content={themeColor} />
      <meta name="msapplication-TileColor" content={themeColor} />
      
      {/* Apple Touch Icons */}
      <link rel="apple-touch-icon" href="/api/pwa/icon/152x152" />
      <link rel="apple-touch-icon" sizes="152x152" href="/api/pwa/icon/152x152" />
      <link rel="apple-touch-icon" sizes="180x180" href="/api/pwa/icon/180x180" />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" sizes="32x32" href="/api/pwa/icon/32x32" />
      <link rel="icon" type="image/png" sizes="16x16" href="/api/pwa/icon/16x16" />
      
      {/* Microsoft Tiles */}
      <meta name="msapplication-square70x70logo" content="/api/pwa/icon/70x70" />
      <meta name="msapplication-square150x150logo" content="/api/pwa/icon/150x150" />
      <meta name="msapplication-wide310x150logo" content="/api/pwa/icon/310x150" />
      <meta name="msapplication-square310x310logo" content="/api/pwa/icon/310x310" />
      
      {/* PWA Description */}
      <meta name="description" content={tenantDescription} />
      
      {/* Open Graph for PWA */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={tenantName} />
      <meta property="og:description" content={tenantDescription} />
      <meta property="og:image" content="/api/pwa/icon/512x512" />
      
      {/* Twitter Card for PWA */}
      <meta name="twitter:card" content="summary" />  
      <meta name="twitter:title" content={tenantName} />
      <meta name="twitter:description" content={tenantDescription} />
      <meta name="twitter:image" content="/api/pwa/icon/512x512" />
    </>
  )
}
