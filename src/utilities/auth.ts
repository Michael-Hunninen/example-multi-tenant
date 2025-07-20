import type { User } from '../payload-types'

// Define the LMS user type derived from Payload User
export type LMSUser = {
  id: string
  email: string
  roles: string[]
  name?: string
}

// Function to log in a user via Payload's API
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
    
    // Format the user data to match our LMS user structure
    const lmsUser: LMSUser = {
      id: userData.id,
      email: userData.email,
      roles: userData.roles || [], // Ensure roles is always an array
      name: userData.username || email.split('@')[0], // Use username if available or fallback to email prefix
    }
    
    console.log('AUTH UTIL DEBUG - Formatted login user:', lmsUser)
    
    return lmsUser
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

// Function to register a new user via Payload's API
export async function registerUser(
  email: string, 
  password: string, 
  name?: string
): Promise<boolean> {
  try {
    console.log('AUTH UTIL DEBUG - Starting registration for:', email)
    
    // Extract tenant from current hostname for tenant-specific registration
    let tenantSlug = null
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      console.log('AUTH UTIL DEBUG - Registration hostname:', hostname)
      
      // Handle both production domains and localhost subdomains
      if (hostname !== 'localhost') {
        const parts = hostname.split('.')
        if (parts.length > 1) {
          // For localhost subdomains like 'location1.localhost', take the first part
          // For production domains like 'tenant.example.com', also take the first part
          tenantSlug = parts[0]
        }
      }
      
      // For development, you might also want to extract from path or other means
      // if not using subdomain approach
    }
    
    console.log('AUTH UTIL DEBUG - Registration tenant slug:', tenantSlug)
    
    // First, we need to get the tenant ID if we have a tenant slug
    let tenantId = null
    if (tenantSlug) {
      try {
        // Query the tenants collection to get the tenant ID by slug
        const tenantResponse = await fetch(`/api/tenants?where[slug][equals]=${tenantSlug}&limit=1`)
        if (tenantResponse.ok) {
          const tenantData = await tenantResponse.json()
          if (tenantData.docs && tenantData.docs.length > 0) {
            tenantId = tenantData.docs[0].id
            console.log('AUTH UTIL DEBUG - Found tenant ID:', tenantId)
          }
        }
      } catch (error) {
        console.error('AUTH UTIL DEBUG - Error fetching tenant:', error)
      }
    }
    
    const userData = {
      email,
      password,
      username: name,
      roles: ['regular'], // Default role for new users
      // Add tenant relationship if we have a tenant ID
      ...(tenantId && {
        tenants: [{
          tenant: tenantId,
          roles: ['tenant-viewer'] // Use tenant-specific role
        }]
      })
    }
    
    console.log('AUTH UTIL DEBUG - Registration payload:', userData)

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    
    console.log('AUTH UTIL DEBUG - Registration response status:', response.status)
    console.log('AUTH UTIL DEBUG - Registration response ok:', response.ok)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('AUTH UTIL DEBUG - Registration error response:', errorData)
      throw new Error(`Registration failed: ${response.status} - ${errorData}`)
    }
    
    const responseData = await response.json()
    console.log('AUTH UTIL DEBUG - Registration success response:', responseData)

    return true
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
    
    // Format the user data to match our LMS user structure
    const lmsUser: LMSUser = {
      id: userData.id,
      email: userData.email,
      roles: userData.roles || [], // Ensure roles is always an array
      name: userData.username || userData.email?.split('@')[0], // Use username if available or fallback to email prefix
    }
    
    console.log('AUTH UTIL DEBUG - Formatted LMS user:', lmsUser)
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
