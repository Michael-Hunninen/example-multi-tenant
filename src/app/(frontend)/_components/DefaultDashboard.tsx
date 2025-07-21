'use client'

import { Suspense } from 'react'
import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Play, Clock, Users, Trophy, BookOpen, TrendingUp, Award, Calendar, ChevronRight, Star, BarChart3, Settings, User, CreditCard } from "lucide-react"
import { useAuth } from '@/components/LMSAuth/AuthWrapper'
import { useEffect, useState } from 'react'

// Generic default dashboard for all tenants (unless custom pages are enabled)
function DefaultDashboardContent() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) return
      
      try {
        setLoading(true)
        // Fetch generic dashboard data
        const [dashboardStatsRes, featuredContentRes, userEnrollmentsRes] = await Promise.all([
          fetch(`/api/lms/dashboard-stats?userId=${user.id}`),
          fetch('/api/lms/featured-content'),
          fetch(`/api/lms/user-enrollments?userId=${user.id}&limit=3&status=active`)
        ])
        
        const [dashboardStats, featuredContent, userEnrollments] = await Promise.all([
          dashboardStatsRes.json(),
          featuredContentRes.json(),
          userEnrollmentsRes.json()
        ])
        
        setDashboardData({ dashboardStats, featuredContent, userEnrollments })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [user?.id])
  
  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }
  
  const { dashboardStats, featuredContent, userEnrollments } = dashboardData

  // Transform user enrollments for programs in progress
  const programsInProgress = userEnrollments.docs.map((enrollment: any) => ({
    id: enrollment.program.id,
    title: enrollment.program.title,
    instructor: enrollment.program.instructor?.name || 'Instructor',
    progress: enrollment.progress,
    lessonsCompleted: enrollment.completedLessons?.length || 0,
    totalLessons: enrollment.program.lessonsCount || enrollment.program.lessons?.length || 0,
    thumbnail: enrollment.program.thumbnail?.url || '/placeholder.svg?height=200&width=300',
    slug: enrollment.program.slug
  }))

  // Generic upcoming sessions
  const upcomingSessions = [
    {
      id: 1,
      title: "Weekly Q&A Session",
      instructor: "Course Instructor",
      date: "Tomorrow",
      time: "2:00 PM",
      type: "Live Session"
    },
    {
      id: 2,
      title: "Study Group Meeting",
      instructor: "Community",
      date: "Friday",
      time: "1:00 PM",
      type: "Group Session"
    }
  ]

  // Transform featured content for recent videos
  const recentVideos = featuredContent.videos.slice(0, 3).map((video: any, index: number) => ({
    id: video.id,
    title: video.title,
    duration: video.duration ? `${Math.round(video.duration / 60)}:${String(video.duration % 60).padStart(2, '0')}` : 'Unknown',
    thumbnail: video.thumbnail?.url || '/placeholder.svg?height=120&width=200',
    progress: [75, 45, 100][index] || 0, // Mock progress for now
    category: video.category?.name || 'General',
    slug: video.slug
  }))

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'User'}!</h1>
            <p className="text-gray-600">Continue your learning journey</p>
          </div>
          <div className="hidden md:block">
            <TrendingUp className="h-16 w-16 text-gray-300" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalPrograms}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.completedPrograms} completed, {dashboardStats.inProgressPrograms} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalWatchTimeHours}h</div>
            <p className="text-xs text-muted-foreground">Total time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">Achievement points</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Continue Learning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Continue Learning
            </CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {programsInProgress.length > 0 ? (
              programsInProgress.map((program: any) => (
                <div key={program.id} className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0">
                    <img
                      src={program.thumbnail}
                      alt={program.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{program.title}</h4>
                    <p className="text-xs text-gray-500">{program.instructor}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={program.progress} className="flex-1 h-2" />
                      <span className="text-xs text-gray-500">{program.progress}%</span>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/programs/${program.slug}`}>Continue</Link>
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No programs in progress</p>
                <Button asChild>
                  <Link href="/dashboard/programs">Browse Programs</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Videos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Recent Videos
            </CardTitle>
            <CardDescription>Latest content added</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentVideos.length > 0 ? (
              recentVideos.map((video: any) => (
                <div key={video.id} className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0 relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{video.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{video.duration}</span>
                      <span>•</span>
                      <span>{video.category}</span>
                    </div>
                    {video.progress > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={video.progress} className="flex-1 h-1" />
                        <span className="text-xs text-gray-500">{video.progress}%</span>
                      </div>
                    )}
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/videos/${video.slug}`}>Watch</Link>
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Play className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No videos available</p>
                <Button asChild>
                  <Link href="/dashboard/videos">Browse Videos</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/dashboard/profile">
                <User className="h-6 w-6" />
                <span>Edit Profile</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/dashboard/settings">
                <Settings className="h-6 w-6" />
                <span>Settings</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/dashboard/pricing">
                <CreditCard className="h-6 w-6" />
                <span>Subscription</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DefaultDashboard() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      }>
        <DefaultDashboardContent />
      </Suspense>
    </div>
  )
}
