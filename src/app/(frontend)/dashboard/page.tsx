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
import DefaultDashboard from '../_components/DefaultDashboard'

// Client component to fetch data with authenticated user
function DashboardContent() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) return
      
      try {
        setLoading(true)
        // Fetch real data using API routes to avoid server-side import issues
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
          <div className="h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    )
  }
  
  const { dashboardStats, featuredContent, userEnrollments } = dashboardData
  


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

  // Mock upcoming lessons - would come from lessons collection
  const upcomingLessons = [
    {
      id: 1,
      title: "Live Q&A: Advanced Techniques",
      instructor: "Jane Smith",
      date: "Tomorrow",
      time: "2:00 PM EST",
      type: "Live Session"
    },
    {
      id: 2,
      title: "Competition Strategy Workshop",
      instructor: "Mike Johnson",
      date: "Friday",
      time: "1:00 PM EST",
      type: "Workshop"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Programs</h3>
            <BookOpen className="h-8 w-8 text-teal" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">{dashboardStats.totalPrograms}</p>
            <p className="text-sm text-gray-400">{dashboardStats.completedPrograms} completed, {dashboardStats.inProgressPrograms} in progress</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Learning Time</h3>
            <Clock className="h-8 w-8 text-teal" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">{dashboardStats.totalWatchTimeHours}h</p>
            <p className="text-sm text-gray-400">Total time</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Points</h3>
            <Star className="h-8 w-8 text-teal" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">1,250</p>
            <p className="text-sm text-gray-400">Total points earned</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Continue Watching */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Continue Watching</h2>
            <Button variant="ghost" asChild className="text-teal hover:text-teal/80">
              <Link href="/dashboard/videos">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {recentVideos.map((video) => (
              <Card key={video.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-4">
                  <Link href={`/dashboard/videos/${video.slug}`} className="block group">
                    <div className="relative">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        width={300}
                        height={200}
                        className="w-full h-40 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-semibold text-white group-hover:text-teal transition-colors">{video.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{video.category}</p>
                      <div className="mt-2">
                        <Progress value={video.progress} className="h-2" />
                        <p className="text-xs text-gray-400 mt-1">{video.progress}% complete</p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Programs in Progress */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal" />
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
              <Button variant="outline" asChild className="w-full mt-4 border-gray-700 text-gray-300 hover:bg-gray-800">
                <Link href="/dashboard/programs">View All Programs</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Lessons */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal" />
                Upcoming Lessons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingLessons.map((lesson: any) => (
                <div key={lesson.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm line-clamp-1">{lesson.title}</h4>
                    <p className="text-xs text-gray-400">{lesson.instructor}</p>
                    <p className="text-xs text-teal">{lesson.date}</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                    {lesson.type}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" asChild className="w-full mt-4 border-gray-700 text-gray-300 hover:bg-gray-800">
                <Link href="/dashboard/lessons">View All Lessons</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Achievement */}
          <Card className="bg-gradient-to-br from-teal/20 to-teal/5 border-teal/20">
            <CardContent className="p-4 text-center">
              <Award className="w-12 h-12 text-teal mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">7 Day Streak!</h3>
              <p className="text-sm text-gray-300 mb-3">You're on fire! Keep up the great work.</p>
              <Button size="sm" className="bg-teal hover:bg-teal/80">
                View Achievements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
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
