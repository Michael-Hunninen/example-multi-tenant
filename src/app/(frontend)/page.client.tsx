'use client'
import React, { useEffect } from 'react'
import { useHeaderTheme } from '@/providers'

const FrontendClient: React.FC = () => {
  /* Set the header theme for frontend pages */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])
  
  return <React.Fragment />
}

export default FrontendClient
