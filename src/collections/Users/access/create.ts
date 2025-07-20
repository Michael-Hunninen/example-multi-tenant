import type { Access } from 'payload'

import type { Tenant, User } from '../../../payload-types'

import { isSuperAdmin } from '../../../access/isSuperAdmin'
import { getUserTenantIDs } from '../../../utilities/getUserTenantIDs'

export const createAccess: Access<User> = ({ req }) => {
  // Allow public registration for regular users (no authentication required)
  if (!req.user) {
    // Check if this is a registration request for a regular user
    const isRegularUserRegistration = req.data?.roles?.length === 1 && req.data?.roles?.includes('regular')
    
    if (isRegularUserRegistration) {
      console.log('CREATE ACCESS DEBUG - Allowing public registration for regular user')
      return true
    }
    
    console.log('CREATE ACCESS DEBUG - No user and not regular registration, denying access')
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  if (!isSuperAdmin(req.user) && req.data?.roles?.includes('super-admin')) {
    return false
  }

  const adminTenantAccessIDs = getUserTenantIDs(req.user, 'tenant-admin')

  const requestedTenants: Tenant['id'][] =
    req.data?.tenants?.map((t: { tenant: Tenant['id'] }) => t.tenant) ?? []

  const hasAccessToAllRequestedTenants = requestedTenants.every((tenantID) =>
    adminTenantAccessIDs.includes(tenantID),
  )

  if (hasAccessToAllRequestedTenants) {
    return true
  }

  return false
}
