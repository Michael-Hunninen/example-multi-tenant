"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ThumbsUp, Bookmark, Share2, MessageCircle, Loader2, Calendar, Clock, User, ChevronLeft, ChevronRight, Play, Star } from "lucide-react"
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
  const [hasLiked, setHasLiked] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [relatedVideos, setRelatedVideos] = useState<any[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)

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
      if (!videoId) return
      
      try {
        setStatsLoading(true)
        const response = await fetch(`/api/lms/videos/${videoId}/stats`)
        
        if (response.ok) {
          const stats = await response.json()
          setVideoStats(stats)
        }
      } catch (error) {
        console.error('Error fetching video stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchVideoStats()
  }, [videoId])

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

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleLike = async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/lms/videos/${videoId}/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'like',
          userId: user.id
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setHasLiked(!hasLiked)
        // Update video stats
        if (videoStats) {
          setVideoStats({ ...videoStats, likes: data.likes })
        }
      }
    } catch (error) {
      console.error('Error liking video:', error)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
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
                        const videoElement = e.target as HTMLVideoElement
                        setCurrentTime(0)
                      }}
                      onTimeUpdate={(e) => {
                        const videoElement = e.target as HTMLVideoElement
                        setCurrentTime(videoElement.currentTime)
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
                  onClick={handleLike}
                  className={`border-gray-700 ${hasLiked ? 'text-teal border-teal' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {videoStats ? videoStats.likes + (hasLiked ? 1 : 0) : video?.likes || 0}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={`border-gray-700 ${isBookmarked ? 'text-teal border-teal' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {isBookmarked ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
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
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
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
                Comments ({videoStats?.commentsCount || 0})
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
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {comment.likes}
                              </Button>
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
          {/* Related Videos */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Related Videos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <Link
                  key={relatedVideo.id}
                  href={`/dashboard/videos/${relatedVideo.id}`}
                  className="flex gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <Image
                      src={relatedVideo.thumbnail}
                      alt={relatedVideo.title}
                      width={120}
                      height={68}
                      className="rounded object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                      {relatedVideo.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm line-clamp-2 mb-1">
                      {relatedVideo.title}
                    </h4>
                    <p className="text-xs text-gray-400">{relatedVideo.instructor}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

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
                    <span className="text-gray-400">Likes</span>
                    <span className="text-white font-medium">{videoStats.likes + (hasLiked ? 1 : 0)}</span>
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
                    <span className="text-gray-400">Likes</span>
                    <span className="text-white font-medium">{(video?.likes || 0) + (hasLiked ? 1 : 0)}</span>
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
