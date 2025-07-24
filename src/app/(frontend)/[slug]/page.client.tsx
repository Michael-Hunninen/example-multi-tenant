'use client'
import React, { useEffect, type ReactNode } from 'react'
import { useHeaderTheme } from '@/providers'

interface PageClientProps {
  children?: ReactNode
}

const PageClient: React.FC<PageClientProps> = ({ children }) => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])
  
  return <>{children}</>
}

export default PageClient
