"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Clock, Plus, Play, ChevronRight, BarChart3, ArrowRight, Star, Users, Award } from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/components/LMSAuth/AuthWrapper'
import { renderRichText } from '@/utilities/richTextRenderer'
import AccessControlWrapper from '@/components/AccessControlWrapper'

// Programs content component

function ProgramsContent() {
  const { user } = useAuth()
  const [programs, setPrograms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Fetch programs from API
  useEffect(() => {
    async function fetchPrograms() {
      if (!user?.id) return

      try {
        setIsLoading(true)
        const response = await fetch('/api/lms/programs?limit=20')
        const data = await response.json()

        if (response.ok) {
          // Transform programs data for display
          const transformedPrograms = data.docs?.map((program: any) => ({
            id: program.id,
            title: program.title,
            description: renderRichText(program.description),
            longDescription: renderRichText(program.longDescription || program.description),
            thumbnail: program.thumbnail?.url || '/placeholder.svg?height=200&width=300',
            instructor: {
              name: program.instructor?.name || 'Instructor',
              avatar: program.instructor?.avatar?.url || '/placeholder.svg?height=50&width=50',
              bio: program.instructor?.bio || 'Professional instructor'
            },
            totalLessons: program.lessonsCount || program.lessons?.length || 0,
            completedLessons: 0, // This would come from user progress data
            progress: 0, // This would come from user progress data
            duration: program.duration ? `${Math.floor(program.duration / 60)}h ${program.duration % 60}m` : 'TBD',
            difficulty: program.level || 'Beginner',
            rating: program.rating || 4.5,
            students: program.enrollmentCount || 0,
            price: program.price || 0,
            isEnrolled: false, // This would come from user enrollment data
            category: program.category?.name || 'General',
            skills: program.skills || [],
            lastWatched: null,
            slug: program.slug
          })) || []

          setPrograms(transformedPrograms)
        } else {
          console.error('Failed to fetch programs:', data.error)
        }
      } catch (error) {
        console.error('Error fetching programs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrograms()
  }, [user?.id])

  // Separate enrolled and available programs
  const enrolledPrograms = programs.filter(p => p.isEnrolled)
  const availablePrograms = programs.filter(p => !p.isEnrolled)
  const inProgressPrograms = enrolledPrograms.filter(p => p.progress > 0 && p.progress < 100)
  const completedPrograms = enrolledPrograms.filter(p => p.progress === 100)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Training Programs</h1>
          <p className="text-gray-400">Structured learning paths to master equestrian skills</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-teal/20 text-teal">
            {enrolledPrograms.length} enrolled
          </Badge>
          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
            {programs.length} total programs
          </Badge>
        </div>
      </div>

  // Fetch programs from API
  useEffect(() => {
    async function fetchPrograms() {
      if (!user?.id) return

      try {
        setIsLoading(true)
        const response = await fetch('/api/lms/programs?limit=20')
        const data = await response.json()

        if (response.ok) {
          // Transform programs data for display
          const transformedPrograms = data.docs?.map((program: any) => ({
            id: program.id,
            title: program.title,
            description: renderRichText(program.description),
            longDescription: renderRichText(program.longDescription || program.description),
            thumbnail: program.thumbnail?.url || '/placeholder.svg?height=200&width=300',
            instructor: {
              name: program.instructor?.name || 'Instructor',
              avatar: program.instructor?.avatar?.url || '/placeholder.svg?height=50&width=50',
              bio: program.instructor?.bio || 'Professional instructor'
            },
            totalLessons: program.lessonsCount || program.lessons?.length || 0,
            completedLessons: 0, // This would come from user progress data
            progress: 0, // This would come from user progress data
            duration: program.duration ? `${Math.floor(program.duration / 60)}h ${program.duration % 60}m` : 'TBD',
            difficulty: program.level || 'Beginner',
            rating: program.rating || 4.5,
            students: program.enrollmentCount || 0,
            price: program.price || 0,
            isEnrolled: false, // This would come from user enrollment data
            category: program.category?.name || 'General',
            skills: program.skills || [],
            lastWatched: null,
            slug: program.slug
          })) || []

          setPrograms(transformedPrograms)
        } else {
          console.error('Failed to fetch programs:', data.error)
        }
      } catch (error) {
        console.error('Error fetching programs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrograms()
  }, [user?.id])

  // Separate enrolled and available programs
  const enrolledPrograms = programs.filter(p => p.isEnrolled)
  const availablePrograms = programs.filter(p => !p.isEnrolled)
  const inProgressPrograms = enrolledPrograms.filter(p => p.progress > 0 && p.progress < 100)
  const completedPrograms = enrolledPrograms.filter(p => p.progress === 100)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Training Programs</h1>
          <p className="text-gray-400">Structured learning paths to master equestrian skills</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-teal/20 text-teal">
            {enrolledPrograms.length} enrolled
          </Badge>
          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
            {programs.length} total programs
          </Badge>
        </div>
      </div>

      {/* Continue Learning Section */}
      {inProgressPrograms.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Continue Learning</h2>
            <Button variant="ghost" className="text-teal hover:text-teal/80">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {inProgressPrograms.slice(0, 2).map((program) => (
              <Card key={program.id} className="bg-gradient-to-br from-teal/10 to-teal/5 border-teal/20 hover:border-teal/40 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={program.thumbnail}
                        alt={program.title}
                        width={120}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2">{program.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={program.instructor.avatar} />
                          <AvatarFallback className="text-xs bg-gray-700 text-gray-300">
                            {program.instructor?.name?.split(' ').map((n: string) => n[0]).join('') || 'I'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-400">{program.instructor.name}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white font-medium">{program.completedLessons}/{program.totalLessons} lessons</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Last watched {program.lastWatched}</span>
                          <Button size="sm" asChild className="bg-teal hover:bg-teal/80">
                            <Link href={`/dashboard/programs/${program.id}`}>
                              Continue <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Programs */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">All Programs</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card key={program.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200 group">
              <div className="relative">
                <Image
                  src={program.thumbnail}
                  alt={program.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-lg flex items-center justify-center">
                  <Button size="lg" className="bg-teal hover:bg-teal/80" asChild>
                    <Link href={`/dashboard/programs/${program.id}`}>
                      {program.isEnrolled ? (
                        <>
                          <Play className="w-6 h-6 mr-2" />
                          {program.progress > 0 ? 'Continue' : 'Start'} Program
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-6 h-6 mr-2" />
                          View Program
                        </>
                      )}
                    </Link>
                  </Button>
                </div>

                {/* Duration */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">
                  {program.duration}
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {program.isEnrolled && (
                    <Badge className="bg-teal text-white">Enrolled</Badge>
                  )}
                  {program.progress === 100 && (
                    <Badge className="bg-green-600 text-white">Completed</Badge>
                  )}
                </div>

                {/* Progress Bar for Enrolled Programs */}
                {program.isEnrolled && program.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 rounded-b-lg">
                    <div className="flex items-center justify-between text-xs text-white mb-1">
                      <span>{program.progress}% complete</span>
                      <span>{program.completedLessons}/{program.totalLessons} lessons</span>
                    </div>
                    <Progress value={program.progress} className="h-1" />
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-white line-clamp-2 mb-2">{program.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{program.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                      {program.category}
                    </Badge>
                    <Badge variant="outline" className={`border-gray-600 text-xs ${
                      program.difficulty === 'Beginner' ? 'text-green-400' :
                      program.difficulty === 'Intermediate' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {program.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={program.instructor.avatar} />
                        <AvatarFallback className="text-xs bg-gray-700 text-gray-300">
                          {program.instructor.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-400">{program.instructor.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{program.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{program.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{program.totalLessons} lessons</span>
                      </div>
                    </div>
                  </div>

                  {!program.isEnrolled && (
                    <div className="pt-2 border-t border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">${program.price}</span>
                        <Button size="sm" className="bg-teal hover:bg-teal/80">
                          Enroll Now
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-teal mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{enrolledPrograms.length}</p>
            <p className="text-sm text-gray-400">Enrolled Programs</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{inProgressPrograms.length}</p>
            <p className="text-sm text-gray-400">In Progress</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{completedPrograms.length}</p>
            <p className="text-sm text-gray-400">Completed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {enrolledPrograms.reduce((total, program) => {
                const hours = parseInt(program.duration.split('h')[0])
                const minutes = parseInt(program.duration.split('h')[1]?.split('m')[0] || '0')
                return total + hours + (minutes / 60)
              }, 0).toFixed(0)}h
            </p>
            <p className="text-sm text-gray-400">Total Content</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Main export with access control
export default function ProgramsPage() {
  return (
    <AccessControlWrapper
      requiredPermission="canAccessPrograms"
      featureName="Training Programs"
      upgradeMessage="Unlock structured learning paths and comprehensive training programs to accelerate your equestrian skills."
    >
      <ProgramsContent />
    </AccessControlWrapper>
  )
}
