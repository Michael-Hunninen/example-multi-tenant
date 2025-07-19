import type { Access } from 'payload'
import { isSuperAdmin } from './isSuperAdmin'
import { getUserTenantIDs } from '../utilities/getUserTenantIDs'

/**
 * Access control that ensures users can only access content from their assigned tenants
 * This works in conjunction with the multi-tenant plugin
 */
export const tenantAwareAccess: Access = ({ req: { user } }) => {
  // Super admins can access all content
  if (isSuperAdmin(user)) {
    return true
  }

  // If no user, only allow access to published documents
  if (!user) {
    return {
      _status: {
        equals: 'published',
      },
    }
  }

  // Get the user's tenant IDs
  const userTenantIDs = getUserTenantIDs(user)
  
  // If user has no tenant associations, deny access
  if (userTenantIDs.length === 0) {
    return false
  }

  // Allow access to documents from user's tenants
  // The multi-tenant plugin will automatically filter by tenant field
  return true
}

/**
 * Access control for authenticated users with tenant filtering
 */
export const authenticatedTenantAccess: Access = ({ req: { user } }) => {
  // Super admins can access all content
  if (isSuperAdmin(user)) {
    return true
  }

  // Must be authenticated
  if (!user) {
    return false
  }

  // Get the user's tenant IDs
  const userTenantIDs = getUserTenantIDs(user)
  
  // If user has no tenant associations, deny access
  if (userTenantIDs.length === 0) {
    return false
  }

  // Allow access - multi-tenant plugin will handle tenant filtering
  return true
}

/**
 * Access control for public content with tenant filtering
 */
export const publicTenantAccess: Access = ({ req: { user } }) => {
  // Super admins can access all content
  if (isSuperAdmin(user)) {
    return true
  }

  // For public access, only show published content
  // The multi-tenant plugin should still filter by current tenant context
  return {
    _status: {
      equals: 'published',
    },
  }
}
