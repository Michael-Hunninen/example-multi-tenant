"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Users, Video, BookOpen, Play, ChevronRight, Star, MapPin, User } from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/components/LMSAuth/AuthWrapper'
import { renderRichText } from '@/utilities/richTextRenderer'
import AccessControlWrapper from '@/components/AccessControlWrapper'

// Lessons content component
function LessonsContent() {
  const { user } = useAuth()
  const [upcomingLessons, setUpcomingLessons] = useState<any[]>([])
  const [pastLessons, setPastLessons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch lessons from API
  useEffect(() => {
    async function fetchLessons() {
      if (!user?.id) return
      
      try {
        setIsLoading(true)
        const [upcomingRes, pastRes] = await Promise.all([
          fetch('/api/lms/lessons?type=upcoming&limit=10'),
          fetch('/api/lms/lessons?type=past&limit=10')
        ])
        
        const [upcomingData, pastData] = await Promise.all([
          upcomingRes.json(),
          pastRes.json()
        ])
        
        if (upcomingRes.ok) {
          setUpcomingLessons(upcomingData.docs || [])
        }
        
        if (pastRes.ok) {
          setPastLessons(pastData.docs || [])
        }
      } catch (error) {
        console.error('Error fetching lessons:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchLessons()
  }, [user?.id])

  const handleRegister = (lessonId: string) => {
    setUpcomingLessons(prev => 
      prev.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, isRegistered: true, currentParticipants: lesson.currentParticipants + 1 }
          : lesson
      )
    )
  }

  const handleUnregister = (lessonId: string) => {
    setUpcomingLessons(prev => 
      prev.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, isRegistered: false, currentParticipants: lesson.currentParticipants - 1 }
          : lesson
      )
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const isLessonToday = (dateString: string) => {
    const lessonDate = new Date(dateString)
    const today = new Date()
    return lessonDate.toDateString() === today.toDateString()
  }

  const isLessonSoon = (dateString: string, timeString: string) => {
    const lessonDateTime = new Date(`${dateString} ${timeString}`)
    const now = new Date()
    const timeDiff = lessonDateTime.getTime() - now.getTime()
    return timeDiff > 0 && timeDiff <= 60 * 60 * 1000 // Within 1 hour
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Lessons</h1>
          <p className="text-gray-400">Join live sessions, workshops, and masterclasses with expert instructors</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-teal/20 text-teal">
            {upcomingLessons.filter(l => l.isRegistered).length} registered
          </Badge>
          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
            {upcomingLessons.length} upcoming
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900 border-gray-800">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-teal data-[state=active]:text-black">
            Upcoming Lessons
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-teal data-[state=active]:text-black">
            Past Lessons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading lessons...</p>
              </div>
            ) : upcomingLessons.length > 0 ? (
              upcomingLessons.map((lesson) => (
                <Card key={lesson.id} className="bg-gray-900 border-gray-800">
                  <div className="grid md:grid-cols-4 gap-0">
                    {/* Thumbnail */}
                    <div className="md:col-span-1 relative">
                      <div className="aspect-video md:aspect-square relative overflow-hidden rounded-l-lg">
                        <Image
                          src={lesson.thumbnail || '/placeholder-lesson.jpg'}
                          alt={lesson.title}
                          fill
                          className="object-cover"
                        />
                        {isLessonToday(lesson.date) && (
                          <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                            Today
                          </Badge>
                        )}
                        {isLessonSoon(lesson.date, lesson.time) && (
                          <Badge className="absolute top-2 right-2 bg-yellow-600 text-white animate-pulse">
                            Starting Soon
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3 p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{lesson.title}</h3>
                          <p className="text-gray-400 leading-relaxed">{lesson.description}</p>
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={lesson.instructor?.avatar} />
                            <AvatarFallback className="bg-gray-700 text-gray-300">
                              {lesson.instructor?.name?.split(' ').map((n: string) => n[0]).join('') || 'I'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{lesson.instructor?.name}</p>
                            <p className="text-sm text-gray-400">{lesson.instructor?.bio}</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(lesson.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{lesson.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{lesson.currentParticipants}/{lesson.maxParticipants} spots</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>{lesson.location || 'Online'}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                          {lesson.isRegistered ? (
                            <>
                              <Button 
                                className="bg-teal hover:bg-teal/80"
                                onClick={() => window.open(lesson.joinUrl, '_blank')}
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Join Lesson
                              </Button>
                              <Button 
                                variant="outline" 
                                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                                onClick={() => handleUnregister(lesson.id)}
                              >
                                Unregister
                              </Button>
                            </>
                          ) : (
                            <Button 
                              className="bg-teal hover:bg-teal/80"
                              onClick={() => handleRegister(lesson.id)}
                              disabled={lesson.currentParticipants >= lesson.maxParticipants}
                            >
                              {lesson.currentParticipants >= lesson.maxParticipants ? 'Full' : 'Register'}
                            </Button>
                          )}
                          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No upcoming lessons</h3>
                <p className="text-gray-400 mb-4">Check back later for new live sessions</p>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Browse Past Lessons
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="space-y-4">
            {pastLessons.length > 0 ? pastLessons.map((lesson) => (
              <Card key={lesson.id} className="bg-gray-900 border-gray-800">
                <div className="grid md:grid-cols-4 gap-0">
                  {/* Thumbnail */}
                  <div className="md:col-span-1 relative">
                    <div className="aspect-video md:aspect-square relative overflow-hidden rounded-l-lg">
                      <Image
                        src={lesson.thumbnail || '/placeholder-lesson.jpg'}
                        alt={lesson.title}
                        fill
                        className="object-cover"
                      />
                      {lesson.hasRecording && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-3 p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{lesson.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{lesson.description}</p>
                      </div>

                      {/* Instructor */}
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={lesson.instructor?.avatar} />
                          <AvatarFallback className="bg-gray-700 text-gray-300">
                            {lesson.instructor?.name?.split(' ').map((n: string) => n[0]).join('') || 'I'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{lesson.instructor?.name}</p>
                          <p className="text-sm text-gray-400">{lesson.instructor?.bio}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(lesson.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{lesson.participants} attended</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{lesson.rating} rating</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-2">
                        {lesson.hasRecording ? (
                          <Button className="bg-teal hover:bg-teal/80" asChild>
                            <a href={lesson.recordingUrl} target="_blank" rel="noopener noreferrer">
                              <Play className="w-4 h-4 mr-2" />
                              Watch Recording
                            </a>
                          </Button>
                        ) : (
                          <Button disabled className="bg-gray-700 text-gray-500">
                            <Video className="w-4 h-4 mr-2" />
                            Recording Not Available
                          </Button>
                        )}
                        <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No past lessons</h3>
                <p className="text-gray-400 mb-4">Your attended lessons will appear here</p>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Browse Upcoming Lessons
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Main export with access control
export default function LessonsPage() {
  return (
    <AccessControlWrapper
      requiredPermission="canAccessLiveLessons"
      featureName="Live Lessons"
      upgradeMessage="Join live training sessions and interactive workshops with expert instructors to accelerate your learning."
    >
      <LessonsContent />
    </AccessControlWrapper>
  )
}
