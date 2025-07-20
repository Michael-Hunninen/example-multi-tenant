import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'
import { headers } from 'next/headers'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { BrandingProvider } from '@/contexts/BrandingContext'
// Temporarily removed to resolve circular dependency:
// import { TenantBrandingTest } from '@/components/TenantBrandingTest'
// import { TenantIsolationTest } from '@/components/TenantIsolationTest'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'



export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const headersList = await headers()
  
  // Get tenant information from middleware headers
  const tenantDomain = headersList.get('x-tenant-domain') || 'localhost:3000'
  const tenantSlug = headersList.get('x-tenant-slug') || 'agency-owner'
  
  // Resolve tenant from domain for server-side context
  const tenant = await getTenantByDomain(tenantDomain)
  const tenantId = tenant?.id
  
  // Check if this is a dashboard route on the server side
  const pathname = headersList.get('x-pathname') || ''
  // More robust check for dashboard routes using both pathname and URL path segments
  const url = new URL(headersList.get('x-url') || 'http://localhost')
  const urlPathname = url.pathname
  const isDashboardRoute = pathname.startsWith('/dashboard') || urlPathname.startsWith('/dashboard')

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <BrandingProvider tenantId={tenantId}>
            {/* Admin bar with high z-index to appear above everything */}
            {/* Hide admin bar on LMS pages, just like the header */}
            {!isDashboardRoute && (
              <div className="relative z-[9999]">
                <AdminBar
                  adminBarProps={{
                    preview: isEnabled,
                  }}
                />
              </div>
            )}
            {!isDashboardRoute && <Header tenantId={tenantId} />}
            <main className={cn(
              "flex-grow w-full",
              isDashboardRoute ? "pt-0" : "" // Dashboard has its own layout
            )}>
              {/* TenantIsolationTest temporarily removed to resolve circular dependency */}
              {children}
            </main>
            {!isDashboardRoute && <Footer tenantId={tenantId} />}
          </BrandingProvider>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
