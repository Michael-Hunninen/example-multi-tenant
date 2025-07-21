import type { User } from '../payload-types'

// Define the LMS user type derived from Payload User
export type LMSUser = {
  id: string
  email: string
  roles: string[]
  name?: string
  tenantId?: string // Current tenant context
  tenantRoles?: string[] // Roles within current tenant
}

// Function to log in a user via Payload's API with tenant access validation
export async function loginUser(email: string, password: string): Promise<LMSUser | null> {
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Important: This makes cookies work
    })

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`)
    }

    const result = await response.json()
    console.log('AUTH UTIL DEBUG - Login response:', result)
    
    // Extract user data from the response
    const userData = result.user
    if (!userData) {
      console.log('AUTH UTIL DEBUG - No user data in login response')
      return null
    }
    
    // STRICT tenant access validation - user must have explicit access to current tenant
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost:3000'
    console.log('AUTH UTIL DEBUG - Validating access for hostname:', hostname)
    
    // Check if user is super-admin (can access all tenants)
    const isSuperAdmin = userData.roles && userData.roles.includes('super-admin')
    console.log('AUTH UTIL DEBUG - User is super-admin:', isSuperAdmin)
    
    if (isSuperAdmin) {
      // Super-admins can access any tenant - get tenant info but don't restrict access
      const domainResponse = await fetch(`/api/domain-info?domain=${encodeURIComponent(hostname)}`)
      let tenantId: string | undefined
      let tenantRoles: string[] = ['super-admin'] // Super-admin role in tenant context
      
      if (domainResponse.ok) {
        const domainData = await domainResponse.json()
        tenantId = domainData.tenant?.id
      }
      
      console.log('AUTH UTIL DEBUG - Super-admin access granted for tenant:', tenantId)
      
      // Format the user data for super-admin
      const lmsUser: LMSUser = {
        id: userData.id,
        email: userData.email,
        roles: userData.roles || [],
        name: userData.username || email.split('@')[0],
        tenantId: tenantId,
        tenantRoles: tenantRoles
      }
      
      console.log('AUTH UTIL DEBUG - Super-admin login successful:', lmsUser)
      return lmsUser
    }
    
    // For non-super-admin users, enforce strict tenant access
    const domainResponse = await fetch(`/api/domain-info?domain=${encodeURIComponent(hostname)}`)
    
    if (!domainResponse.ok) {
      console.log('AUTH UTIL DEBUG - Failed to get domain info - login denied')
      return null
    }
    
    const domainData = await domainResponse.json()
    const currentTenant = domainData.tenant
    
    if (!currentTenant) {
      console.log('AUTH UTIL DEBUG - No tenant found for domain - login denied')
      return null
    }
    
    console.log('AUTH UTIL DEBUG - Current tenant:', currentTenant.id, currentTenant.name)
    console.log('AUTH UTIL DEBUG - User tenants (raw):', JSON.stringify(userData.tenants, null, 2))
    console.log('AUTH UTIL DEBUG - User tenants length:', userData.tenants?.length)
    console.log('AUTH UTIL DEBUG - User tenants array check:', Array.isArray(userData.tenants))
    
    // Check if user has explicit access to this specific tenant
    console.log('AUTH UTIL DEBUG - Starting tenant access check...')
    
    let hasAccess = false
    
    if (!userData.tenants) {
      console.log('AUTH UTIL DEBUG - No tenants array found on user')
      hasAccess = false
    } else if (!Array.isArray(userData.tenants)) {
      console.log('AUTH UTIL DEBUG - Tenants is not an array:', typeof userData.tenants)
      hasAccess = false
    } else {
      console.log('AUTH UTIL DEBUG - Found tenants array with', userData.tenants.length, 'items')
      
      hasAccess = userData.tenants.some((t: any, index: number) => {
        console.log(`AUTH UTIL DEBUG - Checking tenant ${index}:`, JSON.stringify(t, null, 2))
        
        const tenantId = typeof t.tenant === 'string' ? t.tenant : t.tenant?.id
        const matches = tenantId === currentTenant.id
        
        console.log('AUTH UTIL DEBUG - Tenant comparison:', {
          index,
          tenantAssociation: t,
          extractedTenantId: tenantId,
          currentTenantId: currentTenant.id,
          tenantIdType: typeof tenantId,
          currentTenantIdType: typeof currentTenant.id,
          strictEqual: tenantId === currentTenant.id,
          looseEqual: tenantId == currentTenant.id,
          matches
        })
        
        return matches
      })
    }
    
    console.log('AUTH UTIL DEBUG - Final access result:', hasAccess)
    
    if (!hasAccess) {
      console.log('AUTH UTIL DEBUG - User does not have access to current tenant - login denied')
      console.log('AUTH UTIL DEBUG - User must create account for this tenant')
      console.log('AUTH UTIL DEBUG - Summary:', {
        userEmail: userData.email,
        currentTenantId: currentTenant.id,
        currentTenantName: currentTenant.name,
        userTenantCount: userData.tenants?.length || 0,
        userTenants: userData.tenants?.map((t: any) => ({
          tenantId: typeof t.tenant === 'string' ? t.tenant : t.tenant?.id,
          roles: t.roles
        }))
      })
      return null
    }
    
    // Get user's roles within the current tenant
    const tenantAssociation = userData.tenants?.find((t: any) => {
      const tenantId = typeof t.tenant === 'string' ? t.tenant : t.tenant?.id
      return tenantId === currentTenant.id
    })
    
    const tenantRoles = tenantAssociation?.roles || []
    const tenantId = currentTenant.id
    
    console.log('AUTH UTIL DEBUG - Tenant access granted:', { tenantId, tenantRoles })
    
    // Format the user data to match our enhanced LMS user structure
    const lmsUser: LMSUser = {
      id: userData.id,
      email: userData.email,
      roles: userData.roles || [], // Global roles
      name: userData.username || email.split('@')[0],
      tenantId: tenantId,
      tenantRoles: tenantRoles
    }
    
    console.log('AUTH UTIL DEBUG - Regular user login successful with tenant context:', lmsUser)
    
    return lmsUser
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

// Function to register a new user via API (client-safe)
export async function registerUser(
  email: string, 
  password: string, 
  name?: string
): Promise<boolean> {
  try {
    console.log('AUTH UTIL DEBUG - Starting client-safe tenant-aware registration for:', email)
    
    // Use the enhanced tenant-aware registration API endpoint
    const response = await fetch('/api/users/register-with-tenant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('AUTH UTIL DEBUG - Registration successful:', result)
      return true
    } else {
      const errorData = await response.json()
      console.log('AUTH UTIL DEBUG - Registration failed:', errorData)
      return false
    }
  } catch (error) {
    console.error('AUTH UTIL DEBUG - Registration error:', error)
    return false
  }
}

// Function to get the currently logged-in user
export async function getCurrentUser(): Promise<LMSUser | null> {
  try {
    console.log('AUTH UTIL DEBUG - Making request to /api/users/me')
    const response = await fetch('/api/users/me', {
      credentials: 'include', // Important: This makes cookies work
    })

    console.log('AUTH UTIL DEBUG - Response status:', response.status)
    console.log('AUTH UTIL DEBUG - Response ok:', response.ok)

    if (!response.ok) {
      if (response.status === 401) {
        // Not authenticated, not an error
        console.log('AUTH UTIL DEBUG - User not authenticated (401)')
        return null
      }
      throw new Error(`Failed to get current user: ${response.status}`)
    }

    const responseData = await response.json()
    console.log('AUTH UTIL DEBUG - Raw response data from API:', responseData)
    
    // Extract user data from the response (it's nested in a 'user' property)
    const userData = responseData.user
    console.log('AUTH UTIL DEBUG - Extracted user data:', userData)
    
    if (!userData) {
      console.log('AUTH UTIL DEBUG - No user data in response')
      return null
    }
    
    // Check if user has tenant access (similar to login validation)
    const hostname = window.location.hostname
    console.log('AUTH UTIL DEBUG - getCurrentUser hostname:', hostname)
    
    // Get domain info to determine current tenant
    const domainResponse = await fetch(`/api/domain-info?domain=${encodeURIComponent(hostname)}`)
    if (!domainResponse.ok) {
      console.log('AUTH UTIL DEBUG - Failed to get domain info in getCurrentUser')
      return null
    }
    
    const domainData = await domainResponse.json()
    const currentTenant = domainData.tenant
    console.log('AUTH UTIL DEBUG - getCurrentUser current tenant:', currentTenant?.id, currentTenant?.name)
    
    // Check if user is super-admin (bypass tenant validation)
    const isSuperAdmin = userData.roles?.includes('super-admin')
    console.log('AUTH UTIL DEBUG - getCurrentUser user is super-admin:', isSuperAdmin)
    
    if (isSuperAdmin) {
      // Super-admin can access any tenant
      const lmsUser: LMSUser = {
        id: userData.id,
        email: userData.email,
        roles: userData.roles || [],
        name: userData.username || userData.email?.split('@')[0],
        tenantId: currentTenant?.id,
        tenantRoles: ['super-admin'],
      }
      console.log('AUTH UTIL DEBUG - Super-admin getCurrentUser result:', lmsUser)
      return lmsUser
    }
    
    // For regular users, validate tenant access
    if (!userData.tenants || !Array.isArray(userData.tenants)) {
      console.log('AUTH UTIL DEBUG - getCurrentUser: No tenants array found')
      return null
    }
    
    // Find matching tenant association
    let userTenantRoles: string[] = []
    let hasAccess = false
    
    for (const tenantAssoc of userData.tenants) {
      const tenantId = typeof tenantAssoc.tenant === 'string' ? tenantAssoc.tenant : tenantAssoc.tenant?.id
      console.log('AUTH UTIL DEBUG - getCurrentUser checking tenant:', tenantId, 'vs current:', currentTenant?.id)
      
      if (tenantId === currentTenant?.id) {
        hasAccess = true
        userTenantRoles = tenantAssoc.roles || []
        console.log('AUTH UTIL DEBUG - getCurrentUser: Found matching tenant with roles:', userTenantRoles)
        break
      }
    }
    
    if (!hasAccess) {
      console.log('AUTH UTIL DEBUG - getCurrentUser: User does not have access to current tenant')
      return null
    }
    
    // Format the user data with tenant context
    const lmsUser: LMSUser = {
      id: userData.id,
      email: userData.email,
      roles: userData.roles || [],
      name: userData.username || userData.email?.split('@')[0],
      tenantId: currentTenant?.id,
      tenantRoles: userTenantRoles,
    }
    
    console.log('AUTH UTIL DEBUG - getCurrentUser final result:', lmsUser)
    return lmsUser
  } catch (error) {
    console.error('AUTH UTIL DEBUG - Get current user error:', error)
    return null
  }
}

// Function to log out the current user
export async function logoutUser(): Promise<boolean> {
  try {
    const response = await fetch('/api/users/logout', {
      method: 'POST',
      credentials: 'include', // Important: This makes cookies work
    })

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Logout error:', error)
    return false
  }
}

// Helper function to check if user has access to LMS
export function hasLMSAccess(user: LMSUser | null): boolean {
  if (!user || !user.roles) return false
  
  // All user types have access to LMS
  return user.roles.some(role => 
    ['regular', 'business', 'admin', 'super-admin'].includes(role)
  )
}

// Helper function to check if user has access to business features
export function hasBusinessAccess(user: LMSUser | null): boolean {
  if (!user || !user.roles) return false
  
  // Only business, admin, and super-admin roles have business access
  return user.roles.some(role => 
    ['business', 'admin', 'super-admin'].includes(role)
  )
}

// Helper function to check if user has admin access
export function hasAdminAccess(user: LMSUser | null): boolean {
  if (!user || !user.roles) return false
  
  // Only admin and super-admin roles have admin access
  return user.roles.some(role => 
    ['admin', 'super-admin'].includes(role)
  )
}

// Helper function to check if user is super-admin
export function isSuperAdmin(user: LMSUser | null): boolean {
  if (!user || !user.roles) return false
  
  return user.roles.includes('super-admin')
}
