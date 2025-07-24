import React from 'react'
import type { Metadata } from 'next'

// Define metadata for the root layout
export const metadata: Metadata = {
  title: 'Multi-Tenant Example',
  description: 'A multi-tenant application with Payload CMS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
