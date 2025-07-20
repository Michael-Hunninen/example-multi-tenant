'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Users, Star, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { CourseGridBlock } from '@/payload-types'
import { Button } from '@/components/ui/button'

type Props = {
  className?: string
} & CourseGridBlock

export const CourseGridBlockComponent: React.FC<Props> = ({
  className,
  title,
  subtitle,
  courses,
  displayStyle = 'grid',
  showFilters = true,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [isAuthenticated, setIsAuthenticated] = useState(false) // TODO: Replace with actual auth

  const levels = ['all', 'beginner', 'intermediate', 'advanced']
  
  const filteredCourses = courses?.filter(course => {
    if (selectedLevel === 'all') return true
    return course.level === selectedLevel
  }) || []

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400'
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'advanced':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-blue-500/20 text-blue-400'
    }
  }

  const CourseCard = ({ course, index }: { course: any; index: number }) => {
    const canAccess = !course.requiresAuth || isAuthenticated

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-teal/50 transition-all duration-300 ${course.featured ? 'ring-2 ring-teal/50' : ''}`}
      >
        {course.image && typeof course.image === 'object' && (
          <div className="relative aspect-video">
            <Image
              src={course.image.url || '/placeholder.svg?height=200&width=300'}
              alt={course.image.alt || course.title}
              fill
              className="object-cover"
            />
            {course.featured && (
              <div className="absolute top-2 right-2 bg-teal text-black px-2 py-1 rounded text-sm font-semibold">
                Featured
              </div>
            )}
            {!canAccess && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            {course.level && (
              <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(course.level)}`}>
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </span>
            )}
            {course.price && (
              <span className="px-2 py-1 bg-teal/20 text-teal rounded text-xs font-medium">
                {course.price}
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
          
          {course.description && (
            <p className="text-gray-300 mb-4 line-clamp-3">{course.description}</p>
          )}
          
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            )}
          </div>
          
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {course.tags.slice(0, 3).map((tagItem, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                >
                  {tagItem.tag}
                </span>
              ))}
            </div>
          )}
          
          <Button
            asChild={canAccess}
            disabled={!canAccess}
            className={`w-full ${canAccess ? 'bg-teal hover:bg-teal/90 text-black' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
          >
            {canAccess ? (
              <Link href={course.url}>
                {course.requiresAuth ? 'Continue Learning' : 'Start Course'}
              </Link>
            ) : (
              <span>Sign In Required</span>
            )}
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <section className={`py-16 bg-black ${className || ''}`}>
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && (
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">{subtitle}</p>
          )}
        </div>
        
        {showFilters && (
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 bg-gray-900 p-1 rounded-lg">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-teal text-black'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {displayStyle === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <CourseCard key={index} course={course} index={index} />
            ))}
          </div>
        )}
        
        {displayStyle === 'list' && (
          <div className="space-y-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-teal/50 transition-all duration-300"
              >
                <div className="flex gap-6">
                  {course.image && typeof course.image === 'object' && (
                    <div className="relative w-48 aspect-video flex-shrink-0">
                      <Image
                        src={course.image.url || '/placeholder.svg?height=120&width=200'}
                        alt={course.image.alt || course.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {course.level && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(course.level)}`}>
                          {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        </span>
                      )}
                      {course.price && (
                        <span className="px-2 py-1 bg-teal/20 text-teal rounded text-xs font-medium">
                          {course.price}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                    
                    {course.description && (
                      <p className="text-gray-300 mb-4">{course.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {course.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        asChild={!course.requiresAuth || isAuthenticated}
                        disabled={course.requiresAuth && !isAuthenticated}
                        className="bg-teal hover:bg-teal/90 text-black"
                      >
                        {!course.requiresAuth || isAuthenticated ? (
                          <Link href={course.url}>Start Course</Link>
                        ) : (
                          <span>Sign In Required</span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No courses found for the selected level.</p>
          </div>
        )}
      </div>
    </section>
  )
}
