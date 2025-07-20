'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LMSUser, getCurrentUser, loginUser, logoutUser, registerUser, hasLMSAccess } from '@/utilities/auth'
import { Button } from '@/components/ui/button'

// Auth context state type
type AuthState = {
  user: LMSUser | null
  isAuthenticated: boolean
  isLoading: boolean
  tenantSlug: string | null
}

// Define auth context type
type AuthContextType = {
  user: LMSUser | null
  isAuthenticated: boolean
  isLoading: boolean
  tenantSlug: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    tenantSlug: null
  })
  
  const [hasInitialized, setHasInitialized] = useState(false)
  const router = useRouter()
  
  // Extract tenant from hostname and check authentication status
  useEffect(() => {
    async function initAuth() {
      if (hasInitialized) {
        console.log('AUTH DEBUG - Already initialized, skipping...')
        return
      }
      
      console.log('AUTH DEBUG - Starting initAuth...')
      setHasInitialized(true)
      
      if (typeof window !== 'undefined') {
        // Extract tenant from hostname
        const hostname = window.location.hostname
        let tenant = null
        
        console.log('AUTH DEBUG - Hostname:', hostname)
        
        // Extract tenant from subdomain
        if (hostname !== 'localhost') {
          const parts = hostname.split('.')
          if (parts.length > 1) {
            tenant = parts[0]
          }
        }
        
        console.log('AUTH DEBUG - Extracted tenant:', tenant)
        
        // Check for current authentication using Payload API
        try {
          console.log('AUTH DEBUG - Calling getCurrentUser...')
          const userData = await getCurrentUser()
          console.log('AUTH DEBUG - getCurrentUser result:', userData)
          
          setAuthState({
            user: userData,
            isAuthenticated: !!userData,
            isLoading: false,
            tenantSlug: tenant
          })
          
          console.log('AUTH DEBUG - Auth state updated:', {
            user: userData,
            isAuthenticated: !!userData,
            isLoading: false,
            tenantSlug: tenant
          })
        } catch (e) {
          console.error('AUTH DEBUG - Failed to get current user:', e)
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            tenantSlug: tenant
          })
        }
      }
    }
    
    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await loginUser(email, password)
      
      if (!userData) {
        return false
      }
      
      // Update auth state with user data
      setAuthState(prev => ({
        ...prev,
        user: userData,
        isAuthenticated: true
      }))
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Clear user from state regardless of API success
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false
      }))
      
      // Redirect to login page
      router.push('/login')
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Call the Payload API to register a new user
      const success = await registerUser(email, password, name)
      
      if (success) {
        // If registration is successful, try to log in automatically
        const userData = await loginUser(email, password)
        
        if (userData) {
          // Update auth state with user data
          setAuthState(prev => ({
            ...prev,
            user: userData,
            isAuthenticated: true
          }))
        }
      }
      
      return success
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  // Provide auth context to children
  const contextValue = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    tenantSlug: authState.tenantSlug,
    login,
    logout,
    register
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requiredRole?: string
}

export const AuthGuard: React.FC<{ 
  children: ReactNode;
  requiredRole?: string;
}> = ({ 
  children,
  requiredRole = 'regular' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  
  // Role hierarchy for permission checks
  const roleHierarchy: Record<string, number> = { regular: 1, business: 2, admin: 3, 'super-admin': 4 }
  
  // Debug: Log user info
  useEffect(() => {
    console.log('AUTH DEBUG - AuthGuard check:')
    console.log('  - isLoading:', isLoading)
    console.log('  - isAuthenticated:', isAuthenticated)
    console.log('  - user:', user)
    console.log('  - user.roles:', user?.roles)
    console.log('  - requiredRole:', requiredRole)
    console.log('  - hasRequiredRole result:', user ? hasRequiredRole() : 'no user')
    if (user?.roles) {
      console.log('  - Is super-admin?', user.roles.includes('super-admin'))
      console.log('  - Role hierarchy check:')
      user.roles.forEach(role => {
        const level = roleHierarchy[role]
        console.log(`    - ${role}: level ${level || 'unknown'}`)
      })
    }
  }, [user, requiredRole, isLoading, isAuthenticated])
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the current path to redirect back after login
      if (pathname !== '/login' && pathname !== '/register') {
        sessionStorage.setItem('redirectAfterLogin', pathname)
      }
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, pathname, router])
  
  // Check if user has required role or higher
  const hasRequiredRole = React.useCallback(() => {
    console.log('AUTH DEBUG - hasRequiredRole called with:', { user, requiredRole })
    
    if (!user || !user.roles || user.roles.length === 0) {
      console.log('AUTH DEBUG - No user or roles, denying access')
      return false
    }
    
    // Super-admin always has access to everything
    if (user.roles.includes('super-admin')) {
      console.log('AUTH DEBUG - User is super-admin, granting access')
      return true
    }
    
    const requiredRoleLevel = roleHierarchy[requiredRole] || 1
    console.log('AUTH DEBUG - Required role level:', requiredRoleLevel)
    
    // Check if the user has any role that meets or exceeds the required level
    const hasAccess = user.roles.some(role => {
      // Make sure the role exists in our hierarchy
      if (!(role in roleHierarchy)) {
        console.log(`AUTH DEBUG - Role '${role}' not in hierarchy`)
        return false
      }
      
      const userRoleLevel = roleHierarchy[role]
      const hasRoleAccess = userRoleLevel >= requiredRoleLevel
      console.log(`AUTH DEBUG - Role '${role}' level ${userRoleLevel} >= ${requiredRoleLevel}? ${hasRoleAccess}`)
      return hasRoleAccess
    })
    
    console.log('AUTH DEBUG - Final access decision:', hasAccess)
    return hasAccess
  }, [user, requiredRole, roleHierarchy])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">
            Please log in to access this content and continue your learning journey.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline" className="border-teal text-teal hover:bg-teal/10">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-teal hover:bg-teal/90 text-black">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (requiredRole && !hasRequiredRole()) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upgrade Required</h2>
          <p className="text-gray-300 mb-6">
            This content requires a {requiredRole} membership or higher. 
            Upgrade your account to access premium training materials.
          </p>
          <Button asChild className="bg-teal hover:bg-teal/90 text-black">
            <Link href="/upgrade">Upgrade Now</Link>
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
