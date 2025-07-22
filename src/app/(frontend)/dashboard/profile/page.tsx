"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Clock, Star, Camera, Edit, BarChart3 } from "lucide-react"
import { useAuth } from "@/components/LMSAuth/AuthWrapper"
import { AuthGuard } from "@/components/LMSAuth/AuthWrapper"
import { getUserPermissions } from '@/utilities/userPermissions'
import LockedFeatureCard from '@/components/LockedFeatureCard'
import { formatWatchTime, formatStreak } from '@/utilities/timeFormat'

// Interface for profile data
interface ProfileData {
  id: string
  name: string
  email: string
  phone: string
  location: string
  bio: string
  avatar: string | null
  joinDate: string
  role: string
  stats: {
    videosWatched: number
    programsCompleted: number
    totalWatchTime: number
    currentStreak: number
    achievements: number
    points: number
  }
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    earnedDate: string
  }>
  recentActivity: Array<{
    id: string
    type: string
    title: string
    date: string
  }>
}

function ProfilePageContent() {
  const { user: authUser } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [permissions, setPermissions] = useState<any>(null)
  const [progressData, setProgressData] = useState<any>(null)
  const [learningTimeData, setLearningTimeData] = useState<any>(null)
  const [loginStreakData, setLoginStreakData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  })
  const [saving, setSaving] = useState(false)

  // Fetch profile data, permissions, and progress data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!authUser?.id) return
      
      try {
        setLoading(true)
        
        // Fetch profile data, permissions, progress data, learning time, and login streak in parallel
        const [profileRes, progressRes, learningTimeRes, loginStreakRes] = await Promise.all([
          fetch(`/api/lms/profile?userId=${authUser.id}`),
          fetch(`/api/lms/user-progress?userId=${authUser.id}`),
          fetch(`/api/lms/user-learning-time?userId=${authUser.id}`),
          fetch(`/api/lms/user-login-streak?userId=${authUser.id}`)
        ])
        
        if (!profileRes.ok) {
          throw new Error('Failed to fetch profile data')
        }
        
        const profileData = await profileRes.json()
        setProfileData(profileData)
        setEditForm({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio
        })
        
        // Load user permissions
        const userPermissions = await getUserPermissions(authUser)
        setPermissions(userPermissions)
        
        // Load progress data if user has access to programs
        if (progressRes.ok && userPermissions?.canAccessPrograms) {
          const progressData = await progressRes.json()
          setProgressData(progressData)
        }
        
        // Load learning time data (always available)
        if (learningTimeRes.ok) {
          const learningTimeData = await learningTimeRes.json()
          setLearningTimeData(learningTimeData)
        }
        
        // Load login streak data (always available)
        if (loginStreakRes.ok) {
          const loginStreakData = await loginStreakRes.json()
          setLoginStreakData(loginStreakData)
        }
        
      } catch (err) {
        console.error('Error fetching profile data:', err)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [authUser?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Profile not found'}</p>
          <Button onClick={() => window.location.reload()} className="bg-teal hover:bg-teal/80">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    if (!authUser?.id) return
    
    try {
      setSaving(true)
      const response = await fetch(`/api/lms/profile?userId=${authUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
      
      // Update local state
      setProfileData({ ...profileData, ...editForm })
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditForm({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      bio: profileData.bio
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account and track your progress</p>
        </div>
        <Badge variant="secondary" className="bg-teal/20 text-teal w-fit">
          {profileData.role}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Profile Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatar || undefined} alt={profileData.name} />
                    <AvatarFallback className="bg-teal/20 text-teal text-xl">
                      {profileData.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-teal hover:bg-teal/80"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
                  <p className="text-gray-400">{profileData.email}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profileData.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-md">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{profileData.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      disabled
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-md">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-300">{profileData.email}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-md">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{profileData.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-300">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-md">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-300">{profileData.location || 'Not provided'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="p-3 bg-gray-800 rounded-md">
                    <p className="text-gray-300">{profileData.bio || 'No bio provided yet.'}</p>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-teal hover:bg-teal/80"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300">
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-teal" />
                Achievements
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your learning milestones and accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {profileData.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{achievement.title}</h4>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">
                Your latest learning activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      activity.type === 'video_completed' ? 'bg-teal' :
                      activity.type === 'program_started' ? 'bg-blue-400' :
                      activity.type === 'achievement_earned' ? 'bg-yellow-400' :
                      'bg-gray-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-white">{activity.title}</p>
                      <p className="text-sm text-gray-400">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Learning Stats */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Learning Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal" />
                  <span className="text-gray-400">Videos Watched</span>
                </div>
                <span className="text-white font-medium">{profileData.stats.videosWatched}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-400">Programs Completed</span>
                </div>
                <span className="text-white font-medium">{profileData.stats.programsCompleted}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-400">Total Watch Time</span>
                </div>
                <span className="text-white font-medium">
                  {learningTimeData?.formattedTime || 
                   (profileData.stats.totalWatchTime ? `${profileData.stats.totalWatchTime}h` : '0s')
                  }
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-400">Current Streak</span>
                </div>
                <span className="text-white font-medium">
                  {loginStreakData?.currentStreak !== undefined 
                    ? formatStreak(loginStreakData.currentStreak)
                    : formatStreak(profileData.stats.currentStreak || 0)
                  }
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-400">Achievements</span>
                </div>
                <span className="text-white font-medium">{profileData.stats.achievements}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-teal" />
                  <span className="text-gray-400">Points</span>
                </div>
                <span className="text-white font-medium">{profileData.stats.points.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview - Access Controlled */}
          {permissions?.canAccessPrograms ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-white font-medium">
                      {progressData?.overallProgress ? `${Math.round(progressData.overallProgress)}%` : '0%'}
                    </span>
                  </div>
                  <Progress value={progressData?.overallProgress || 0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">This Month</span>
                    <span className="text-white font-medium">
                      {progressData?.monthlyVideos ? `${progressData.monthlyVideos} videos` : '0 videos'}
                    </span>
                  </div>
                  <Progress value={progressData?.monthlyProgress || 0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Goal Progress</span>
                    <span className="text-white font-medium">
                      {progressData?.completedPrograms && progressData?.totalPrograms 
                        ? `${progressData.completedPrograms}/${progressData.totalPrograms} programs`
                        : '0/0 programs'
                      }
                    </span>
                  </div>
                  <Progress value={progressData?.goalProgress || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <LockedFeatureCard
              title="Progress Overview"
              description="Track your learning progress and achievements"
              icon={<BarChart3 className="w-4 h-4" />}
              requiredTier="Premium"
            >
              <CardHeader>
                <CardTitle className="text-white">Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-white font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">This Month</span>
                    <span className="text-white font-medium">12 videos</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Goal Progress</span>
                    <span className="text-white font-medium">8/10 programs</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </LockedFeatureCard>
          )}

          {/* Quick Actions */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300">
                <User className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
              <Button variant="outline" className="w-full justify-start border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300">
                <BookOpen className="w-4 h-4 mr-2" />
                Learning Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300">
                <Award className="w-4 h-4 mr-2" />
                View All Achievements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfilePageContent />
    </AuthGuard>
  )
}
