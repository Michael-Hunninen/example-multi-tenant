/**
 * Utility to detect if we're currently in the Next.js build phase
 */

export const isBuildPhase = (): boolean => {
  return (
    // Check for our custom environment variable
    process.env.NEXT_PHASE === 'phase-production-build' ||
    // Check for Next.js build-time indicators
    process.env.NEXT_PHASE?.includes('build') ||
    // Additional check for Netlify build environment
    process.env.NETLIFY === 'true' && process.env.CONTEXT === 'production' ||
    // Fallback check for CI environments
    !!process.env.CI
  )
}

/**
 * Mock database data for build phase
 */
export const mockDbData = {
  // Add any mock data needed for static generation here
  tenants: [],
  posts: [],
  users: []
}
