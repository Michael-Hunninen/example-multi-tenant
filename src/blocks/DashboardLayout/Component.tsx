'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Play, 
  Award, 
  Clock, 
  TrendingUp, 
  Users, 
  Star,
  ChevronRight,
  Calendar,
  FileText,
  Video,
  Trophy
} from 'lucide-react'
import Link from 'next/link'

import type { DashboardLayoutBlock } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  className?: string
} & DashboardLayoutBlock

const iconMap = {
  'book-open': BookOpen,
  play: Play,
  award: Award,
  clock: Clock,
  'trending-up': TrendingUp,
  users: Users,
  star: Star,
  'chevron-right': ChevronRight,
  calendar: Calendar,
  'file-text': FileText,
  video: Video,
  trophy: Trophy,
}

export const DashboardLayoutBlockComponent: React.FC<Props> = ({
  className,
  title,
  subtitle,
  showWelcomeMessage = true,
  welcomeMessage,
  quickStats,
  recentActivity,
  quickActions,
  requiresAuth = true,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('Student') // TODO: Replace with actual user data

  useEffect(() => {
    // TODO: Replace with actual authentication check
    // For now, assume user is authenticated for demo purposes
    setIsAuthenticated(true)
  }, [])

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'green':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'yellow':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'red':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'purple':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-teal/20 text-teal border-teal/30'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video
      case 'course':
        return BookOpen
      case 'achievement':
        return Trophy
      case 'assignment':
        return FileText
      default:
        return Clock
    }
  }

  // Check authentication requirements
  if (requiresAuth && !isAuthenticated) {
    return (
      <div className={`min-h-screen bg-black flex items-center justify-center ${className || ''}`}>
        <div className="max-w-md mx-auto text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">
            Please log in to access your dashboard and continue your learning journey.
          </p>
          <Button asChild className="bg-teal hover:bg-teal/90 text-black">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-black ${className || ''}`}>
      <div className="container px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
          {subtitle && (
            <p className="text-xl text-gray-300">{subtitle}</p>
          )}
          
          {showWelcomeMessage && welcomeMessage && (
            <div className="mt-6 p-4 bg-teal/10 border border-teal/20 rounded-lg">
              <p className="text-teal">{welcomeMessage}</p>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        {quickStats && quickStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon ? iconMap[stat.icon as keyof typeof iconMap] : TrendingUp
              
              return (
                <Card key={index} className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      {IconComponent && (
                        <div className={`p-3 rounded-full ${getColorClasses(stat.color || 'teal')}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          {quickActions && quickActions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Jump back into your learning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => {
                      const IconComponent = action.icon ? iconMap[action.icon as keyof typeof iconMap] : ChevronRight
                      
                      return (
                        <Link
                          key={index}
                          href={action.url}
                          className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${getColorClasses(action.color || 'teal')} hover:bg-opacity-30`}
                        >
                          <div className="flex items-center gap-3">
                            {IconComponent && <IconComponent className="w-5 h-5" />}
                            <div>
                              <h3 className="font-semibold">{action.title}</h3>
                              {action.description && (
                                <p className="text-sm opacity-80">{action.description}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recent Activity */}
          {recentActivity && recentActivity.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your latest progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity, index) => {
                      const IconComponent = getActivityIcon(activity.type || 'default')
                      
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                          <div className="p-2 bg-teal/20 rounded-full">
                            <IconComponent className="w-4 h-4 text-teal" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{activity.title}</h4>
                            {activity.description && (
                              <p className="text-gray-400 text-sm">{activity.description}</p>
                            )}
                            {activity.timestamp && (
                              <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
                            )}
                          </div>
                          {activity.url && (
                            <Link href={activity.url} className="text-teal hover:text-teal/80">
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
