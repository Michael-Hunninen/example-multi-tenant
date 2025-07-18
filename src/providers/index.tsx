import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

export { useHeaderTheme } from './HeaderTheme'
export { useTheme } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>{children}</HeaderThemeProvider>
    </ThemeProvider>
  )
}
