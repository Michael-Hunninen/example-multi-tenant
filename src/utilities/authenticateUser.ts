import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export interface AuthenticatedUser {
  id: string
  email: string
  username?: string
  roles: string[]
  tenants: any[]
  [key: string]: any
}

/**
 * Authenticates a user from the payload-token cookie
 * Returns the actual authenticated user, not just any user for the tenant
 */
export async function authenticateUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const payload = await getPayload({ config })
    
    // Get the payload token from cookies
    const payloadToken = request.cookies.get('payload-token')?.value
    
    if (!payloadToken) {
      console.log('AUTHENTICATE USER - No payload token found')
      return null
    }
    
    console.log('AUTHENTICATE USER - Token found, validating...')
    
    // Use Payload's built-in authentication to validate the token and get the user
    try {
      // Create a mock request object for Payload authentication
      const mockReq = {
        headers: {
          authorization: `JWT ${payloadToken}`
        }
      }
      
      console.log('AUTHENTICATE USER - Validating token with Payload...')
      
      // Try to find users and validate token by checking sessions
      const allUsers = await payload.find({
        collection: 'users',
        where: {
          'sessions.token': {
            equals: payloadToken
          }
        },
        depth: 2
      })
      
      console.log('AUTHENTICATE USER - Found', allUsers.docs.length, 'users with this token')
      
      if (allUsers.docs.length === 0) {
        console.log('AUTHENTICATE USER - No user found with this token')
        return null
      }
      
      // Find the user with an active session matching this token
      const user = allUsers.docs.find(u => {
        return u.sessions?.some((session: any) => session.id === payloadToken)
      })
      
      if (!user) {
        console.log('AUTHENTICATE USER - No user with active session found')
        return null
      }
      
      console.log('AUTHENTICATE USER - Found user with active session:', user.id, user.email)
      return user as AuthenticatedUser
      
    } catch (payloadAuthError) {
      console.error('AUTHENTICATE USER - Payload auth error:', payloadAuthError)
      
      // Fallback: try to decode the token manually (basic base64 decode)
      try {
        console.log('AUTHENTICATE USER - Attempting manual token decode...')
        const tokenParts = payloadToken.split('.')
        if (tokenParts.length !== 3) {
          console.log('AUTHENTICATE USER - Invalid JWT format')
          return null
        }
        
        const payload_decoded = JSON.parse(atob(tokenParts[1]))
        console.log('AUTHENTICATE USER - Decoded payload:', payload_decoded)
        
        if (!payload_decoded.id) {
          console.log('AUTHENTICATE USER - No user ID in token')
          return null
        }
        
        const user = await payload.findByID({
          collection: 'users',
          id: payload_decoded.id,
          depth: 2
        })
        
        if (!user) {
          console.log('AUTHENTICATE USER - User not found for ID:', payload_decoded.id)
          return null
        }
        
        console.log('AUTHENTICATE USER - Successfully authenticated user:', user.id, user.email)
        return user as AuthenticatedUser
        
      } catch (manualDecodeError) {
        console.error('AUTHENTICATE USER - Manual decode error:', manualDecodeError)
        return null
      }
    }
    
  } catch (error) {
    console.error('AUTHENTICATE USER - Authentication error:', error)
    return null
  }
}

/**
 * Checks if the authenticated user has access to a specific tenant
 */
export function userHasTenantAccess(user: AuthenticatedUser, tenantId: string): boolean {
  if (!user.tenants || !Array.isArray(user.tenants)) {
    return false
  }
  
  return user.tenants.some(tenantRel => {
    const tenantIdToCheck = typeof tenantRel.tenant === 'object' ? tenantRel.tenant.id : tenantRel.tenant
    return tenantIdToCheck === tenantId
  })
}
