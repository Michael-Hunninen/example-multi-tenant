"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Clock, Users, Star, Play, ChevronRight, Trophy, Target, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from '@/components/LMSAuth/AuthWrapper'
import AccessControlWrapper from '@/components/AccessControlWrapper'

// Programs content component
function ProgramsContent() {
  const { user } = useAuth()
  const [programs, setPrograms] = useState<any[]>([])
  const [enrolledPrograms, setEnrolledPrograms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch programs from API
  useEffect(() => {
    async function fetchPrograms() {
      if (!user?.id) return
      
      try {
        setIsLoading(true)
        const [allRes, enrolledRes] = await Promise.all([
          fetch('/api/lms/programs?limit=20'),
          fetch('/api/lms/programs?enrolled=true&limit=10')
        ])
        
        const [allData, enrolledData] = await Promise.all([
          allRes.json(),
          enrolledRes.json()
        ])
        
        if (allRes.ok) {
          setPrograms(allData.docs || [])
        }
        
        if (enrolledRes.ok) {
          setEnrolledPrograms(enrolledData.docs || [])
        }
      } catch (error) {
        console.error('Error fetching programs:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPrograms()
  }, [user?.id])

  const handleEnroll = (programId: string) => {
    // Add to enrolled programs
    const program = programs.find(p => p.id === programId)
    if (program) {
      setEnrolledPrograms(prev => [...prev, { ...program, progress: 0, enrolledAt: new Date().toISOString() }])
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-600'
      case 'intermediate': return 'bg-yellow-600'
      case 'advanced': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="space-y-6">
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
            {programs.length} available
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900 border-gray-800">
          <TabsTrigger value="enrolled" className="data-[state=active]:bg-teal data-[state=active]:text-black">
            My Programs
          </TabsTrigger>
          <TabsTrigger value="browse" className="data-[state=active]:bg-teal data-[state=active]:text-black">
            Browse All
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading programs...</p>
              </div>
            ) : enrolledPrograms.length > 0 ? (
              enrolledPrograms.map((program) => (
                <Card key={program.id} className="bg-gray-900 border-gray-800 hover:border-teal/50 transition-colors">
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <Image
                        src={program.thumbnail || '/placeholder-program.jpg'}
                        alt={program.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={`${getDifficultyColor(program.difficulty)} text-white`}>
                          {program.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">{program.title}</CardTitle>
                    <CardDescription className="text-gray-400 line-clamp-2">
                      {program.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-teal">{program.progress || 0}%</span>
                      </div>
                      <Progress value={program.progress || 0} className="h-2 bg-gray-800">
                        <div 
                          className="h-full bg-teal transition-all duration-300 rounded-full" 
                          style={{ width: `${program.progress || 0}%` }}
                        />
                      </Progress>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{program.lessonCount} lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(program.duration)}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button className="w-full bg-teal hover:bg-teal/80" asChild>
                      <Link href={`/dashboard/programs/${program.id}`}>
                        Continue Learning
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No enrolled programs</h3>
                <p className="text-gray-400 mb-4">Start your learning journey by enrolling in a program</p>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Browse Programs
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="browse" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <Card key={program.id} className="bg-gray-900 border-gray-800 hover:border-teal/50 transition-colors">
                <div className="relative">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <Image
                      src={program.thumbnail || '/placeholder-program.jpg'}
                      alt={program.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getDifficultyColor(program.difficulty)} text-white`}>
                        {program.difficulty}
                      </Badge>
                    </div>
                    {program.featured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-600 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">{program.title}</CardTitle>
                  <CardDescription className="text-gray-400 line-clamp-2">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Instructor */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{program.instructor?.name}</p>
                      <p className="text-xs text-gray-400">{program.instructor?.title}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{program.lessonCount} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(program.duration)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{program.enrolledCount} enrolled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{program.rating} rating</span>
                    </div>
                  </div>

                  {/* Price */}
                  {program.price && (
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-teal">${program.price}</span>
                      {program.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">${program.originalPrice}</span>
                      )}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="pt-0 space-y-2">
                  {enrolledPrograms.some(ep => ep.id === program.id) ? (
                    <Button className="w-full bg-teal hover:bg-teal/80" asChild>
                      <Link href={`/dashboard/programs/${program.id}`}>
                        Continue Learning
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button 
                        className="w-full bg-teal hover:bg-teal/80"
                        onClick={() => handleEnroll(program.id)}
                      >
                        Enroll Now
                      </Button>
                      <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800" asChild>
                        <Link href={`/dashboard/programs/${program.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-teal mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {enrolledPrograms.filter(p => (p.progress || 0) === 100).length}
            </p>
            <p className="text-sm text-gray-400">Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-teal mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{enrolledPrograms.length}</p>
            <p className="text-sm text-gray-400">Enrolled</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-teal mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {enrolledPrograms.reduce((acc, program) => acc + (program.duration || 0), 0).toFixed(0)}h
            </p>
            <p className="text-sm text-gray-400">Total Content</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-teal mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {enrolledPrograms.length > 0 
                ? Math.round(enrolledPrograms.reduce((acc, p) => acc + (p.progress || 0), 0) / enrolledPrograms.length)
                : 0}%
            </p>
            <p className="text-sm text-gray-400">Avg Progress</p>
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
