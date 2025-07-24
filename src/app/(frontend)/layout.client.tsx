'use client'

// This is a client wrapper for the frontend route group layout
// It ensures proper client reference manifest generation for the route group with parentheses

import { ReactNode } from 'react'

export default function FrontendLayoutClient({ children }: { children: ReactNode }) {
  return <>{children}</>
}
