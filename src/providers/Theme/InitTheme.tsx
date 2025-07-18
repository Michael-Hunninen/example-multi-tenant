'use client'

import React, { useEffect } from 'react'
import { useTheme } from '.'

export const InitTheme: React.FC = () => {
  const { theme } = useTheme()

  useEffect(() => {
    // Initialize theme on mount - this fixes the opacity:0 in globals.css that hides content until theme is set
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  return null
}
