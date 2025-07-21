import type { User, Tenant } from '@/payload-types'

export interface TenantUserAssociation {
  tenant: string // Tenant ID
  roles: string[]
  password?: string // Optional separate password for this tenant
  createdAt: string
  lastLoginAt?: string
}

export interface EnhancedLMSUser {
  id: string
  email: string
  name?: string
  globalRoles: string[] // Global roles across all tenants
  tenantAssociations: TenantUserAssociation[]
  currentTenant?: string // Currently active tenant context
}

/**
 * Determine which tenant to assign a new user to based on current context
 * Falls back to Agency Owner tenant if no specific tenant can be determined
 * CLIENT-SAFE VERSION - uses API calls instead of direct server utilities
 */
export async function determineTenantForRegistration(): Promise<string | null> {
  try {
    // Extract tenant from current hostname for tenant-specific registration
    let hostname = 'localhost:3000'
    if (typeof window !== 'undefined') {
      hostname = window.location.hostname
      console.log('TENANT UTIL DEBUG - Registration hostname:', hostname)
    }
    
    // Make API call to get tenant by domain (client-safe)
    const domainResponse = await fetch(`/api/domain-info?domain=${encodeURIComponent(hostname)}`)
    if (domainResponse.ok) {
      const domainData = await domainResponse.json()
      if (domainData.tenant && domainData.tenant.id) {
        console.log('TENANT UTIL DEBUG - Found tenant for registration:', domainData.tenant.id)
        return domainData.tenant.id
      }
    }
    
    // Fallback: find Agency Owner tenant via API
    console.log('TENANT UTIL DEBUG - No tenant found, looking for Agency Owner')
    
    const response = await fetch('/api/tenants?where[isAgencyOwner][equals]=true&limit=1')
    if (response.ok) {
      const data = await response.json()
      if (data.docs && data.docs.length > 0) {
        console.log('TENANT UTIL DEBUG - Found Agency Owner tenant:', data.docs[0].id)
        return data.docs[0].id
      }
    }
    
    console.log('TENANT UTIL DEBUG - No Agency Owner tenant found')
    return null
  } catch (error) {
    console.error('TENANT UTIL DEBUG - Error determining tenant for registration:', error)
    return null
  }
}

/**
 * Check if a user has access to a specific tenant
 */
export function userHasTenantAccess(user: any, tenantId: string): boolean {
  if (!user?.tenants || !Array.isArray(user.tenants)) {
    return false
  }
  
  return user.tenants.some((association: any) => 
    association.tenant === tenantId || association.tenant?.id === tenantId
  )
}

/**
 * Get user's role within a specific tenant
 */
export function getUserTenantRoles(user: any, tenantId: string): string[] {
  if (!user?.tenants || !Array.isArray(user.tenants)) {
    return []
  }
  
  const association = user.tenants.find((assoc: any) => 
    assoc.tenant === tenantId || assoc.tenant?.id === tenantId
  )
  
  return association?.roles || []
}

/**
 * Create a new tenant association for an existing user
 * This allows users to "create an account" with a new tenant
 */
export async function createTenantAssociationForUser(
  userId: string,
  tenantId: string,
  roles: string[] = ['tenant-viewer'],
  password?: string
): Promise<boolean> {
  try {
    // First, get the current user data
    const userResponse = await fetch(`/api/users/${userId}`)
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data')
    }
    
    const userData = await userResponse.json()
    
    // Check if user already has access to this tenant
    if (userHasTenantAccess(userData, tenantId)) {
      console.log('TENANT USER DEBUG - User already has access to tenant:', { userId, tenantId })
      return true
    }
    
    // Add new tenant association
    const updatedTenants = [
      ...(userData.tenants || []),
      {
        tenant: tenantId,
        roles: roles
      }
    ]
    
    // Update user with new tenant association
    const updateResponse = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenants: updatedTenants,
        // If a separate password is provided, we'd need to handle this differently
        // For now, we'll use the same password but this could be enhanced
      }),
    })
    
    if (!updateResponse.ok) {
      throw new Error('Failed to update user tenant associations')
    }
    
    console.log('TENANT USER DEBUG - Successfully created tenant association:', { userId, tenantId, roles })
    return true
  } catch (error) {
    console.error('TENANT USER DEBUG - Error creating tenant association:', error)
    return false
  }
}

/**
 * Register a new user with automatic tenant assignment
 */
export async function registerUserWithTenant(
  email: string,
  password: string,
  name?: string,
  tenantId?: string
): Promise<{ success: boolean; userId?: string; tenantId?: string }> {
  try {
    console.log('TENANT USER DEBUG - Starting tenant-aware registration:', { email, name, tenantId })
    
    // Determine tenant if not provided
    const finalTenantId = tenantId || await determineTenantForRegistration()
    
    if (!finalTenantId) {
      throw new Error('Could not determine tenant for registration')
    }
    
    // Check if user already exists
    const existingUserResponse = await fetch(`/api/users?where[email][equals]=${encodeURIComponent(email)}&limit=1`)
    if (existingUserResponse.ok) {
      const existingUserData = await existingUserResponse.json()
      
      if (existingUserData.docs && existingUserData.docs.length > 0) {
        const existingUser = existingUserData.docs[0]
        
        // User exists - check if they have access to this tenant
        if (userHasTenantAccess(existingUser, finalTenantId)) {
          console.log('TENANT USER DEBUG - User already exists and has access to tenant')
          return { success: false } // User already has account with this tenant
        } else {
          // User exists but doesn't have access to this tenant
          // Create tenant association (this is the "create account with tenant" flow)
          const associationCreated = await createTenantAssociationForUser(
            existingUser.id,
            finalTenantId,
            ['tenant-viewer'],
            password // Could be different password per tenant
          )
          
          if (associationCreated) {
            console.log('TENANT USER DEBUG - Created new tenant association for existing user')
            return { success: true, userId: existingUser.id, tenantId: finalTenantId }
          } else {
            throw new Error('Failed to create tenant association')
          }
        }
      }
    }
    
    // User doesn't exist - create new user with tenant association
    const userData = {
      email,
      password,
      username: name,
      roles: ['regular'], // Global roles
      tenants: [{
        tenant: finalTenantId,
        roles: ['tenant-viewer'] // Tenant-specific roles
      }]
    }
    
    console.log('TENANT USER DEBUG - Creating new user with tenant association:', userData)
    
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Registration failed: ${response.status} - ${errorData}`)
    }
    
    const responseData = await response.json()
    console.log('TENANT USER DEBUG - Successfully created new user:', responseData)
    
    return { success: true, userId: responseData.doc?.id, tenantId: finalTenantId }
  } catch (error) {
    console.error('TENANT USER DEBUG - Registration error:', error)
    return { success: false }
  }
}

/**
 * Validate if a user has access to the current tenant context
 * Returns tenant info if user has access, null otherwise
 * CLIENT-SAFE VERSION - uses API calls instead of direct server utilities
 */
export async function validateUserTenantAccess(user: User): Promise<{
  hasAccess: boolean
  tenantId?: string
  tenant?: Tenant
}> {
  try {
    // Get current tenant context via API
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost:3000'
    
    const domainResponse = await fetch(`/api/domain-info?domain=${encodeURIComponent(hostname)}`)
    if (!domainResponse.ok) {
      console.log('TENANT UTIL DEBUG - Failed to get domain info for validation')
      return { hasAccess: false }
    }
    
    const domainData = await domainResponse.json()
    const currentTenant = domainData.tenant
    
    if (!currentTenant) {
      console.log('TENANT UTIL DEBUG - No current tenant found for validation')
      return { hasAccess: false }
    }
    
    // Check if user has access to this tenant
    const hasAccess = userHasTenantAccess(user, currentTenant.id)
    
    return {
      hasAccess,
      tenantId: hasAccess ? currentTenant.id : undefined,
      tenant: hasAccess ? currentTenant : undefined
    }
  } catch (error) {
    console.error('TENANT UTIL DEBUG - Error validating user tenant access:', error)
    return { hasAccess: false }
  }
}
