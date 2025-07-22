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
    id: 'stats',
    title: 'Track Your Progress',
    description: 'Monitor your training statistics, completed lessons, and skill improvements. Your dedication shows here!',
    target: '.stats-section',
    position: 'bottom',
    icon: BarChart3
  },
  {
    id: 'continue-watching',
    title: 'Continue Where You Left Off',
    description: 'Never lose your place! Your recently watched videos and progress are saved automatically.',
    target: '.continue-watching',
    position: 'top',
    icon: Play
  },
  {
    id: 'video-library',
    title: 'Explore the Video Library',
    description: 'Access hundreds of professional training videos. Use the search and filters to find exactly what you need.',
    target: '[href="/dashboard/videos"]',
    position: 'left',
    icon: BookOpen,
    action: 'Click to explore videos'
  },
  {
    id: 'programs',
    title: 'Follow Structured Programs',
    description: 'Join comprehensive training programs designed by Josiane Gauthier. Each program builds skills progressively.',
    target: '[href="/dashboard/programs"]',
    position: 'left',
    icon: Trophy,
    action: 'View available programs'
  },
  {
    id: 'live-sessions',
    title: 'Join Live Training Sessions',
    description: 'Participate in weekly Q&A sessions, get personalized feedback, and connect with other riders.',
    target: '[href="/dashboard/lessons"]',
    position: 'left',
    icon: Calendar,
    action: 'See upcoming sessions'
  },
  {
    id: 'profile',
    title: 'Manage Your Profile',
    description: 'Update your goals, track achievements, and customize your learning preferences.',
    target: '[href="/dashboard/profile"]',
    position: 'right',
    icon: User,
    action: 'Visit your profile'
  },
  {
    id: 'search',
    title: 'Quick Search',
    description: 'Find any video, program, or topic instantly with our powerful search feature.',
    target: '.search-input',
    position: 'bottom',
    icon: Search
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
      const element = document.querySelector(currentStepData.target)
      if (element) {
        setHighlightedElement(element)
        
        // Calculate tooltip position
        const rect = element.getBoundingClientRect()
        const scrollY = window.scrollY
        const scrollX = window.scrollX
        
        let x = rect.left + scrollX + rect.width / 2
        let y = rect.top + scrollY
        
        switch (currentStepData.position) {
          case 'top':
            y = rect.top + scrollY - 20
            break
          case 'bottom':
            y = rect.bottom + scrollY + 20
            break
          case 'left':
            x = rect.left + scrollX - 20
            y = rect.top + scrollY + rect.height / 2
            break
          case 'right':
            x = rect.right + scrollX + 20
            y = rect.top + scrollY + rect.height / 2
            break
          case 'center':
            x = window.innerWidth / 2
            y = window.innerHeight / 2
            break
        }
        
        setTooltipPosition({ x, y })
        
        // Scroll element into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        })
      }
    }

    // Delay to ensure DOM is ready
    const timer = setTimeout(highlightElement, 100)
    return () => clearTimeout(timer)
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
