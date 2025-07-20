"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Clock, Play, ChevronLeft, ChevronRight, Star, Users, Award, CheckCircle, Lock, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock program data - replace with actual API calls
const mockProgramData = {
  "1": {
    id: "1",
    title: "Complete Barrel Racing Mastery",
    description: "Master the art of barrel racing with comprehensive training from beginner to advanced techniques.",
    longDescription: "This comprehensive program takes you through every aspect of barrel racing, from basic fundamentals to advanced competition strategies. You'll learn proper approach angles, turn techniques, speed control, and mental preparation for competition. Perfect for riders looking to improve their times and compete at higher levels.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    instructor: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Professional barrel racer with over 15 years of competition experience. Multiple world champion and trainer of champions.",
      credentials: ["NBHA World Champion", "Professional Rodeo Cowgirls Association", "Certified Instructor"]
    },
    totalLessons: 12,
    completedLessons: 8,
    progress: 67,
    duration: "8h 30m",
    difficulty: "Intermediate",
    rating: 4.8,
    students: 1250,
    reviews: 89,
    price: 199,
    isEnrolled: true,
    category: "Barrel Racing",
    skills: ["Speed Control", "Turn Techniques", "Pattern Recognition", "Competition Prep"],
    lastWatched: "2 days ago",
    enrollmentDate: "2024-01-15",
    lessons: [
      {
        id: "1",
        title: "Introduction to Barrel Racing",
        description: "Overview of barrel racing fundamentals and what you'll learn in this program",
        duration: "12:30",
        isCompleted: true,
        isLocked: false,
        videoUrl: "/video1.mp4"
      },
      {
        id: "2", 
        title: "Understanding Your Horse",
        description: "Building the foundation for successful barrel racing through horse psychology",
        duration: "18:45",
        isCompleted: true,
        isLocked: false,
        videoUrl: "/video2.mp4"
      },
      {
        id: "3",
        title: "Basic Pattern Work",
        description: "Learning the standard barrel racing pattern and basic techniques",
        duration: "22:15",
        isCompleted: true,
        isLocked: false,
        videoUrl: "/video3.mp4"
      },
      {
        id: "4",
        title: "Approach Angles and Speed",
        description: "Mastering the optimal approach to each barrel for maximum efficiency",
        duration: "25:30",
        isCompleted: true,
        isLocked: false,
        videoUrl: "/video4.mp4"
      },
      {
        id: "5",
        title: "Turn Mechanics Deep Dive",
        description: "Advanced techniques for tight, fast turns around each barrel",
        duration: "28:45",
        isCompleted: true,
        isLocked: false,
        videoUrl: "/video5.mp4"
      },
      {
        id: "6",
        title: "Rate and Collection",
        description: "Learning when and how to rate your horse for optimal performance",
        duration: "20:15",
        isCompleted: true,
        isLocked: false,
        videoUrl: "/video6.mp4"
      },
      {
        id: "7",
        title: "Exit Strategies",
        description: "Maximizing speed on the way home while maintaining control",
        duration: "19:30",
        isCompleted: true,
        isLocked: false,
        videoUrl: "/video7.mp4"
      },
      {
        id: "8",
        title: "Common Mistakes and Fixes",
        description: "Identifying and correcting the most common barrel racing errors",
        duration: "24:45",
        isCompleted: true,
        isLocked: false,
        videoUrl: "/video8.mp4"
      },
      {
        id: "9",
        title: "Mental Preparation",
        description: "Developing the mental game for consistent competition performance",
        duration: "16:20",
        isCompleted: false,
        isLocked: false,
        videoUrl: "/video9.mp4"
      },
      {
        id: "10",
        title: "Equipment and Tack",
        description: "Choosing the right equipment for optimal barrel racing performance",
        duration: "14:15",
        isCompleted: false,
        isLocked: false,
        videoUrl: "/video10.mp4"
      },
      {
        id: "11",
        title: "Competition Strategies",
        description: "Advanced strategies for competing at rodeos and barrel racing events",
        duration: "26:30",
        isCompleted: false,
        isLocked: false,
        videoUrl: "/video11.mp4"
      },
      {
        id: "12",
        title: "Advanced Techniques & Mastery",
        description: "Professional-level techniques for serious competitors",
        duration: "22:45",
        isCompleted: false,
        isLocked: false,
        videoUrl: "/video12.mp4"
      }
    ]
  }
}

const mockReviews = [
  {
    id: "1",
    user: "Sarah Johnson",
    avatar: "/placeholder.svg",
    rating: 5,
    content: "This program completely transformed my barrel racing. Jane's teaching style is incredible and the progression is perfect. Highly recommend!",
    date: "2 weeks ago"
  },
  {
    id: "2",
    user: "Mike Rodriguez", 
    avatar: "/placeholder.svg",
    rating: 5,
    content: "The turn mechanics section alone was worth the entire program cost. My times have improved by over 2 seconds!",
    date: "1 month ago"
  },
  {
    id: "3",
    user: "Lisa Chen",
    avatar: "/placeholder.svg", 
    rating: 4,
    content: "Great content and well structured. Would love to see more advanced competition strategies in future updates.",
    date: "3 weeks ago"
  }
]

export default function ProgramDetailPage() {
  const params = useParams()
  const router = useRouter()
  const programId = Array.isArray(params.programId) ? params.programId[0] : params.programId as string
  
  const [program, setProgram] = useState(mockProgramData[programId as keyof typeof mockProgramData] || null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("lessons")

  if (!program) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading program...</p>
        </div>
      </div>
    )
  }

  const nextLesson = program.lessons.find(lesson => !lesson.isCompleted)
  const completedCount = program.lessons.filter(lesson => lesson.isCompleted).length

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-400">
        <Link href="/dashboard" className="hover:text-teal">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/dashboard/programs" className="hover:text-teal">Programs</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white">{program.title}</span>
      </nav>

      {/* Program Header */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Section */}
          <Card className="bg-gray-900 border-gray-800 overflow-hidden">
            <div className="relative">
              <Image
                src={program.thumbnail}
                alt={program.title}
                width={600}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                {program.isEnrolled && nextLesson ? (
                  <Button size="lg" className="bg-teal hover:bg-teal/80" asChild>
                    <Link href={`/dashboard/videos/${nextLesson.id}`}>
                      <Play className="w-8 h-8 mr-2" />
                      {program.progress > 0 ? 'Continue Learning' : 'Start Program'}
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="bg-teal hover:bg-teal/80">
                    <BookOpen className="w-8 h-8 mr-2" />
                    Enroll Now - ${program.price}
                  </Button>
                )}
              </div>
              <div className="absolute bottom-4 right-4 bg-black/80 text-white text-sm px-3 py-1 rounded">
                {program.duration}
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{program.title}</h1>
                  <p className="text-gray-300 leading-relaxed">{program.longDescription}</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{program.rating} ({program.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{program.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{program.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{program.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    {program.category}
                  </Badge>
                  <Badge variant="outline" className={`border-gray-600 ${
                    program.difficulty === 'Beginner' ? 'text-green-400' :
                    program.difficulty === 'Intermediate' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {program.difficulty}
                  </Badge>
                </div>

                {program.isEnrolled && (
                  <div className="bg-teal/10 border border-teal/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Your Progress</span>
                      <span className="text-teal font-medium">{completedCount}/{program.totalLessons} lessons</span>
                    </div>
                    <Progress value={program.progress} className="h-2 mb-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Enrolled on {new Date(program.enrollmentDate).toLocaleDateString()}</span>
                      <span className="text-teal">{program.progress}% complete</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructor Info */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={program.instructor.avatar} />
                  <AvatarFallback className="bg-gray-700 text-gray-300 text-lg">
                    {program.instructor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{program.instructor.name}</h3>
                  <p className="text-gray-400 mb-3">{program.instructor.bio}</p>
                  <div className="space-y-1">
                    {program.instructor.credentials.map((credential, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 bg-gray-800 text-gray-300">
                        {credential}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Follow Instructor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Program Stats */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Program Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Lessons</span>
                <span className="text-white font-medium">{program.totalLessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Duration</span>
                <span className="text-white font-medium">{program.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Difficulty</span>
                <Badge variant="outline" className={`border-gray-600 ${
                  program.difficulty === 'Beginner' ? 'text-green-400' :
                  program.difficulty === 'Intermediate' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {program.difficulty}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Students</span>
                <span className="text-white font-medium">{program.students.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">{program.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills You'll Learn */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Skills You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {program.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {!program.isEnrolled && (
            <Card className="bg-gradient-to-br from-teal/20 to-teal/5 border-teal/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">${program.price}</div>
                <p className="text-gray-300 mb-4">One-time payment • Lifetime access</p>
                <Button className="w-full bg-teal hover:bg-teal/80 mb-3">
                  Enroll Now
                </Button>
                <p className="text-xs text-gray-400">30-day money-back guarantee</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-gray-800">
          <TabsTrigger value="lessons" className="data-[state=active]:bg-teal data-[state=active]:text-white">
            Lessons ({program.totalLessons})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-teal data-[state=active]:text-white">
            Reviews ({program.reviews})
          </TabsTrigger>
          <TabsTrigger value="about" className="data-[state=active]:bg-teal data-[state=active]:text-white">
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="space-y-4">
                {program.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        lesson.isCompleted 
                          ? 'bg-teal text-white' 
                          : lesson.isLocked 
                            ? 'bg-gray-700 text-gray-500'
                            : 'bg-gray-700 text-gray-300'
                      }`}>
                        {lesson.isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : lesson.isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${lesson.isLocked ? 'text-gray-500' : 'text-white'}`}>
                          {lesson.title}
                        </h4>
                        <p className={`text-sm ${lesson.isLocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {lesson.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${lesson.isLocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {lesson.duration}
                      </span>
                      {program.isEnrolled && !lesson.isLocked && (
                        <Button size="sm" variant="ghost" className="text-teal hover:bg-teal/10" asChild>
                          <Link href={`/dashboard/videos/${lesson.id}`}>
                            <Play className="w-4 h-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback className="bg-gray-700 text-gray-300">
                        {review.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white">{review.user}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                      <p className="text-gray-300">{review.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About This Program</h3>
                  <p className="text-gray-300 leading-relaxed">{program.longDescription}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">What You'll Learn</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {program.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                        <span className="text-gray-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Program Requirements</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                      Basic riding experience recommended
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                      Access to a horse suitable for barrel racing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                      Willingness to practice and apply techniques
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
