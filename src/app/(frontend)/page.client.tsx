'use client'

import { useEffect } from 'react'

// Enhanced client component for route group compatibility
export default function FrontendClient() {
  useEffect(() => {
    // This empty effect ensures the client component is properly processed
    // during build time and generates the necessary manifest files
  }, [])

  return null
}
