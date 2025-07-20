import React from 'react'
import { Metadata } from 'next'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { LMSNavigation } from '@/components/LMSNavigation'

// This would typically come from Payload CMS
const mockPageData = {
  title: 'JG Performance Horses - Equestrian Learning Management System',
  layout: [
    {
      blockType: 'lmsHero' as const,
      title: 'Elevate Your Equestrian Journey',
      subtitle: 'Professional horse training and riding lessons for all skill levels. Learn from world-class trainers and take your riding to the next level.',
      backgroundImage: null,
      primaryButton: {
        text: 'Get Started',
        url: '/register',
        style: 'primary'
      },
      secondaryButton: {
        text: 'Learn More',
        url: '/about',
        style: 'outline'
      },
      features: [
        {
          icon: 'award',
          title: 'Expert Training',
          description: 'Learn from professional trainers with decades of experience'
        },
        {
          icon: 'users',
          title: 'Community',
          description: 'Join a supportive community of equestrian enthusiasts'
        },
        {
          icon: 'book-open',
          title: 'Comprehensive Courses',
          description: 'From beginner basics to advanced techniques'
        }
      ]
    },
    {
      blockType: 'courseGrid' as const,
      title: 'Featured Courses',
      subtitle: 'Start your equestrian journey with our most popular courses',
      courses: [
        {
          title: 'Reining Fundamentals',
          description: 'Master the basics of reining with step-by-step instruction from our expert trainers.',
          image: null,
          duration: '8 weeks',
          level: 'beginner',
          price: 'Free',
          url: '/courses/reining-fundamentals',
          featured: true,
          requiresAuth: false,
          tags: [
            { tag: 'Reining' },
            { tag: 'Fundamentals' },
            { tag: 'Beginner' }
          ]
        },
        {
          title: 'Advanced Horsemanship',
          description: 'Take your riding skills to the next level with advanced techniques and training methods.',
          image: null,
          duration: '12 weeks',
          level: 'advanced',
          price: '$199',
          url: '/courses/advanced-horsemanship',
          featured: false,
          requiresAuth: true,
          allowedRoles: ['premium', 'vip'],
          tags: [
            { tag: 'Advanced' },
            { tag: 'Horsemanship' },
            { tag: 'Techniques' }
          ]
        },
        {
          title: 'Horse Care Essentials',
          description: 'Learn proper horse care, grooming, and health management from experienced professionals.',
          image: null,
          duration: '6 weeks',
          level: 'all',
          price: '$99',
          url: '/courses/horse-care-essentials',
          featured: false,
          requiresAuth: false,
          tags: [
            { tag: 'Care' },
            { tag: 'Health' },
            { tag: 'Grooming' }
          ]
        }
      ],
      displayStyle: 'grid',
      showFilters: true
    }
  ]
}

export const metadata: Metadata = {
  title: 'JG Performance Horses - Equestrian LMS',
  description: 'Professional horse training and riding lessons for all skill levels',
}

export default function LMSHomePage() {
  return (
    <div className="min-h-screen bg-black">
      <LMSNavigation 
        isAuthenticated={false}
        currentPath="/"
      />
      <main>
        <RenderBlocks blocks={mockPageData.layout} />
      </main>
    </div>
  )
}
