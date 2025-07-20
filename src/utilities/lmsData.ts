import { getPayload } from 'payload'
import config from '@/payload.config'

// Initialize Payload
const payload = await getPayload({ config })

export interface VideoData {
  id: string
  title: string
  slug: string
  description?: any
  thumbnail?: any
  videoFile?: any
  videoUrl?: string
  duration?: number
  category?: any
  tags?: Array<{ tag: string }>
  chapters?: Array<{
    title: string
    startTime: number
    description?: string
  }>
  instructor?: any
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  accessLevel: 'free' | 'basic' | 'premium' | 'vip'
  createdAt: string
  updatedAt: string
}

export interface ProgramData {
  id: string
  title: string
  slug: string
  description?: any
  shortDescription?: string
  thumbnail?: any
  instructor?: any
  category?: any
  lessons?: Array<{
    title: string
    description?: string
    video?: any
    duration?: number
    order: number
    isPreview: boolean
  }>
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration?: number
  price?: number
  accessLevel: 'free' | 'basic' | 'premium' | 'vip'
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  enrollmentLimit?: number
  tags?: Array<{ tag: string }>
  lessonsCount?: number
  createdAt: string
  updatedAt: string
}

export interface EnrollmentData {
  id: string
  user: any
  program: any
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  progress: number
  completedLessons?: Array<{
    lessonIndex: number
    completedAt: string
    timeSpent?: number
  }>
  enrolledAt: string
  completedAt?: string
  lastAccessedAt?: string
  totalTimeSpent: number
  certificateIssued: boolean
}

export interface VideoProgressData {
  id: string
  user: any
  video: any
  progress: number
  currentTime: number
  duration?: number
  completed: boolean
  watchTime: number
  lastWatchedAt: string
  firstWatchedAt: string
}

// Fetch videos with optional filters
export async function getVideos(options: {
  limit?: number
  page?: number
  category?: string
  difficulty?: string
  featured?: boolean
  status?: string
  search?: string
} = {}): Promise<{ docs: VideoData[], totalPages: number, page: number, totalDocs: number }> {
  const {
    limit = 10,
    page = 1,
    category,
    difficulty,
    featured,
    status = 'published',
    search
  } = options

  const where: any = { status: { equals: status } }

  if (category) {
    where.category = { equals: category }
  }

  if (difficulty) {
    where.difficulty = { equals: difficulty }
  }

  if (featured !== undefined) {
    where.featured = { equals: featured }
  }

  if (search) {
    where.or = [
      { title: { contains: search } },
      { 'tags.tag': { contains: search } }
    ]
  }

  const result = await payload.find({
    collection: 'videos',
    where,
    limit,
    page,
    sort: '-createdAt',
    depth: 2
  })

  return result as any
}

// Fetch single video by slug
export async function getVideoBySlug(slug: string): Promise<VideoData | null> {
  const result = await payload.find({
    collection: 'videos',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2
  })

  return result.docs[0] as VideoData || null
}

// Fetch programs with optional filters
export async function getPrograms(options: {
  limit?: number
  page?: number
  category?: string
  difficulty?: string
  featured?: boolean
  status?: string
  search?: string
} = {}): Promise<{ docs: ProgramData[], totalPages: number, page: number, totalDocs: number }> {
  const {
    limit = 10,
    page = 1,
    category,
    difficulty,
    featured,
    status = 'published',
    search
  } = options

  const where: any = { status: { equals: status } }

  if (category) {
    where.category = { equals: category }
  }

  if (difficulty) {
    where.difficulty = { equals: difficulty }
  }

  if (featured !== undefined) {
    where.featured = { equals: featured }
  }

  if (search) {
    where.or = [
      { title: { contains: search } },
      { 'tags.tag': { contains: search } }
    ]
  }

  const result = await payload.find({
    collection: 'programs',
    where,
    limit,
    page,
    sort: '-createdAt',
    depth: 2
  })

  return result as any
}

// Fetch single program by slug
export async function getProgramBySlug(slug: string): Promise<ProgramData | null> {
  const result = await payload.find({
    collection: 'programs',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 3
  })

  return result.docs[0] as ProgramData || null
}

// Fetch user enrollments
export async function getUserEnrollments(userId: string, options: {
  limit?: number
  page?: number
  status?: string
} = {}): Promise<{ docs: EnrollmentData[], totalPages: number, page: number, totalDocs: number }> {
  const { limit = 10, page = 1, status } = options

  const where: any = { user: { equals: userId } }

  if (status) {
    where.status = { equals: status }
  }

  const result = await payload.find({
    collection: 'enrollments',
    where,
    limit,
    page,
    sort: '-enrolledAt',
    depth: 2
  })

  return result as any
}

// Fetch user video progress
export async function getUserVideoProgress(userId: string, videoId?: string): Promise<VideoProgressData[]> {
  const where: any = { user: { equals: userId } }

  if (videoId) {
    where.video = { equals: videoId }
  }

  const result = await payload.find({
    collection: 'video-progress',
    where,
    limit: 100,
    sort: '-lastWatchedAt',
    depth: 2
  })

  return result.docs as VideoProgressData[]
}

// Get dashboard stats for a user
export async function getDashboardStats(userId: string) {
  // Get user enrollments
  const enrollments = await getUserEnrollments(userId, { limit: 100 })
  
  // Get user video progress
  const videoProgress = await getUserVideoProgress(userId)
  
  // Calculate stats
  const totalPrograms = enrollments.docs.length
  const completedPrograms = enrollments.docs.filter(e => e.status === 'completed').length
  const inProgressPrograms = enrollments.docs.filter(e => e.status === 'active').length
  
  const totalVideosWatched = videoProgress.length
  const completedVideos = videoProgress.filter(v => v.completed).length
  
  const totalWatchTime = videoProgress.reduce((total, v) => total + v.watchTime, 0)
  const totalWatchTimeHours = Math.round(totalWatchTime / 3600 * 10) / 10
  
  // Get recent activity (last 5 video progress updates)
  const recentActivity = videoProgress.slice(0, 5).map(progress => ({
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
    recentActivity
  }
}

// Get featured content for dashboard
export async function getFeaturedContent() {
  const [featuredVideos, featuredPrograms] = await Promise.all([
    getVideos({ featured: true, limit: 6 }),
    getPrograms({ featured: true, limit: 4 })
  ])

  return {
    videos: featuredVideos.docs,
    programs: featuredPrograms.docs
  }
}
