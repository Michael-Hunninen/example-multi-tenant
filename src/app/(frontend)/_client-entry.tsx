'use client'

import { useEffect } from 'react'

/**
 * This component serves as the main client entry point for the (frontend) route group
 * to ensure Next.js properly generates the client reference manifest during build.
 * 
 * It's intentionally kept minimal and doesn't render anything visible.
 */
export default function FrontendClientEntry() {
  useEffect(() => {
    // This effect ensures the client component is properly processed
    console.log('Frontend client entry point initialized')
  }, [])

  return <div data-frontend-client-entry className="hidden" />
}
