'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from 'lucide-react'
import Image from 'next/image'

import type { VideoPlayerBlock } from '@/payload-types'
import { Button } from '@/components/ui/button'

type Props = {
  className?: string
} & VideoPlayerBlock

export const VideoPlayerBlockComponent: React.FC<Props> = ({
  className,
  title,
  description,
  videoType,
  videoFile,
  videoUrl,
  thumbnail,
  duration,
  requiresAuth,
  allowedRoles,
  autoplay: autoplayProp = false,
  controls = true,
  muted = false,
}) => {
  // Create safe boolean values from props that exclude null
  const autoPlaySafe: boolean = autoplayProp === null ? false : autoplayProp
  const mutedSafe: boolean = muted === null ? false : muted
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false) // This will be replaced with actual auth logic
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // TODO: Replace with actual authentication check
    // For now, assume user is authenticated
    setIsAuthenticated(true)
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        containerRef.current.requestFullscreen()
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getVideoSource = () => {
    switch (videoType) {
      case 'upload':
        return typeof videoFile === 'object' && videoFile?.url ? videoFile.url : ''
      case 'url':
        return videoUrl || ''
      default:
        return ''
    }
  }

  const renderYouTubeEmbed = () => {
    if (!videoUrl) return null
    
    // Extract YouTube video ID
    const videoId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    if (!videoId) return null

    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}${autoplayProp ? '?autoplay=1' : ''}`}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  const renderVimeoEmbed = () => {
    if (!videoUrl) return null
    
    // Extract Vimeo video ID
    const videoId = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1]
    if (!videoId) return null

    return (
      <iframe
        src={`https://player.vimeo.com/video/${videoId}${autoplayProp ? '?autoplay=1' : ''}`}
        title={title}
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    )
  }

  // Check authentication requirements
  if (requiresAuth && !isAuthenticated) {
    return (
      <div className={`bg-gray-900 rounded-lg p-8 text-center ${className || ''}`}>
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
          <p className="text-gray-300 mb-6">
            This video requires authentication to view. Please log in to access this content.
          </p>
          <Button asChild className="bg-teal hover:bg-teal/90 text-black">
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-900 rounded-lg overflow-hidden ${className || ''}`}>
      {title && (
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          {description && (
            <p className="text-gray-300">{description}</p>
          )}
          {duration && (
            <span className="inline-block mt-2 px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded">
              {duration}
            </span>
          )}
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="relative aspect-video bg-black"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {videoType === 'youtube' && renderYouTubeEmbed()}
        {videoType === 'vimeo' && renderVimeoEmbed()}
        
        {(videoType === 'upload' || videoType === 'url') && (
          <>
            <video
              ref={videoRef}
              src={getVideoSource()}
              poster={typeof thumbnail === 'object' && thumbnail?.url ? thumbnail.url : undefined}
              autoPlay={autoPlaySafe}
              muted={mutedSafe}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-contain"
            />
            
            {controls && (
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skipTime(-10)}
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skipTime(10)}
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-white text-sm">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min="0"
                      max={videoDuration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-white text-sm">{formatTime(videoDuration)}</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
