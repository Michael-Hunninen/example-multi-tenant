'use client'

import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { AuthGuard } from '@/components/LMSAuth/AuthWrapper'
import LMSLayout from '../lms-layout'

// This would typically come from Payload CMS
const mockPageData = {
  title: 'Reining Fundamentals - Lesson 4',
  layout: [
    {
      blockType: 'lmsHero' as const,
      type: 'course',
      title: 'Lesson 4: Advanced Reining Patterns',
      subtitle: 'Learn complex reining patterns and improve your precision in the arena',
      backgroundImage: null,
      primaryButton: {
        text: 'Previous Lesson',
        url: '/courses/reining-fundamentals/lesson-3',
        style: 'outline'
      },
      secondaryButton: {
        text: 'Next Lesson',
        url: '/courses/reining-fundamentals/lesson-5',
        style: 'primary'
      },
      features: []
    },
    {
      blockType: 'videoPlayer' as const,
      title: 'Advanced Reining Patterns Demonstration',
      description: 'Watch as our expert trainer demonstrates proper technique for executing complex reining patterns including spins, sliding stops, and lead changes.',
      videoType: 'upload',
      videoFile: null, // Would be actual video file from Payload
      videoUrl: '',
      thumbnail: null,
      duration: '18:45',
      requiresAuth: true,
      allowedRoles: ['regular', 'business', 'admin', 'super-admin'],
      autoplay: false,
      controls: true,
      muted: false
    },
    {
      blockType: 'content' as const,
      columns: [
        {
          size: 'full',
          richText: [
            {
              children: [
                {
                  text: 'Lesson Overview'
                }
              ],
              type: 'h2'
            },
            {
              children: [
                {
                  text: 'In this lesson, you\'ll learn how to execute advanced reining patterns with precision and confidence. We\'ll cover:'
                }
              ]
            },
            {
              type: 'ul',
              children: [
                {
                  type: 'li',
                  children: [
                    {
                      text: 'Complex pattern sequences'
                    }
                  ]
                },
                {
                  type: 'li',
                  children: [
                    {
                      text: 'Timing and rhythm in pattern execution'
                    }
                  ]
                },
                {
                  type: 'li',
                  children: [
                    {
                      text: 'Common mistakes and how to avoid them'
                    }
                  ]
                },
                {
                  type: 'li',
                  children: [
                    {
                      text: 'Practice exercises for improvement'
                    }
                  ]
                }
              ]
            },
            {
              children: [
                {
                  text: 'Key Learning Points'
                }
              ],
              type: 'h3'
            },
            {
              children: [
                {
                  text: 'Remember that consistency is key when executing reining patterns. Focus on smooth transitions between maneuvers and maintain proper body position throughout each sequence.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      blockType: 'videoPlayer' as const,
      title: 'Practice Session: Student Examples',
      description: 'Watch real students practice these patterns and learn from their successes and challenges.',
      videoType: 'upload',
      videoFile: null,
      videoUrl: '',
      thumbnail: null,
      duration: '12:30',
      requiresAuth: true,
      allowedRoles: ['business', 'admin', 'super-admin'],
      autoplay: false,
      controls: true,
      muted: false
    }
  ]
}

// Metadata is handled through the LMS layout or can be added using Next.js metadata API

// Internal component that uses auth context (this will be wrapped with AuthProvider via LMSLayout)
function VideoContent() {
  // Premium video check is handled by the VideoPlayer block now
  // This keeps the component simpler since access control is handled at the block level
  return (
    <div className="pb-12">
      <RenderBlocks blocks={mockPageData.layout} />
    </div>
  )
}

// Main page component
export default function LMSVideoCoursePage() {
  return (
    <LMSLayout>
      <AuthGuard requiredRole="regular">
        <VideoContent />
      </AuthGuard>
    </LMSLayout>
  )
}
