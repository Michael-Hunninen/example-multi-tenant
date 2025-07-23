'use client'

import React, { useState, useEffect } from 'react'
import { Bell, Check, X, Award, MessageCircle, PlayCircle, BookOpen, TrendingUp, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

import { useAuth } from '@/components/LMSAuth/AuthWrapper'

interface Notification {
  id: string
  type: 'comment' | 'achievement' | 'progress' | 'enrollment' | 'system' | 'reminder'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: {
    videoId?: string
    programId?: string
    achievementId?: string
    userId?: string
    [key: string]: any
  }
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'comment':
      return <MessageCircle className="w-4 h-4 text-blue-400" />
    case 'achievement':
      return <Award className="w-4 h-4 text-yellow-400" />
    case 'progress':
      return <TrendingUp className="w-4 h-4 text-green-400" />
    case 'enrollment':
      return <BookOpen className="w-4 h-4 text-purple-400" />
    case 'system':
      return <Bell className="w-4 h-4 text-gray-400" />
    case 'reminder':
      return <Clock className="w-4 h-4 text-orange-400" />
    default:
      return <Bell className="w-4 h-4 text-gray-400" />
  }
}

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default function NotificationsDropdown() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch real notifications from API
  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true)
        const response = await fetch('/api/lms/notifications')
        
        if (response.ok) {
          const data = await response.json()
          const apiNotifications = data.notifications.map((notification: any) => ({
            ...notification,
            timestamp: new Date(notification.timestamp)
          }))
          
          setNotifications(apiNotifications)
          setUnreadCount(data.unreadCount || 0)
        } else {
          console.error('Failed to fetch notifications:', response.statusText)
          // Fallback to empty notifications
          setNotifications([])
          setUnreadCount(0)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
        // Fallback to empty notifications
        setNotifications([])
        setUnreadCount(0)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchNotifications()
    }
  }, [user])

  const markAsRead = async (notificationId: string) => {
    // Optimistically update UI
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))

    // Persist to backend
    try {
      const response = await fetch('/api/lms/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: notificationId })
      })
      
      if (!response.ok) {
        console.error('Failed to mark notification as read:', await response.text())
        // Revert UI change on failure
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: false }
              : notification
          )
        )
        setUnreadCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      // Revert UI change on failure
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: false }
            : notification
        )
      )
      setUnreadCount(prev => prev + 1)
    }
  }

  const markAllAsRead = async () => {
    // Optimistically update UI
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
    const prevUnreadCount = unreadCount
    setUnreadCount(0)

    // Persist to backend
    try {
      const response = await fetch('/api/lms/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ allNotifications: true })
      })
      
      if (!response.ok) {
        console.error('Failed to mark all notifications as read:', await response.text())
        // Revert UI change on failure
        setNotifications(prev => 
          prev.map((notification, index) => 
            index < prevUnreadCount 
              ? { ...notification, read: false }
              : notification
          )
        )
        setUnreadCount(prevUnreadCount)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      // Revert UI change on failure
      setNotifications(prev => 
        prev.map((notification, index) => 
          index < prevUnreadCount 
            ? { ...notification, read: false }
            : notification
        )
      )
      setUnreadCount(prevUnreadCount)
    }
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    const notification = notifications.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-10 w-10 p-0 text-white hover:text-white hover:bg-teal-500/20 transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-gray-900 border-gray-800" align="end">
        <div className="flex items-center justify-between p-4">
          <DropdownMenuLabel className="text-white font-semibold">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-teal-400 hover:text-teal-300 h-auto p-1"
            >
              Mark all read
            </Button>
          )}
        </div>
        
        <DropdownMenuSeparator className="bg-gray-800" />
        
        {loading ? (
          <div className="p-4 text-center text-gray-400">
            <div className="animate-spin w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="h-80 overflow-y-auto">
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative group border-b border-gray-800/50 last:border-b-0 ${
                    !notification.read ? 'bg-gray-800/30' : ''
                  }`}
                >
                  <button
                    onClick={() => handleNotificationClick(notification)}
                    className="w-full text-left p-3 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium ${
                            notification.read ? 'text-gray-300' : 'text-white'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className={`text-xs mt-1 line-clamp-2 ${
                          notification.read ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-600 mt-1">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </button>
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                          }}
                          className="w-6 h-6 p-0 text-green-400 hover:text-green-300"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <DropdownMenuSeparator className="bg-gray-800" />
        
        <div className="p-2">
          <Button 
            variant="ghost" 
            className="w-full text-teal-400 hover:text-teal-300 hover:bg-gray-800/50"
            onClick={() => window.location.href = '/dashboard/notifications'}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
