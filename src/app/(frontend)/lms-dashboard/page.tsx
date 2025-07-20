'use client'

import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { AuthGuard, useAuth } from '@/components/LMSAuth/AuthWrapper'
import LMSLayout from '../lms-layout'

// Internal component that uses auth context
function DashboardContent() {
  const { user } = useAuth()
  
  // This would typically come from Payload CMS and user authentication
  const mockPageData = {
    title: 'Student Dashboard - JG Performance Horses',
    layout: [
    {
      blockType: 'dashboardLayout' as const,
      title: `Welcome back, ${user?.name || 'Student'}!`,
      subtitle: 'Continue your equestrian learning journey',
      showWelcomeMessage: true,
      welcomeMessage: 'You\'re making great progress! Keep up the excellent work in your training.',
      quickStats: [
        // Show different stats based on user role
        ...(user?.roles?.includes('admin') || user?.roles?.includes('super-admin') ? [
          {
            label: 'Admin Access',
            value: 'Active',
            icon: 'star',
            color: 'purple'
          }
        ] : []),
        {
          label: 'Courses Completed',
          value: '3',
          icon: 'book-open',
          color: 'teal'
        },
        {
          label: 'Videos Watched',
          value: '24',
          icon: 'play',
          color: 'blue'
        },
        {
          label: 'Hours Trained',
          value: '18.5',
          icon: 'clock',
          color: 'green'
        },
        {
          label: 'Achievements',
          value: '7',
          icon: 'trophy',
          color: 'yellow'
        }
      ],
      quickActions: [
        {
          title: 'Continue Learning',
          description: 'Resume your current course',
          url: '/courses/reining-fundamentals/lesson-4',
          icon: 'play',
          color: 'teal'
        },
        {
          title: 'Browse Courses',
          description: 'Explore new training programs',
          url: '/courses',
          icon: 'book-open',
          color: 'blue'
        },
        {
          title: 'Watch Videos',
          description: 'Access training video library',
          url: '/videos',
          icon: 'video',
          color: 'green'
        },
        {
          title: 'View Progress',
          description: 'Track your learning journey',
          url: '/dashboard/progress',
          icon: 'trending-up',
          color: 'purple'
        }
      ],
      recentActivity: [
        {
          title: 'Completed Lesson 3: Basic Reining Patterns',
          description: 'Reining Fundamentals Course',
          timestamp: '2 hours ago',
          type: 'course',
          url: '/courses/reining-fundamentals/lesson-3'
        },
        {
          title: 'Watched: Proper Saddle Fitting',
          description: 'Equipment and Tack Series',
          timestamp: '1 day ago',
          type: 'video',
          url: '/videos/proper-saddle-fitting'
        },
        {
          title: 'Achievement Unlocked: First Course Complete',
          description: 'You completed your first course!',
          timestamp: '3 days ago',
          type: 'achievement',
          url: '/dashboard/achievements'
        },
        {
          title: 'Submitted Assignment: Training Log Week 2',
          description: 'Horse Care Essentials',
          timestamp: '5 days ago',
          type: 'assignment',
          url: '/courses/horse-care-essentials/assignments'
        }
      ],
      requiresAuth: true
    }
  ]
}

  return (
    <RenderBlocks blocks={mockPageData.layout} />
  )
}

// Main page component that provides auth context
export default function LMSDashboardPage() {
  return (
    <LMSLayout>
      <AuthGuard>
        <DashboardContent />
      </AuthGuard>
    </LMSLayout>
  )
}
