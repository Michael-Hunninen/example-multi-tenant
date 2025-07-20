"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Clock, Search, BookOpen, Filter, ChevronRight, Play, Star, BarChart } from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/components/LMSAuth/AuthWrapper'
import { renderRichText } from '@/utilities/richTextRenderer'

// We'll fetch real video data from the API


export default function VideosPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const category = searchParams.get("category") || ""
  
  const [videos, setVideos] = useState<any[]>([])
  const [categories, setCategories] = useState(["All"])
  const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = useState(query)
  const [sortBy, setSortBy] = useState("newest")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]
  
  // Fetch videos from API
  useEffect(() => {
    async function fetchVideos() {
      if (!user?.id) return
      
      try {
        setIsLoading(true)
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12'
        })
        
        if (selectedCategory !== 'All') params.append('category', selectedCategory)
        if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty)
        if (searchValue) params.append('search', searchValue)
        
        const response = await fetch(`/api/lms/videos?${params}`)
        const data = await response.json()
        
        if (response.ok) {
          setVideos(data.docs || [])
          setTotalPages(data.totalPages || 1)
          
          // Extract unique categories from videos
          const uniqueCategories = ['All', ...new Set(data.docs?.map((video: any) => video.category?.name).filter(Boolean) || [])] as string[]
          setCategories(uniqueCategories)
        } else {
          console.error('Failed to fetch videos:', data.error)
        }
      } catch (error) {
        console.error('Error fetching videos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchVideos()
  }, [user?.id, selectedCategory, selectedDifficulty, searchValue, currentPage])

  // Transform videos for display
  const transformedVideos = videos.map((video: any) => ({
    id: video.id,
    title: video.title,
    description: renderRichText(video.description),
    duration: video.duration ? `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, '0')}` : 'Unknown',
    thumbnail: video.thumbnail?.url || '/placeholder.svg?height=200&width=300',
    category: video.category?.name || 'General',
    difficulty: video.difficulty || 'Beginner',
    instructor: video.instructor?.name || 'Instructor',
    rating: video.rating || 4.5,
    views: video.views || 0,
    isNew: video.createdAt ? new Date(video.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : false,
    isPremium: video.isPremium || false,
    slug: video.slug
  }))
  
  // Sort videos
  const sortedVideos = [...transformedVideos].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.isNew ? 1 : -1
      case "oldest":
        return a.isNew ? 1 : -1
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "views":
        return (b.views || 0) - (a.views || 0)
      case "duration":
        const getDurationMinutes = (duration: string) => {
          const [minutes, seconds] = duration.split(":").map(Number)
          return minutes + seconds / 60
        }
        return getDurationMinutes(a.duration || "0:00") - getDurationMinutes(b.duration || "0:00")
      default:
        return 0
    }
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd update the URL and trigger a new search
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Video Library</h1>
          <p className="text-gray-400">Explore our comprehensive collection of equestrian training videos</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-teal/20 text-teal">
            {sortedVideos.length} videos
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
            </form>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVideos.map((video) => (
          <Card key={video.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200 group">
            <div className="relative">
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-lg flex items-center justify-center">
                <Button size="lg" className="bg-teal hover:bg-teal/80" asChild>
                  <Link href={`/dashboard/videos/${video.id}`}>
                    <Play className="w-6 h-6 mr-2" />
                    Watch Now
                  </Link>
                </Button>
              </div>

              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">
                {video.duration}
              </div>

              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-2">
                {video.isNew && (
                  <Badge className="bg-teal text-white">New</Badge>
                )}
                {video.isPremium && (
                  <Badge className="bg-yellow-600 text-white">Premium</Badge>
                )}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-white line-clamp-2 mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{video.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                    {video.category}
                  </Badge>
                  <Badge variant="outline" className={`border-gray-600 text-xs ${
                    video.difficulty === 'Beginner' ? 'text-green-400' :
                    video.difficulty === 'Intermediate' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {video.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-xs bg-gray-700 text-gray-300">
                        {video.instructor.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-400">{video.instructor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{video.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart className="w-4 h-4" />
                    <span>{video.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button 
            variant="outline" 
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* No Results */}
      {sortedVideos.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No videos found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
          <Button
            onClick={() => {
              setSearchValue("")
              setSelectedCategory("All")
              setSelectedDifficulty("All")
            }}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
