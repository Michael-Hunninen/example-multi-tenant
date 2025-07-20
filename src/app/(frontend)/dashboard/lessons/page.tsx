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

// We'll fetch real lessons data from the API

export default function LessonsPage() {
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
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-teal data-[state=active]:text-white">
            Upcoming Lessons ({upcomingLessons.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-teal data-[state=active]:text-white">
            Past Lessons ({pastLessons.length})
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Lessons */}
        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-6">
            {upcomingLessons.map((lesson) => (
              <Card key={lesson.id} className={`bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200 ${
                isLessonToday(lesson.date) ? 'ring-2 ring-teal/50' : ''
              }`}>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Thumbnail */}
                  <div className="relative">
                    <Image
                      src={lesson.thumbnail}
                      alt={lesson.title}
                      width={300}
                      height={200}
                      className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <Badge className={`${
                        lesson.type === 'Live Session' ? 'bg-red-600' :
                        lesson.type === 'Workshop' ? 'bg-blue-600' :
                        'bg-purple-600'
                      } text-white`}>
                        {lesson.type}
                      </Badge>
                      {isLessonToday(lesson.date) && (
                        <Badge className="bg-teal text-white">Today</Badge>
                      )}
                      {isLessonSoon(lesson.date, lesson.time) && (
                        <Badge className="bg-yellow-600 text-white animate-pulse">Starting Soon</Badge>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">
                      {lesson.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{lesson.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{lesson.description}</p>
                      </div>

                      {/* Instructor */}
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={lesson.instructor.avatar} />
                          <AvatarFallback className="bg-gray-700 text-gray-300">
                            {lesson.instructor?.name?.split(' ').map((n: string) => n[0]).join('') || 'I'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{lesson.instructor.name}</p>
                          <p className="text-sm text-gray-400">{lesson.instructor.bio}</p>
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
                          <span>{lesson.currentParticipants}/{lesson.maxParticipants}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <BookOpen className="w-4 h-4" />
                          <span>{lesson.category}</span>
                        </div>
                      </div>

                      {/* Progress Bar for Participants */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Participants</span>
                          <span className="text-white">{lesson.currentParticipants}/{lesson.maxParticipants}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-teal h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(lesson.currentParticipants / lesson.maxParticipants) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-2">
                        {lesson.isRegistered ? (
                          <>
                            {isLessonSoon(lesson.date, lesson.time) ? (
                              <Button className="bg-teal hover:bg-teal/80" asChild>
                                <a href={lesson.meetingLink} target="_blank" rel="noopener noreferrer">
                                  <Video className="w-4 h-4 mr-2" />
                                  Join Now
                                </a>
                              </Button>
                            ) : (
                              <Button className="bg-teal hover:bg-teal/80" disabled>
                                <Calendar className="w-4 h-4 mr-2" />
                                Registered
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              onClick={() => handleUnregister(lesson.id)}
                              className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            >
                              Unregister
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={() => handleRegister(lesson.id)}
                            className="bg-teal hover:bg-teal/80"
                            disabled={lesson.currentParticipants >= lesson.maxParticipants}
                          >
                            {lesson.currentParticipants >= lesson.maxParticipants ? 'Full' : 'Register'}
                          </Button>
                        )}
                        <Button variant="ghost" className="text-gray-400 hover:text-teal">
                          Add to Calendar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {upcomingLessons.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No upcoming lessons</h3>
                <p className="text-gray-400 mb-4">Check back soon for new live sessions and workshops</p>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Browse Programs
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Past Lessons */}
        <TabsContent value="past" className="mt-6">
          <div className="space-y-6">
            {pastLessons.map((lesson: any) => (
              <Card key={lesson.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Thumbnail */}
                  <div className="relative">
                    <Image
                      src={lesson.thumbnail}
                      alt={lesson.title}
                      width={300}
                      height={200}
                      className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    />
                    {lesson.hasRecording && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-t-lg md:rounded-l-lg md:rounded-t-none opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge className={`${
                        lesson.type === 'Live Session' ? 'bg-red-600' :
                        lesson.type === 'Workshop' ? 'bg-blue-600' :
                        'bg-purple-600'
                      } text-white`}>
                        {lesson.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">
                      {lesson.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{lesson.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{lesson.description}</p>
                      </div>

                      {/* Instructor */}
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={lesson.instructor.avatar} />
                          <AvatarFallback className="bg-gray-700 text-gray-300">
                            {lesson.instructor?.name?.split(' ').map((n: string) => n[0]).join('') || 'I'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{lesson.instructor.name}</p>
                          <p className="text-sm text-gray-400">{lesson.instructor.bio}</p>
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
            ))}

            {pastLessons.length === 0 && (
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
