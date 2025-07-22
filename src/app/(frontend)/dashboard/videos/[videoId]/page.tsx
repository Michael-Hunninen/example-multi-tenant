"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Bookmark, MessageCircle, Loader2, Calendar, Clock, User, ChevronLeft, ChevronRight, Play, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/components/LMSAuth/AuthWrapper'
import { renderRichText } from '@/utilities/richTextRenderer'

// Interface for video stats
interface VideoStats {
  views: number
  likes: number
  rating: number
  duration: string
  commentsCount: number
  totalWatchTime: number
  completionRate: number
  uploadDate: string
  lastViewed: number | null
  userHasLiked: boolean
  userHasBookmarked: boolean
}

// Interface for comments
interface Comment {
  id: string
  user: string
  avatar: string | null
  content: string
  timestamp: string
  likes: number
  createdAt: string
}

export default function VideoDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const videoId = Array.isArray(params.videoId) ? params.videoId[0] : params.videoId as string
  
  const [video, setVideo] = useState<any>(null)
  const [videoStats, setVideoStats] = useState<VideoStats | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [savedProgress, setSavedProgress] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [progressSaveTimeout, setProgressSaveTimeout] = useState<NodeJS.Timeout | null>(null)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)
  const [progressLoaded, setProgressLoaded] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!videoId) return
      
      try {
        setIsLoading(true)
        const response = await fetch(`/api/lms/videos/${videoId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch video')
        }
        
        const videoData = await response.json()
        setVideo({
          ...videoData,
          description: renderRichText(videoData.description),
          longDescription: renderRichText(videoData.description),
          duration: videoData.duration ? `${Math.floor(videoData.duration / 60)}:${String(videoData.duration % 60).padStart(2, '0')}` : 'Unknown',
          instructor: {
            name: videoData.instructor?.name || 'Instructor',
            bio: videoData.instructor?.bio || 'Professional instructor',
            avatar: videoData.instructor?.avatar?.url || '/placeholder.svg?height=100&width=100'
          },
          thumbnail: videoData.thumbnail?.url || '/placeholder.svg?height=400&width=700',
          videoUrl: videoData.videoUrl || videoData.videoFile?.url || null,
          category: videoData.category?.name || 'General',
          rating: 4.8, // Mock rating for now
          views: 1250, // Mock views for now
          likes: 89, // Mock likes for now
          isBookmarked: false,
          uploadDate: new Date(videoData.createdAt).toLocaleDateString(),
          tags: videoData.tags?.map((tag: any) => tag.tag) || [],
          chapters: videoData.chapters || []
        })
        setIsBookmarked(false)
      } catch (error) {
        console.error('Error fetching video:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideoData()
  }, [videoId])

  useEffect(() => {
    const fetchVideoStats = async () => {
      if (!videoId || !user?.id) {
        console.log('Skipping stats fetch - missing videoId or user.id:', { videoId, userId: user?.id })
        return
      }
      
      try {
        setStatsLoading(true)
        console.log('Fetching video stats for:', videoId, 'user:', user.id)
        const response = await fetch(`/api/lms/videos/${videoId}/stats?userId=${user.id}`)
        
        console.log('Stats API response status:', response.status)
        if (response.ok) {
          const stats = await response.json()
          console.log('Stats API response data:', stats)
          setVideoStats(stats)
          // Set bookmark status from API
          setIsBookmarked(stats.userHasBookmarked || false)
          // Load saved progress
          if (stats.lastViewed && stats.lastViewed > 0) {
            setSavedProgress(stats.lastViewed)
            console.log('✅ Saved progress found:', stats.lastViewed, 'seconds')
          } else {
            setSavedProgress(0)
            console.log('❌ No saved progress found, starting from beginning. lastViewed:', stats.lastViewed)
          }
          setProgressLoaded(true)
          console.log('Progress loaded flag set to true')
        } else {
          console.error('Stats API failed with status:', response.status)
          const errorText = await response.text()
          console.error('Stats API error response:', errorText)
        }
      } catch (error) {
        console.error('Error fetching video stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchVideoStats()
  }, [videoId, user?.id])

  useEffect(() => {
    const fetchComments = async () => {
      if (!videoId) return
      
      try {
        setCommentsLoading(true)
        const response = await fetch(`/api/lms/videos/${videoId}/comments?limit=10`)
        
        if (response.ok) {
          const data = await response.json()
          setComments(data.comments || [])
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setCommentsLoading(false)
      }
    }

    fetchComments()
  }, [videoId])

  // Apply saved progress when both video and progress data are ready
  useEffect(() => {
    if (videoElement && progressLoaded) {
      console.log('Applying saved progress. Video ready:', !!videoElement, 'Progress loaded:', progressLoaded, 'Saved progress:', savedProgress)
      if (savedProgress > 0) {
        console.log('Setting video currentTime to:', savedProgress, 'seconds')
        videoElement.currentTime = savedProgress
        setCurrentTime(savedProgress)
      } else {
        console.log('No saved progress, starting from beginning')
        setCurrentTime(0)
      }
    }
  }, [videoElement, progressLoaded, savedProgress])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal mx-auto mb-4" />
          <p className="text-white">Loading video...</p>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-white mb-4">Video not found</p>
          <Button onClick={() => router.push('/dashboard/videos')} className="bg-teal hover:bg-teal/90">
            Back to Videos
          </Button>
        </div>
      </div>
    )
  }

  const handleBookmark = async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/lms/videos/${videoId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          bookmarked: !isBookmarked
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        // Update bookmark state from API response
        setIsBookmarked(result.bookmarked)
        
        // Update video stats if available
        if (videoStats) {
          setVideoStats({
            ...videoStats,
            userHasBookmarked: result.bookmarked
          })
        }
      } else {
        console.error('Failed to bookmark video')
      }
    } catch (error) {
      console.error('Error bookmarking video:', error)
    }
  }



  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: video?.title || 'Check out this video',
          text: `Watch "${video?.title}" on JG Performance Horses`,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        // You could show a toast notification here
        console.log('Video link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing video:', error)
    }
  }

  const handleFollow = async () => {
    if (!user?.id || !video?.instructor) return
    
    try {
      const response = await fetch(`/api/lms/instructors/${video.instructor.id}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id
        })
      })
      
      if (response.ok) {
        // You could add a state for following status
        console.log('Successfully followed instructor')
      } else {
        console.error('Failed to follow instructor')
      }
    } catch (error) {
      console.error('Error following instructor:', error)
    }
  }

  const saveVideoProgress = async (currentTime: number) => {
    if (!user?.id || !videoId || currentTime < 5) return
    
    try {
      const response = await fetch(`/api/lms/videos/${videoId}/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'progress',
          userId: user.id,
          currentTime,
          duration: videoDuration
        })
      })
      
      if (!response.ok) {
        console.error('Failed to save video progress')
      }
    } catch (error) {
      console.error('Error saving video progress:', error)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user?.id || isSubmittingComment) return
    
    try {
      setIsSubmittingComment(true)
      console.log('Submitting comment:', {
        videoId,
        userId: user.id,
        contentLength: newComment.trim().length,
        url: `/api/lms/videos/${videoId}/comments`
      })
      
      const response = await fetch(`/api/lms/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newComment.trim(),
          userId: user.id
        })
      })
      
      console.log('Comment API response:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
      })
      
      if (response.ok) {
        const newCommentData = await response.json()
        setComments(prev => [newCommentData, ...prev])
        setNewComment('')
        // Update video stats to reflect new comment count
        if (videoStats) {
          setVideoStats({
            ...videoStats,
            commentsCount: videoStats.commentsCount + 1
          })
        }
      } else {
        // Get the actual error message from the server
        let errorData
        let responseText = ''
        try {
          responseText = await response.text()
          errorData = JSON.parse(responseText)
        } catch (parseError) {
          errorData = { error: 'Failed to parse error response', responseText }
        }
        
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          error: errorData.error || errorData.message || 'Unknown error',
          url: response.url,
          responseText: responseText.substring(0, 200),
          headers: Object.fromEntries(response.headers.entries())
        }
        
        console.error('Failed to submit comment:', errorDetails)
        console.error('Full error data:', errorData)
      }
    } catch (error) {
      const err = error as Error
      console.error('Network/Fetch error submitting comment:', {
        error: err.message || String(error),
        name: err.name || 'Unknown',
        stack: err.stack?.substring(0, 300) || 'No stack trace',
        videoId,
        userId: user?.id,
        url: `/api/lms/videos/${videoId}/comments`
      })
      console.error('Full error object:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-400">
        <Link href="/dashboard" className="hover:text-teal">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/dashboard/videos" className="hover:text-teal">Videos</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white">{video.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card className="bg-gray-900 border-gray-800 overflow-hidden">
            <div className="relative aspect-video bg-black">
              {!isPlaying ? (
                // Thumbnail with play button
                <>
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Button 
                      size="lg" 
                      className="bg-teal hover:bg-teal/80" 
                      onClick={() => {
                        if (video.videoUrl) {
                          setIsPlaying(true)
                        } else {
                          alert('No video source available. Please upload a video file or add a video URL.')
                        }
                      }}
                    >
                      <Play className="w-8 h-8 mr-2" />
                      Play Video
                    </Button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/80 text-white text-sm px-3 py-1 rounded">
                    {video.duration}
                  </div>
                </>
              ) : (
                // Actual video player
                <>
                  {video.videoUrl ? (
                    <video
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      onLoadedMetadata={(e) => {
                        const videoEl = e.target as HTMLVideoElement
                        setVideoElement(videoEl)
                        setVideoDuration(videoEl.duration)
                        console.log('Video loaded. Duration:', videoEl.duration)
                      }}
                      onTimeUpdate={(e) => {
                        const videoElement = e.target as HTMLVideoElement
                        const currentTime = videoElement.currentTime
                        setCurrentTime(currentTime)
                        
                        // Save progress periodically (debounced)
                        if (progressSaveTimeout) {
                          clearTimeout(progressSaveTimeout)
                        }
                        
                        const timeout = setTimeout(() => {
                          saveVideoProgress(currentTime)
                        }, 2000) // Save every 2 seconds of watching
                        
                        setProgressSaveTimeout(timeout)
                      }}
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                      <source src={video.videoUrl} type="video/webm" />
                      <source src={video.videoUrl} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center">
                        <p className="mb-4">No video source available</p>
                        <Button 
                          onClick={() => setIsPlaying(false)}
                          className="bg-teal hover:bg-teal/80"
                        >
                          Back to Thumbnail
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>

          {/* Video Info */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {video.views.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(video.uploadDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {video.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    {video.category}
                  </Badge>
                  <Badge variant="outline" className={`border-gray-600 ${
                    video.difficulty === 'Beginner' ? 'text-green-400' :
                    video.difficulty === 'Intermediate' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {video.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={`${isBookmarked ? 'border-teal-400 text-teal-400 bg-teal-400/10' : 'border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300'}`}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {isBookmarked ? 'Saved' : 'Save'}
                </Button>

              </div>
            </div>

            {/* Instructor Info */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={video.instructor.avatar} />
                    <AvatarFallback className="bg-gray-700 text-gray-300">
                      {video.instructor.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{video.instructor.name}</h3>
                    <p className="text-sm text-gray-400">{video.instructor.bio}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleFollow}
                    className="border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300"
                  >
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-gray-800">
              <TabsTrigger value="description" className="data-[state=active]:bg-teal data-[state=active]:text-white">
                Description
              </TabsTrigger>
              <TabsTrigger value="chapters" className="data-[state=active]:bg-teal data-[state=active]:text-white">
                Chapters
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-teal data-[state=active]:text-white">
                Comments ({comments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <p className="text-gray-300 leading-relaxed mb-4">{video.longDescription}</p>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chapters" className="mt-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {video.chapters.map((chapter: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{chapter.title}</h4>
                            <p className="text-sm text-gray-400">{chapter.time}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-teal hover:bg-teal/10">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="mt-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  {/* Comment Form */}
                  {user && (
                    <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                      <div className="flex gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={(user as any).avatar || undefined} />
                          <AvatarFallback className="bg-teal-400/20 text-teal-400">
                            {(user.name || user.email)?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts about this video..."
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                            rows={3}
                          />
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm text-gray-400">
                              {newComment.length}/500 characters
                            </span>
                            <Button
                              onClick={handleSubmitComment}
                              disabled={!newComment.trim() || isSubmittingComment || newComment.length > 500}
                              className="bg-teal-400 hover:bg-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSubmittingComment ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Posting...
                                </>
                              ) : (
                                'Post Comment'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {commentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500 mx-auto mb-2"></div>
                        <p className="text-gray-400 text-sm">Loading comments...</p>
                      </div>
                    </div>
                  ) : comments.length > 0 ? (
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={comment.avatar || undefined} />
                            <AvatarFallback className="bg-gray-700 text-gray-300">
                              {comment.user.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-white">{comment.user}</h4>
                              <span className="text-sm text-gray-400">{comment.timestamp}</span>
                            </div>
                            <p className="text-gray-300 mb-2">{comment.content}</p>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-teal p-0">
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 mb-2">No comments yet</p>
                      <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">


          {/* Video Stats */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Video Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
                </div>
              ) : videoStats ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{videoStats.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Views</span>
                    <span className="text-white font-medium">{videoStats.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-medium">{videoStats.duration}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{video?.rating || '4.5'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Views</span>
                    <span className="text-white font-medium">{video?.views?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-medium">{video?.duration || '0:00'}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
