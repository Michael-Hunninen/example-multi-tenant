'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/LMSAuth/AuthWrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award, Trophy, Star, Clock, BookOpen, Play, MessageCircle, Target, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Achievement {
  id: string
  title: string
  description: string
  points: number
  earnedAt: string
  icon?: any
  type: string
  rarity: string
}

interface UserAchievements {
  totalPoints: number
  achievements: Achievement[]
  completedVideos: number
}

const rarityColors = {
  common: 'border-gray-500 bg-gray-500/10',
  uncommon: 'border-green-500 bg-green-500/10',
  rare: 'border-blue-500 bg-blue-500/10',
  epic: 'border-purple-500 bg-purple-500/10',
  legendary: 'border-yellow-500 bg-yellow-500/10'
}

const rarityTextColors = {
  common: 'text-gray-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400'
}

const typeIcons = {
  video_completion: Play,
  program_completion: BookOpen,
  streak: Target,
  time_spent: Clock,
  first_login: Star,
  comment: MessageCircle,
  special: Trophy
}

export default function AchievementsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [userAchievements, setUserAchievements] = useState<UserAchievements | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return

    const fetchUserAchievements = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/lms/user-points?userId=${user.id}`)
        
        if (response.ok) {
          const data = await response.json()
          setUserAchievements(data)
        }
      } catch (error) {
        console.error('Error fetching user achievements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAchievements()
  }, [user?.id, isAuthenticated])

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading achievements...</p>
        </div>
      </div>
    )
  }

  const achievements = userAchievements?.achievements || []
  const totalPoints = userAchievements?.totalPoints || 0

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild className="text-teal-400 hover:text-teal-300">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-teal/20 to-teal/5 border border-teal/20 rounded-full p-4">
            <Trophy className="w-8 h-8 text-teal-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Your Achievements</h1>
            <p className="text-gray-400">Track your progress and celebrate your milestones</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-teal-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">{achievements.length}</p>
              <p className="text-sm text-gray-400">Achievements Unlocked</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">{totalPoints.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Points Earned</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <Play className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">{userAchievements?.completedVideos || 0}</p>
              <p className="text-sm text-gray-400">Videos Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Grid */}
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const IconComponent = typeIcons[achievement.type as keyof typeof typeIcons] || Award
              const rarityClass = rarityColors[achievement.rarity as keyof typeof rarityColors] || rarityColors.common
              const rarityTextClass = rarityTextColors[achievement.rarity as keyof typeof rarityTextColors] || rarityTextColors.common

              return (
                <Card key={achievement.id} className={`bg-gray-900 border-2 ${rarityClass} hover:scale-105 transition-transform`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="bg-teal-500/20 rounded-full p-3">
                        <IconComponent className="w-6 h-6 text-teal-400" />
                      </div>
                      <Badge variant="outline" className={`text-xs ${rarityTextClass} border-current`}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <h3 className="font-semibold text-white mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-white">{achievement.points} pts</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-12 text-center">
              <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Achievements Yet</h3>
              <p className="text-gray-400 mb-6">
                Start your learning journey to unlock achievements and earn points!
              </p>
              <Button asChild className="bg-teal-500 hover:bg-teal-600">
                <Link href="/dashboard/videos">Browse Videos</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Achievement Categories Info */}
        <Card className="bg-gray-900 border-gray-800 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Achievement Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Play className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Video Completion</p>
                <p className="text-xs text-gray-400">Complete training videos</p>
              </div>
              <div className="text-center">
                <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Program Completion</p>
                <p className="text-xs text-gray-400">Finish entire programs</p>
              </div>
              <div className="text-center">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Streaks</p>
                <p className="text-xs text-gray-400">Consistent daily learning</p>
              </div>
              <div className="text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Special</p>
                <p className="text-xs text-gray-400">Unique milestones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
