export type UserRole = 'super-admin' | 'admin' | 'business' | 'regular'
export type UserTier = 'basic' | 'premium' | 'vip' | 'enterprise' // For regular users based on product access levels

export interface UserPermissions {
  canAccessAdmin: boolean
  canAccessPrograms: boolean
  canAccessLiveLessons: boolean
  canAccessVideos: boolean
  canAccessAchievements: boolean
  tier: UserTier | null
}

/**
 * Check if user has specific role
 */
export function hasRole(user: any, role: UserRole): boolean {
  if (!user?.roles) return false
  return user.roles.includes(role)
}

/**
 * Check if user is admin or higher
 */
export function isAdminOrHigher(user: any): boolean {
  return hasRole(user, 'super-admin') || hasRole(user, 'admin')
}

/**
 * Check if user can access admin dashboard
 */
export function canAccessAdmin(user: any): boolean {
  return isAdminOrHigher(user)
}

/**
 * Get user tier based on their active subscriptions and product access levels
 * Returns the highest access level from all active subscriptions
 */
export async function getUserTier(user: any): Promise<UserTier | null> {
  if (!hasRole(user, 'regular')) return null
  
  try {
    // Fetch user's active subscriptions
    const response = await fetch(`/api/lms/user-subscriptions?userId=${user.id}&status=active`)
    if (!response.ok) {
      console.warn('Failed to fetch user subscriptions, defaulting to basic tier')
      return 'basic'
    }
    
    const subscriptions = await response.json()
    
    if (!subscriptions.docs || subscriptions.docs.length === 0) {
      return 'basic' // Default to basic if no active subscriptions
    }
    
    // Get the highest access level from all active subscriptions
    const accessLevels = subscriptions.docs
      .map((sub: any) => sub.product?.accessLevel)
      .filter(Boolean)
      .map((level: string) => level.toLowerCase())
    
    // Priority order: enterprise > vip > premium > basic
    if (accessLevels.includes('enterprise')) return 'enterprise'
    if (accessLevels.includes('vip')) return 'vip'
    if (accessLevels.includes('premium')) return 'premium'
    if (accessLevels.includes('basic')) return 'basic'
    
    return 'basic' // Default fallback
  } catch (error) {
    console.error('Error fetching user tier:', error)
    return 'basic' // Default to basic on error
  }
}

/**
 * Get comprehensive user permissions
 */
export async function getUserPermissions(user: any): Promise<UserPermissions> {
  if (!user) {
    return {
      canAccessAdmin: false,
      canAccessPrograms: false,
      canAccessLiveLessons: false,
      canAccessVideos: false,
      canAccessAchievements: false,
      tier: null
    }
  }

  // Super-admin and Admin have full access
  if (isAdminOrHigher(user)) {
    return {
      canAccessAdmin: true,
      canAccessPrograms: true,
      canAccessLiveLessons: true,
      canAccessVideos: true,
      canAccessAchievements: true,
      tier: null
    }
  }

  // Business users have access to most features
  if (hasRole(user, 'business')) {
    return {
      canAccessAdmin: false,
      canAccessPrograms: true,
      canAccessLiveLessons: true,
      canAccessVideos: true,
      canAccessAchievements: true,
      tier: null
    }
  }

  // Regular users - tier-based permissions
  if (hasRole(user, 'regular')) {
    const tier = await getUserTier(user)
    
    switch (tier) {
      case 'basic':
        return {
          canAccessAdmin: false,
          canAccessPrograms: false, // Locked for basic
          canAccessLiveLessons: false, // Locked for basic
          canAccessVideos: true,
          canAccessAchievements: true,
          tier: 'basic'
        }
      case 'premium':
        return {
          canAccessAdmin: false,
          canAccessPrograms: true,
          canAccessLiveLessons: false, // Still locked for premium
          canAccessVideos: true,
          canAccessAchievements: true,
          tier: 'premium'
        }
      case 'vip':
        return {
          canAccessAdmin: false,
          canAccessPrograms: true,
          canAccessLiveLessons: true,
          canAccessVideos: true,
          canAccessAchievements: true,
          tier: 'vip'
        }
      case 'enterprise':
        return {
          canAccessAdmin: false,
          canAccessPrograms: true,
          canAccessLiveLessons: true,
          canAccessVideos: true,
          canAccessAchievements: true,
          tier: 'enterprise'
        }
      default:
        return {
          canAccessAdmin: false,
          canAccessPrograms: false,
          canAccessLiveLessons: false,
          canAccessVideos: true,
          canAccessAchievements: true,
          tier: 'basic'
        }
    }
  }

  // Default fallback
  return {
    canAccessAdmin: false,
    canAccessPrograms: false,
    canAccessLiveLessons: false,
    canAccessVideos: true,
    canAccessAchievements: true,
    tier: null
  }
}
