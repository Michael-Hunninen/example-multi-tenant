import { Access } from 'payload'

// Check if the user has admin access
export const isAdmin: Access = ({ req: { user } }) => {
  // If no user, deny access
  if (!user) return false

  // Grant access to any user with admin role or super-admin
  if (user?.roles?.includes('admin') || user?.roles?.includes('super-admin')) return true

  // Check if user has admin role in any tenant
  if (user?.tenants?.some(tenant => tenant?.roles?.includes('tenant-admin'))) return true

  // Otherwise deny access
  return false
}
