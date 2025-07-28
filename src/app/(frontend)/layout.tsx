import React from 'react'
import FrontendLayoutClient from './layout.client'

// Enhanced layout with client component wrapper to help generate client reference manifest
export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return <FrontendLayoutClient>{children}</FrontendLayoutClient>
}
