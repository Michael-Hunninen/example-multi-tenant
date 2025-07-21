import { getPayload } from 'payload'
import config from '@/payload.config'

// Tenant-aware LMS data utilities
// All functions require tenantId to ensure proper multi-tenant isolation

export async function getTenantVideos(tenantId: string, options: {
  limit?: number
  page?: number
  category?: string
  difficulty?: string
  search?: string
} = {}) {
  const payload = await getPayload({ config })
  
  const { limit = 12, page = 1, category, difficulty, search } = options
  
  // Build where clause with tenant filtering
  const where: any = {
    tenant: { equals: tenantId }
  }
  
  if (category && category !== 'All') {
    where['category.name'] = { equals: category }
  }
  
  if (difficulty && difficulty !== 'All') {
    where.difficulty = { equals: difficulty.toLowerCase() }
  }
  
  if (search) {
    where.or = [
      { title: { contains: search } },
      { description: { contains: search } }
    ]
  }
  
  return await payload.find({
    collection: 'videos',
    where,
    limit,
    page,
    depth: 2,
    sort: '-createdAt'
  })
}

export async function getTenantPrograms(tenantId: string, options: {
  limit?: number
  page?: number
  category?: string
  difficulty?: string
} = {}) {
  const payload = await getPayload({ config })
  
  const { limit = 12, page = 1, category, difficulty } = options
  
  const where: any = {
    tenant: { equals: tenantId }
  }
  
  if (category && category !== 'All') {
    where['category.name'] = { equals: category }
  }
  
  if (difficulty && difficulty !== 'All') {
    where.difficulty = { equals: difficulty.toLowerCase() }
  }
  
  return await payload.find({
    collection: 'programs',
    where,
    limit,
    page,
    depth: 2,
    sort: '-createdAt'
  })
}

export async function getTenantUserEnrollments(tenantId: string, userId: string, options: {
  limit?: number
  status?: string
} = {}) {
  const payload = await getPayload({ config })
  
  const { limit = 10, status } = options
  
  const where: any = {
    tenant: { equals: tenantId },
    user: { equals: userId }
  }
  
  if (status) {
    where.status = { equals: status }
  }
  
  return await payload.find({
    collection: 'enrollments',
    where,
    limit,
    depth: 2,
    sort: '-createdAt'
  })
}

export async function getTenantFeaturedContent(tenantId: string) {
  const payload = await getPayload({ config })
  
  // Get featured videos for this tenant
  const featuredVideos = await payload.find({
    collection: 'videos',
    where: {
      tenant: { equals: tenantId },
      featured: { equals: true }
    },
    limit: 6,
    depth: 2,
    sort: '-createdAt'
  })
  
  // Get featured programs for this tenant
  const featuredPrograms = await payload.find({
    collection: 'programs',
    where: {
      tenant: { equals: tenantId },
      featured: { equals: true }
    },
    limit: 3,
    depth: 2,
    sort: '-createdAt'
  })
  
  return {
    videos: featuredVideos.docs,
    programs: featuredPrograms.docs
  }
}

export async function getTenantDashboardStats(tenantId: string, userId: string) {
  const payload = await getPayload({ config })
  
  // Get user enrollments for this tenant
  const enrollments = await getTenantUserEnrollments(tenantId, userId, { limit: 100 })
  
  // Get user video progress for this tenant
  const videoProgress = await payload.find({
    collection: 'video-progress',
    where: {
      tenant: { equals: tenantId },
      user: { equals: userId }
    },
    limit: 100,
    depth: 1
  })
  
  // Calculate stats
  const totalPrograms = enrollments.docs.length
  const completedPrograms = enrollments.docs.filter((e: any) => e.status === 'completed').length
  const inProgressPrograms = enrollments.docs.filter((e: any) => e.status === 'active').length
  
  const totalVideosWatched = videoProgress.docs.length
  const completedVideos = videoProgress.docs.filter((v: any) => v.completed).length
  
  const totalWatchTime = videoProgress.docs.reduce((total: number, v: any) => total + (v.watchTime || 0), 0)
  const totalWatchTimeHours = Math.round(totalWatchTime / 3600 * 10) / 10
  
  // Calculate total points (example calculation)
  const totalPoints = (completedPrograms * 100) + (completedVideos * 10)
  
  // Get recent activity (last 5 video progress updates)
  const recentActivity = videoProgress.docs.slice(0, 5).map((progress: any) => ({
    type: 'video_progress' as const,
    video: progress.video,
    progress: progress.progress,
    lastWatchedAt: progress.lastWatchedAt
  }))
  
  return {
    totalPrograms,
    completedPrograms,
    inProgressPrograms,
    totalVideosWatched,
    completedVideos,
    totalWatchTimeHours,
    totalPoints,
    recentActivity
  }
}

export async function getTenantCategories(tenantId: string) {
  const payload = await getPayload({ config })
  
  return await payload.find({
    collection: 'categories',
    where: {
      tenant: { equals: tenantId }
    },
    limit: 100,
    sort: 'name'
  })
}
