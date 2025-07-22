export type UserRole = 'super-admin' | 'admin' | 'business' | 'regular'
export type UserTier = 'basic' | 'premium' | 'pro' // For regular users

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
 * Get user tier for regular users
 * This would typically come from a subscription or user profile field
 * For now, we'll use a placeholder logic
 */
export function getUserTier(user: any): UserTier | null {
  if (!hasRole(user, 'regular')) return null
  
  // TODO: Replace with actual tier logic from subscription/profile
  // For now, assume basic tier for demo purposes
  return user.tier || 'basic'
}

/**
 * Get comprehensive user permissions
 */
export function getUserPermissions(user: any): UserPermissions {
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
    const tier = getUserTier(user)
    
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
      case 'pro':
        return {
          canAccessAdmin: false,
          canAccessPrograms: true,
          canAccessLiveLessons: true,
          canAccessVideos: true,
          canAccessAchievements: true,
          tier: 'pro'
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
