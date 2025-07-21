import type { User, Tenant } from '@/payload-types'
import { getTenantByDomain } from './getTenantByDomain'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export interface TenantUserAssociation {
  tenant: string // Tenant ID
  roles: string[] // Roles within this tenant
  credentials?: {
    passwordHash?: string // Optional separate password for this tenant
  }
}

export interface RegisterUserResult {
  success: boolean
  message: string
  userId?: string
  tenantId?: string
  userAlreadyExists?: boolean
}

/**
 * SERVER-SIDE: Determine which tenant to assign a new user to based on current context
 * Falls back to Agency Owner tenant if no specific tenant can be determined
 */
export async function determineTenantForRegistration(): Promise<string | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // For server-side, we'll default to Agency Owner tenant
    // In a real implementation, you might get this from request headers or context
    const result = await payload.find({
      collection: 'tenants',
      limit: 1,
      where: {
        isAgencyOwner: {
          equals: true,
        },
      },
    })

    if (result.docs && result.docs.length > 0) {
      console.log('TENANT UTIL SERVER DEBUG - Found Agency Owner tenant:', result.docs[0].id)
      return result.docs[0].id
    }
    
    console.log('TENANT UTIL SERVER DEBUG - No Agency Owner tenant found')
    return null
  } catch (error) {
    console.error('TENANT UTIL SERVER DEBUG - Error determining tenant for registration:', error)
    return null
  }
}

/**
 * SERVER-SIDE: Check if a user has access to a specific tenant
 */
export function userHasTenantAccess(user: User, tenantId: string): boolean {
  if (!user.tenants || !Array.isArray(user.tenants)) {
    return false
  }

  return user.tenants.some((association: any) => {
    // Handle both string IDs and populated objects
    const associationTenantId = typeof association.tenant === 'string' 
      ? association.tenant 
      : association.tenant?.id

    return associationTenantId === tenantId
  })
}

/**
 * SERVER-SIDE: Get user's roles within a specific tenant
 */
export function getUserTenantRoles(user: User, tenantId: string): string[] {
  if (!user.tenants || !Array.isArray(user.tenants)) {
    return []
  }

  const association = user.tenants.find((assoc: any) => {
    const associationTenantId = typeof assoc.tenant === 'string' 
      ? assoc.tenant 
      : assoc.tenant?.id
    return associationTenantId === tenantId
  })

  return association?.roles || []
}

/**
 * SERVER-SIDE: Register a new user with automatic tenant assignment
 */
export async function registerUserWithTenant(
  email: string,
  password: string,
  name?: string
): Promise<RegisterUserResult> {
  try {
    const payload = await getPayload({ config: configPromise })
    
    console.log('TENANT UTIL SERVER DEBUG - Starting registration for:', email)
    
    // Check if user already exists
    const existingUserResult = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    // Determine tenant for registration
    const tenantId = await determineTenantForRegistration()
    
    if (!tenantId) {
      return {
        success: false,
        message: 'Could not determine tenant for registration'
      }
    }

    if (existingUserResult.docs && existingUserResult.docs.length > 0) {
      const existingUser = existingUserResult.docs[0]
      
      // Check if user already has access to this tenant
      if (userHasTenantAccess(existingUser, tenantId)) {
        return {
          success: false,
          message: 'User already has access to this tenant',
          userAlreadyExists: true,
          userId: existingUser.id,
          tenantId
        }
      }
      
      // User exists but doesn't have access to this tenant
      // This should be handled by the create-tenant-account endpoint
      return {
        success: false,
        message: 'User exists but needs to create account for this tenant',
        userAlreadyExists: true,
        userId: existingUser.id
      }
    }

    // Create new user with tenant association
    const userData = {
      email,
      password,
      username: name,
      roles: ['regular' as const], // Default global role
      tenants: [{
        tenant: tenantId,
        roles: ['tenant-viewer' as const] // Default tenant role
      }]
    }
    
    console.log('TENANT UTIL SERVER DEBUG - Creating user with data:', {
      email,
      tenantId,
      roles: userData.roles,
      tenantRoles: userData.tenants[0].roles
    })

    const newUser = await payload.create({
      collection: 'users',
      data: userData,
    })
    
    console.log('TENANT UTIL SERVER DEBUG - User created successfully:', newUser.id)

    return {
      success: true,
      message: 'User registered successfully',
      userId: newUser.id,
      tenantId
    }
  } catch (error) {
    console.error('TENANT UTIL SERVER DEBUG - Registration error:', error)
    return {
      success: false,
      message: 'Registration failed due to server error'
    }
  }
}

/**
 * SERVER-SIDE: Create a tenant association for an existing user
 */
export async function createTenantAssociationForUser(
  userId: string,
  tenantId: string,
  roles: ('tenant-viewer' | 'tenant-admin')[] = ['tenant-viewer'],
  password?: string
): Promise<boolean> {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Get the existing user
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    if (!user) {
      console.error('TENANT UTIL SERVER DEBUG - User not found:', userId)
      return false
    }

    // Check if user already has access to this tenant
    if (userHasTenantAccess(user, tenantId)) {
      console.log('TENANT UTIL SERVER DEBUG - User already has access to tenant')
      return true
    }

    // Add new tenant association
    const existingTenants = user.tenants || []
    const newTenantAssociation = {
      tenant: tenantId,
      roles: roles as ('tenant-viewer' | 'tenant-admin')[]
    }

    const updatedUser = await payload.update({
      collection: 'users',
      id: userId,
      data: {
        tenants: [...existingTenants, newTenantAssociation]
      },
    })

    console.log('TENANT UTIL SERVER DEBUG - Tenant association created successfully')
    return true
  } catch (error) {
    console.error('TENANT UTIL SERVER DEBUG - Error creating tenant association:', error)
    return false
  }
}

/**
 * SERVER-SIDE: Validate if a user has access to the current tenant context
 */
export async function validateUserTenantAccess(
  user: User,
  hostname?: string
): Promise<{
  hasAccess: boolean
  tenantId?: string
  tenant?: Tenant
}> {
  try {
    // Get current tenant context
    const currentHostname = hostname || 'localhost:3000'
    const currentTenant = await getTenantByDomain(currentHostname)
    
    if (!currentTenant) {
      console.log('TENANT UTIL SERVER DEBUG - No current tenant found for validation')
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
    console.error('TENANT UTIL SERVER DEBUG - Error validating user tenant access:', error)
    return { hasAccess: false }
  }
}
