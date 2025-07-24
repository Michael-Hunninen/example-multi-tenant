'use client'

// This component is solely intended to ensure that Next.js generates
// the necessary client reference manifest for the (frontend) route group
import { useEffect, useState } from 'react'

export function ClientComponent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <div className="hidden" /> : null
}

export default ClientComponent
