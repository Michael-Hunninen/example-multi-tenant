'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface RealtimeClockProps {
  className?: string
  showIcon?: boolean
  showDate?: boolean
  showTime?: boolean
  timezone?: string
}

export default function RealtimeClock({ 
  className = "", 
  showIcon = true,
  showDate = true, 
  showTime = true,
  timezone 
}: RealtimeClockProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    // Update time immediately
    setCurrentTime(new Date())

    // Set up interval to update every second
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  // Format the time based on user's timezone or browser's timezone
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
      hour12: true,
      ...(showDate && {
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
      }),
      ...(showTime && {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    return date.toLocaleString('en-US', options)
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && (
        <Clock className="h-5 w-5" />
      )}
      <div className="text-right">
        <div className="font-mono text-sm leading-tight">
          {formatTime(currentTime)}
        </div>
      </div>
    </div>
  )
}

// Alternative version for large display (like the dashboard welcome card)
export function LargeRealtimeClock({ 
  className = "h-16 w-16 text-teal/50" 
}: { 
  className?: string 
}) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    setCurrentTime(new Date())
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className={`${className.includes('h-') ? '' : 'h-16 w-16'} flex flex-col items-center justify-center`}>
        <div className="text-xs font-mono leading-tight">
          <div className="text-white font-medium">{formatTime(currentTime)}</div>
          <div className="text-teal-400 text-[10px]">{formatDate(currentTime)}</div>
        </div>
      </div>
    </div>
  )
}
