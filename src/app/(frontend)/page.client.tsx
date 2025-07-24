'use client'
import React, { useEffect, type ReactNode } from 'react'
import { useHeaderTheme } from '@/providers'

interface ClientWrapperProps {
  children?: ReactNode
}

const FrontendClient: React.FC<ClientWrapperProps> = ({ children }) => {
  /* Set the header theme for frontend pages */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])
  
  return <>{children}</>
}

export default FrontendClient
