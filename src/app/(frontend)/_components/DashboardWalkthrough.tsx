'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, 
  ChevronLeft, 
  X,
  BookOpen,
  Play,
  Trophy,
  Calendar,
  Award,
  BarChart3,
  Search,
  Settings,
  User
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface WalkthroughStep {
  id: string
  title: string
  description: string
  target: string // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  icon: any
  action?: string // Optional action text
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Training Dashboard!',
    description: 'This is your command center for all horse reining training. Let\'s explore the key features that will accelerate your progress.',
    target: '.dashboard-overview',
    position: 'center',
    icon: Trophy
  },
  {
    id: 'welcome-card',
    title: 'Your Personal Welcome & Live Clock',
    description: 'See your personalized welcome message and live time clock. Notice how the time updates in real-time - this shows you\'re in an active learning session!',
    target: '.dashboard-overview > div:first-child',
    position: 'bottom',
    icon: User,
    action: 'Watch the clock tick!'
  },
  {
    id: 'stats',
    title: 'Track Your Progress',
    description: 'Monitor your training statistics, completed programs, total learning time, and points earned. Your dedication shows here!',
    target: '.stats-section',
    position: 'bottom',
    icon: BarChart3
  },
  {
    id: 'continue-watching',
    title: 'Continue Where You Left Off',
    description: 'Never lose your place! Your recently watched videos and progress are saved automatically. Click "View All" to see your full video library.',
    target: '.continue-watching',
    position: 'top',
    icon: Play
  },
  {
    id: 'recent-activity',
    title: 'Your Recent Activity Feed',
    description: 'Stay updated with your latest learning activities - completed videos, started programs, earned achievements, and attended live sessions.',
    target: '.continue-watching + div',
    position: 'top',
    icon: BarChart3,
    action: 'Real-time activity updates'
  },
  {
    id: 'sidebar-navigation',
    title: 'Your Learning Navigation',
    description: 'This sidebar is your control center! Each tab takes you to different parts of your training journey. Let\'s explore what each one does.',
    target: 'nav.flex-1',
    position: 'right',
    icon: BookOpen,
    action: 'Your learning command center'
  },
  {
    id: 'video-library',
    title: 'Explore the Video Library',
    description: 'Access hundreds of professional training videos. Use the search and filters to find exactly what you need.',
    target: 'a[href="/dashboard/videos"]',
    position: 'right',
    icon: BookOpen,
    action: 'Click to explore videos'
  },
  {
    id: 'programs',
    title: 'Follow Structured Programs',
    description: 'Join comprehensive training programs designed by professionals. Each program builds skills progressively.',
    target: 'a[href="/dashboard/programs"]',
    position: 'right',
    icon: Trophy,
    action: 'View available programs'
  },
  {
    id: 'live-sessions',
    title: 'Join Live Training Sessions',
    description: 'Participate in weekly Q&A sessions, get personalized feedback, and connect with other riders.',
    target: 'a[href="/dashboard/lessons"]',
    position: 'right',
    icon: Calendar,
    action: 'See upcoming sessions'
  },
  {
    id: 'profile',
    title: 'Manage Your Profile',
    description: 'Update your goals, track achievements, view detailed learning stats, and customize your preferences.',
    target: 'a[href="/dashboard/profile"]',
    position: 'right',
    icon: User,
    action: 'Visit your profile'
  },
  {
    id: 'settings',
    title: 'Customize Your Settings',
    description: 'Adjust your account preferences, notification settings, and learning customizations.',
    target: 'a[href="/dashboard/settings"]',
    position: 'right',
    icon: Settings,
    action: 'Configure settings'
  },
  {
    id: 'tutorial',
    title: 'Tutorial On-Demand',
    description: 'Forgot how something works? No problem! Click the Tutorial tab anytime to restart this guided tour. Learning should never feel overwhelming.',
    target: 'nav button[class*="w-full"]:last-of-type',
    position: 'right',
    icon: Trophy,
    action: 'Always here to help'
  },
  {
    id: 'search',
    title: 'Instant Search',
    description: 'Need to find something specific? Use this search bar to instantly locate any video, program, or training topic. Try searching for "reining" or "basics"!',
    target: 'input[placeholder*="Search"]',
    position: 'bottom',
    icon: Search,
    action: 'Try it now!'
  },
  {
    id: 'notifications',
    title: 'Stay Updated with Notifications',
    description: 'Check your notifications for new content, achievement unlocks, upcoming sessions, and important updates.',
    target: 'header div:last-child button:first-child',
    position: 'bottom',
    icon: Award,
    action: 'Click to view notifications'
  }
]

interface DashboardWalkthroughProps {
  onComplete: () => void
  onSkip: () => void
}

export default function DashboardWalkthrough({ onComplete, onSkip }: DashboardWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const router = useRouter()

  const currentStepData = walkthroughSteps[currentStep]

  useEffect(() => {
    const highlightElement = () => {
      // Try multiple selector strategies for better accuracy
      let element = document.querySelector(currentStepData.target)
      
      // Fallback selectors for common elements
      if (!element) {
        const fallbacks: Record<string, string> = {
          'nav.flex-1': 'nav[class*="flex-1"], nav[class*="overflow-y-auto"]',
          'input[placeholder*="Search"]': 'input[placeholder*="search"], input[placeholder*="videos"]',
          'nav button[class*="w-full"]:last-of-type': 'nav button:last-of-type, button[class*="Tutorial"]',
          'header div:last-child button:first-child': 'header button:first-of-type, button[aria-label*="notification"]',
          '.continue-watching + div': '.continue-watching ~ div, [class*="recent-activity"], [class*="activity-feed"]'
        }
        
        const fallbackSelector = fallbacks[currentStepData.target]
        if (fallbackSelector) {
          element = document.querySelector(fallbackSelector)
        }
      }
      
      if (element) {
        setHighlightedElement(element)
        
        // Calculate tooltip position with better accuracy
        const rect = element.getBoundingClientRect()
        const scrollY = window.scrollY
        const scrollX = window.scrollX
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        
        // Base position calculation
        let x = rect.left + scrollX + rect.width / 2
        let y = rect.top + scrollY
        
        // Tooltip dimensions estimate (for boundary checking)
        const tooltipWidth = 320
        const tooltipHeight = 200
        const padding = 20
        
        switch (currentStepData.position) {
          case 'top':
            y = rect.top + scrollY - tooltipHeight - padding
            // Ensure tooltip stays within viewport horizontally
            x = Math.max(padding, Math.min(x, viewportWidth - tooltipWidth - padding))
            break
          case 'bottom':
            y = rect.bottom + scrollY + padding
            x = Math.max(padding, Math.min(x, viewportWidth - tooltipWidth - padding))
            break
          case 'left':
            x = rect.left + scrollX - tooltipWidth - padding
            y = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2
            // Ensure tooltip stays within viewport
            y = Math.max(padding, Math.min(y, viewportHeight - tooltipHeight - padding))
            break
          case 'right':
            x = rect.right + scrollX + padding
            y = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2
            y = Math.max(padding, Math.min(y, viewportHeight - tooltipHeight - padding))
            break
          case 'center':
            x = viewportWidth / 2 - tooltipWidth / 2
            y = viewportHeight / 2 - tooltipHeight / 2 + scrollY
            break
        }
        
        setTooltipPosition({ x, y })
        
        // Scroll element into view with better positioning
        const elementTop = rect.top + scrollY
        const elementBottom = rect.bottom + scrollY
        const viewportTop = scrollY
        const viewportBottom = scrollY + viewportHeight
        
        // Only scroll if element is not fully visible
        if (elementTop < viewportTop || elementBottom > viewportBottom) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          })
        }
        
        // Add extra highlight styling
        element.classList.add('walkthrough-highlight')
      } else {
        console.warn(`Element not found for target: ${currentStepData.target}`)
        // Fallback to center position if element not found
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const scrollY = window.scrollY
        setTooltipPosition({ 
          x: viewportWidth / 2 - 160, 
          y: viewportHeight / 2 - 100 + scrollY 
        })
      }
    }
    
    // Clean up previous highlight
    const prevHighlighted = document.querySelector('.walkthrough-highlight')
    if (prevHighlighted) {
      prevHighlighted.classList.remove('walkthrough-highlight')
    }
    
    // Delay to ensure DOM is ready and animations complete
    const timer = setTimeout(highlightElement, 600)
    return () => {
      clearTimeout(timer)
      // Clean up highlight on unmount
      const highlighted = document.querySelector('.walkthrough-highlight')
      if (highlighted) {
        highlighted.classList.remove('walkthrough-highlight')
      }
    }
  }, [currentStep, currentStepData])

  const handleNext = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  const handleElementClick = () => {
    if (currentStepData.action && highlightedElement) {
      // If the element has an action, proceed to next step
      handleNext()
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80 z-50 pointer-events-auto">
        {/* Highlighted element spotlight */}
        {highlightedElement && (
          <div
            className="absolute border-4 border-teal-400 rounded-lg shadow-2xl shadow-teal-400/50 pointer-events-none animate-pulse"
            style={{
              left: highlightedElement.getBoundingClientRect().left - 4,
              top: highlightedElement.getBoundingClientRect().top - 4,
              width: highlightedElement.getBoundingClientRect().width + 8,
              height: highlightedElement.getBoundingClientRect().height + 8,
            }}
          />
        )}
        
        {/* Tooltip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute z-60"
            style={{
              left: currentStepData.position === 'center' ? '50%' : tooltipPosition.x,
              top: currentStepData.position === 'center' ? '50%' : tooltipPosition.y,
              transform: currentStepData.position === 'center' ? 'translate(-50%, -50%)' : 
                currentStepData.position === 'left' ? 'translate(-100%, -50%)' :
                currentStepData.position === 'right' ? 'translate(0%, -50%)' :
                currentStepData.position === 'top' ? 'translate(-50%, -100%)' :
                'translate(-50%, 0%)'
            }}
          >
            <Card className="bg-gray-900 border-gray-700 shadow-2xl max-w-sm">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/20">
                      <currentStepData.icon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{currentStepData.title}</h3>
                      <p className="text-xs text-gray-400">
                        Step {currentStep + 1} of {walkthroughSteps.length}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Action hint */}
                {currentStepData.action && (
                  <div className="mb-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                    <p className="text-teal-300 text-sm font-medium">
                      💡 {currentStepData.action}
                    </p>
                  </div>
                )}

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-teal-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / walkthroughSteps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="text-gray-400 hover:text-white disabled:opacity-30"
                    size="sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      onClick={handleSkip}
                      className="text-gray-400 hover:text-white"
                      size="sm"
                    >
                      Skip Tour
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-black font-semibold shadow-lg shadow-teal-500/20"
                      size="sm"
                    >
                      {currentStep === walkthroughSteps.length - 1 ? 'Finish' : 'Next'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Arrow pointer */}
            {currentStepData.position !== 'center' && (
              <div
                className={`absolute w-0 h-0 ${
                  currentStepData.position === 'top' ? 'border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900 top-full left-1/2 transform -translate-x-1/2' :
                  currentStepData.position === 'bottom' ? 'border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-900 bottom-full left-1/2 transform -translate-x-1/2' :
                  currentStepData.position === 'left' ? 'border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-gray-900 left-full top-1/2 transform -translate-y-1/2' :
                  'border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-gray-900 right-full top-1/2 transform -translate-y-1/2'
                }`}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
