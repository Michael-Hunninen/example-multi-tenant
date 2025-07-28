'use client'

import { Suspense } from 'react'
import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Play, Clock, Users, Trophy, BookOpen, TrendingUp, Award, Calendar, ChevronRight, Star, BarChart3 } from "lucide-react"
import { useAuth } from '@/components/LMSAuth/AuthWrapper'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import DefaultDashboard from '../_components/DefaultDashboard'
import DashboardWalkthrough from '../_components/DashboardWalkthrough'
import { getUserPermissions } from '@/utilities/userPermissions'
import LockedFeatureCard from '@/components/LockedFeatureCard'
import { Video, Category, Media } from '@/payload-types'

// Extended interface for videos with progress information
interface VideoWithProgress extends Omit<Video, 'thumbnail' | 'category'> {
  thumbnail: string;
  category: string;
  progress?: number;
}

// Client component to fetch data with authenticated user
function DashboardContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [permissions, setPermissions] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showWalkthrough, setShowWalkthrough] = useState(false)
  
  // Check if user just completed onboarding
  useEffect(() => {
    const walkthroughParam = searchParams.get('walkthrough')
    const onboardedParam = searchParams.get('onboarded')
    
    if (walkthroughParam === 'true' && onboardedParam === 'true') {
      // Small delay to ensure dashboard is rendered
      setTimeout(() => {
        setShowWalkthrough(true)
      }, 1000)
    }
  }, [searchParams])
  
  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) return
      
      try {
        setLoading(true)
        // Fetch real data using API routes to avoid server-side import issues
        const [dashboardStatsRes, featuredContentRes, userEnrollmentsRes, userPointsRes, upcomingLessonsRes, learningTimeRes, recentVideosRes] = await Promise.all([
          fetch(`/api/lms/dashboard-stats?userId=${user.id}`),
          fetch('/api/lms/featured-content'),
          fetch(`/api/lms/user-enrollments?userId=${user.id}&limit=3&status=active`),
          fetch(`/api/lms/user-points?userId=${user.id}`),
          fetch(`/api/lms/upcoming-lessons?userId=${user.id}&limit=3`),
          fetch(`/api/lms/user-learning-time?userId=${user.id}`),
          fetch(`/api/lms/recent-videos-progress?userId=${user.id}`)
        ])
        
        const [dashboardStats, featuredContent, userEnrollments, userPoints, upcomingLessons, learningTime, recentVideosData] = await Promise.all([
          dashboardStatsRes.json(),
          featuredContentRes.json(),
          userEnrollmentsRes.json(),
          userPointsRes.json(),
          upcomingLessonsRes.json(),
          learningTimeRes.json(),
          recentVideosRes.json()
        ])
        
        setDashboardData({ dashboardStats, featuredContent, userEnrollments, userPoints, upcomingLessons, learningTime, recentVideosData })
        
        // Load user permissions
        const userPermissions = await getUserPermissions(user)
        setPermissions(userPermissions)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [user?.id])
  
  if (loading || !dashboardData || !permissions) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    )
  }
  
  const { dashboardStats, featuredContent, userEnrollments, userPoints, upcomingLessons, learningTime, recentVideosData } = dashboardData
  


  // Transform user enrollments for programs in progress
  const programsInProgress = userEnrollments.docs.map((enrollment: any) => ({
    id: enrollment.program.id,
    title: enrollment.program.title,
    instructor: enrollment.program.instructor?.name || 'Unknown Instructor',
    progress: enrollment.progress,
    lessonsCompleted: enrollment.completedLessons?.length || 0,
    totalLessons: enrollment.program.lessonsCount || enrollment.program.lessons?.length || 0,
    thumbnail: enrollment.program.thumbnail?.url || '/placeholder.svg?height=200&width=300',
    slug: enrollment.program.slug
  }))

  // Use real upcoming lessons data from API
  const upcomingLessonsData = upcomingLessons?.lessons || []

  // Use real recent videos data with actual progress
  const recentVideos = recentVideosData?.videos?.slice(0, 3) || []

  // Permissions are now loaded via state in useEffect

  const handleWalkthroughComplete = () => {
    setShowWalkthrough(false)
    // Optionally clear URL parameters
    window.history.replaceState({}, '', '/dashboard')
  }

  const handleWalkthroughSkip = () => {
    setShowWalkthrough(false)
    // Optionally clear URL parameters
    window.history.replaceState({}, '', '/dashboard')
  }

  return (
    <>
      <div className="space-y-8 dashboard-overview">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-900/50 to-blue-900/50 border border-teal/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.name || 'User'}!</h1>
              <p className="text-gray-300">Ready to continue your equestrian journey?</p>
            </div>
            <div className="hidden md:block">
              <TrendingUp className="h-16 w-16 text-teal/50" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 stats-section">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Programs</h3>
            <BookOpen className="h-8 w-8 text-teal-400" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">{dashboardStats.totalPrograms}</p>
            <p className="text-sm text-gray-400">{dashboardStats.completedPrograms} completed, {dashboardStats.inProgressPrograms} in progress</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Learning Time</h3>
            <Clock className="h-8 w-8 text-teal-400" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">{learningTime?.formattedTime || '0s'}</p>
            <p className="text-sm text-gray-400">Total time</p>
            {learningTime?.totalVideosWatched > 0 && (
              <p className="text-xs text-teal-400 mt-1">
                {learningTime.totalVideosWatched} video{learningTime.totalVideosWatched !== 1 ? 's' : ''} watched
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Points</h3>
            <Star className="h-8 w-8 text-teal-400" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">{userPoints?.totalPoints?.toLocaleString() || '0'}</p>
            <p className="text-sm text-gray-400">Total points earned</p>
            {userPoints?.achievements?.length > 0 && (
              <p className="text-xs text-teal-400 mt-1">
                {userPoints.achievements.length} achievement{userPoints.achievements.length !== 1 ? 's' : ''} unlocked
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Continue Watching */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between continue-watching">
            <h2 className="text-xl font-semibold text-white">Continue Watching</h2>
            <Button variant="ghost" asChild className="text-teal hover:text-teal/80">
              <Link href="/dashboard/videos">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {recentVideos.length > 0 ? (
              recentVideos.map((video: VideoWithProgress) => (
                <Card key={video.id} className="relative overflow-hidden border-gray-800 hover:border-gray-700 transition-colors group">
                  <Link href={`/dashboard/videos/${video.id}`} className="block">
                    {/* Background Image */}
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                    
                    {/* Content */}
                    <CardContent className="relative p-6 h-56 flex flex-col justify-end">
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-teal-500/20 rounded-full p-4 backdrop-blur-sm">
                          <Play className="h-8 w-8 text-white fill-white" />
                        </div>
                      </div>
                      
                      {/* Duration Badge */}
                      <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        {video.duration}
                      </div>
                      
                      {/* Video Info */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-white group-hover:text-teal transition-colors line-clamp-2">
                          {video.title}
                        </h4>
                        <p className="text-sm text-gray-300">{video.category}</p>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <Progress value={video.progress} className="h-2 bg-gray-800/50" />
                          <p className="text-xs text-gray-300">{video.progress}% complete</p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))
            ) : (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-8 text-center">
                  <Play className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">No Videos in Progress</h4>
                  <p className="text-sm text-gray-400 mb-4">Start watching videos to see your progress here</p>
                  <Button asChild className="bg-teal-500 hover:bg-teal-600">
                    <Link href="/dashboard/videos">Browse Videos</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Programs in Progress */}
          {permissions.canAccessPrograms ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-400" />
                  Programs in Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {programsInProgress.map((program: any) => (
                  <div key={program.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white text-sm line-clamp-1">{program.title}</h4>
                      <span className="text-xs text-gray-400">{program.completedLessons}/{program.totalLessons}</span>
                    </div>
                    <Progress value={program.progress} className="h-2" />
                    <p className="text-xs text-gray-400">{program.progress}% complete</p>
                  </div>
                ))}
                <Button variant="outline" asChild className="w-full mt-4 border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300">
                  <Link href="/dashboard/programs">View All Programs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <LockedFeatureCard
              title="Programs in Progress"
              description="Track your program completion"
              icon={<BookOpen className="w-5 h-5" />}
              requiredTier="Premium"
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-400" />
                  Programs in Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white text-sm line-clamp-1">Sample Program</h4>
                    <span className="text-xs text-gray-400">3/10</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  <p className="text-xs text-gray-400">30% complete</p>
                </div>
                <Button variant="outline" className="w-full mt-4 border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300">
                  View All Programs
                </Button>
              </CardContent>
            </LockedFeatureCard>
          )}

          {/* Upcoming Lessons */}
          {permissions.canAccessLiveLessons ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  Upcoming Lessons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingLessonsData.length > 0 ? (
                  upcomingLessonsData.map((lesson: any) => (
                    <div key={lesson.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm line-clamp-1">{lesson.title}</h4>
                        <p className="text-xs text-gray-400">{lesson.instructor}</p>
                        <p className="text-xs text-teal">{lesson.date} at {lesson.time}</p>
                        {lesson.programTitle && (
                          <p className="text-xs text-gray-500">from {lesson.programTitle}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                        {lesson.type}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No upcoming lessons</p>
                  </div>
                )}
                <Button variant="outline" asChild className="w-full mt-4 border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300">
                  <Link href="/dashboard/lessons">View All Lessons</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <LockedFeatureCard
              title="Upcoming Lessons"
              description="View your scheduled live lessons"
              icon={<Calendar className="w-5 h-5" />}
              requiredTier="Pro"
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  Upcoming Lessons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm line-clamp-1">Advanced Training Session</h4>
                    <p className="text-xs text-gray-400">John Smith</p>
                    <p className="text-xs text-teal">Tomorrow at 2:00 PM</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                    Live
                  </Badge>
                </div>
                <Button variant="outline" className="w-full mt-4 border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300">
                  View All Lessons
                </Button>
              </CardContent>
            </LockedFeatureCard>
          )}

          {/* Achievement */}
          <Card className="bg-gradient-to-br from-teal/20 to-teal/5 border-teal/20">
            <CardContent className="p-4 text-center">
              <Award className="w-12 h-12 text-teal-400 mx-auto mb-3" />
              {userPoints?.achievements?.length > 0 ? (
                <>
                  <h3 className="font-semibold text-white mb-1">
                    {userPoints.achievements.length} Achievement{userPoints.achievements.length !== 1 ? 's' : ''} Unlocked!
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                    {userPoints.totalPoints} points earned from achievements
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-white mb-1">Ready to Achieve!</h3>
                  <p className="text-sm text-gray-300 mb-3">Start earning achievements by completing videos and programs</p>
                </>
              )}
              <Button size="sm" className="bg-teal hover:bg-teal/80" asChild>
                <Link href="/dashboard/achievements">View Achievements</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
      
      {/* Interactive Walkthrough */}
      {showWalkthrough && (
        <DashboardWalkthrough
          onComplete={handleWalkthroughComplete}
          onSkip={handleWalkthroughSkip}
        />
      )}
    </>
  )
}

// Default export for the page
export default function DashboardPage() {
  const [customPagesEnabled, setCustomPagesEnabled] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function checkCustomPagesStatus() {
      try {
        // Get current domain from window location
        const currentDomain = window.location.host
        
        // Fetch domain info to check if custom pages are enabled
        const response = await fetch(`/api/domain-info?domain=${currentDomain}`)
        if (response.ok) {
          const domainInfo = await response.json()
          setCustomPagesEnabled(domainInfo?.enableCustomPages === true)
        } else {
          // Default to false if we can't fetch domain info
          setCustomPagesEnabled(false)
        }
      } catch (error) {
        console.error('Error checking custom pages status:', error)
        // Default to false on error
        setCustomPagesEnabled(false)
      } finally {
        setLoading(false)
      }
    }
    
    checkCustomPagesStatus()
  }, [])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }
  
  // If custom pages are enabled, show the branded JG Performance Horses dashboard
  if (customPagesEnabled) {
    return <DashboardContent />
  }
  
  // Otherwise, show the generic default dashboard
  return <DefaultDashboard />
}
