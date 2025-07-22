'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Star,
  Trophy,
  Target,
  Users,
  BookOpen,
  Play,
  Calendar,
  Settings,
  Award,
  MapPin
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface OnboardingData {
  name: string
  experience: string
  goals: string[]
  disciplines: string[]
  timeCommitment: string
  preferredLearning: string
}

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: '',
    experience: '',
    goals: [],
    disciplines: [],
    timeCommitment: '',
    preferredLearning: ''
  })
  const [isCompleting, setIsCompleting] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'premium'

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to JG Performance Horses!',
      subtitle: 'Let\'s get you started on your reining journey',
      icon: Users
    },
    {
      id: 'profile',
      title: 'Tell Us About Yourself',
      subtitle: 'Help us personalize your training experience',
      icon: Users
    },
    {
      id: 'experience',
      title: 'Your Riding Experience',
      subtitle: 'What\'s your current level with reining?',
      icon: Trophy
    },
    {
      id: 'goals',
      title: 'Training Goals',
      subtitle: 'What would you like to achieve?',
      icon: Target
    },
    {
      id: 'preferences',
      title: 'Learning Preferences',
      subtitle: 'How do you prefer to learn?',
      icon: BookOpen
    },
    {
      id: 'tutorial',
      title: 'Dashboard Tour',
      subtitle: 'Let\'s explore your training dashboard',
      icon: MapPin
    }
  ]

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to reining or just starting out' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some reining experience, working on fundamentals' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced rider looking to refine skills' },
    { value: 'professional', label: 'Professional', description: 'Competing at high levels or training others' }
  ]

  const trainingGoals = [
    { value: 'fundamentals', label: 'Master the Fundamentals', icon: BookOpen },
    { value: 'competition', label: 'Compete Successfully', icon: Trophy },
    { value: 'horsemanship', label: 'Improve Horsemanship', icon: Users },
    { value: 'patterns', label: 'Perfect Reining Patterns', icon: Target },
    { value: 'ranch', label: 'Ranch Riding Skills', icon: Star },
    { value: 'training', label: 'Train My Own Horse', icon: Users }
  ]

  const disciplines = [
    { value: 'reining', label: 'Reining' },
    { value: 'ranch', label: 'Ranch Riding' },
    { value: 'cutting', label: 'Cutting' },
    { value: 'western-pleasure', label: 'Western Pleasure' },
    { value: 'trail', label: 'Trail' },
    { value: 'other', label: 'Other Western Disciplines' }
  ]

  const timeCommitments = [
    { value: '1-2', label: '1-2 hours per week', description: 'Casual learning' },
    { value: '3-5', label: '3-5 hours per week', description: 'Regular practice' },
    { value: '6-10', label: '6-10 hours per week', description: 'Serious training' },
    { value: '10+', label: '10+ hours per week', description: 'Intensive preparation' }
  ]

  const learningStyles = [
    { value: 'video', label: 'Video Lessons', description: 'Step-by-step video instruction', icon: Play },
    { value: 'live', label: 'Live Sessions', description: 'Interactive Q&A and coaching', icon: Users },
    { value: 'practice', label: 'Practice Drills', description: 'Structured exercises and patterns', icon: Target },
    { value: 'theory', label: 'Theory & Concepts', description: 'Understanding the why behind techniques', icon: BookOpen }
  ]

  const tutorialSteps = [
    {
      title: 'Your Training Dashboard',
      description: 'This is your home base for all training activities. Here you can see your progress, continue watching videos, and access your programs.',
      highlight: 'dashboard-overview',
      icon: BookOpen
    },
    {
      title: 'Video Library',
      description: 'Access hundreds of professional training videos organized by skill level and topic. Use the search and filters to find exactly what you need.',
      highlight: 'video-library',
      icon: Play
    },
    {
      title: 'Training Programs',
      description: 'Follow structured programs designed by Josiane Gauthier. Each program builds skills progressively with clear milestones.',
      highlight: 'programs',
      icon: Trophy
    },
    {
      title: 'Live Sessions',
      description: 'Join weekly Q&A sessions and get personalized feedback on your riding. Submit videos for review and ask questions.',
      highlight: 'live-sessions',
      icon: Calendar
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed progress tracking. See which skills you\'ve mastered and what to work on next.',
      highlight: 'progress',
      icon: Award
    }
  ]

  const [tutorialStep, setTutorialStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsCompleting(true)
    
    // Simulate saving onboarding data
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirect to dashboard with walkthrough enabled
    router.push('/dashboard?onboarded=true&walkthrough=true')
  }

  const updateData = (field: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleArrayValue = (field: keyof OnboardingData, value: string) => {
    const currentArray = onboardingData[field] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateData(field, newArray)
  }

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-500/30"
            >
              <Users className="w-12 h-12 text-black" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to Your Reining Journey!
            </h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              You've just joined thousands of riders who are improving their skills with professional training from Josiane Gauthier and the JG Performance Horses team.
            </p>
            <div className="bg-gradient-to-r from-teal-500/10 to-teal-400/10 border border-teal-500/30 rounded-lg p-6 mb-6 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-4">
                <Badge variant="secondary" className="bg-teal-500 text-black font-semibold">
                  {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                </Badge>
              </div>
              <p className="text-teal-300 font-medium text-center">
                "The best preparation for tomorrow is doing your best today!"
              </p>
              <p className="text-teal-400 text-sm mt-2 text-center">- JG Performance Horses Motto</p>
            </div>
            <p className="text-gray-300">
              Let's take a few minutes to personalize your training experience.
            </p>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What should we call you?
              </label>
              <input
                type="text"
                value={onboardingData.name}
                onChange={(e) => updateData('name', e.target.value)}
                placeholder="Enter your first name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Which disciplines are you interested in?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {disciplines.map((discipline) => (
                  <button
                    key={discipline.value}
                    onClick={() => toggleArrayValue('disciplines', discipline.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      onboardingData.disciplines.includes(discipline.value)
                        ? 'border-teal-500 bg-teal-500/20 text-teal-300'
                        : 'border-gray-700 hover:border-gray-600 text-gray-300'
                    }`}
                  >
                    {discipline.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'experience':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">
              This helps us recommend the right content for your skill level.
            </p>
            {experienceLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => updateData('experience', level.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  onboardingData.experience === level.value
                    ? 'border-teal-500 bg-teal-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{level.label}</h3>
                    <p className="text-gray-300 text-sm">{level.description}</p>
                  </div>
                  {onboardingData.experience === level.value && (
                    <Check className="w-5 h-5 text-teal-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )

      case 'goals':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 mb-6">
              Select all that apply. We'll customize your training recommendations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainingGoals.map((goal) => {
                const Icon = goal.icon
                return (
                  <button
                    key={goal.value}
                    onClick={() => toggleArrayValue('goals', goal.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      onboardingData.goals.includes(goal.value)
                        ? 'border-teal-500 bg-teal-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 ${
                        onboardingData.goals.includes(goal.value) ? 'text-teal-400' : 'text-gray-400'
                      }`} />
                      <span className={`font-medium ${
                        onboardingData.goals.includes(goal.value) ? 'text-teal-300' : 'text-gray-300'
                      }`}>{goal.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
            
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                How much time can you dedicate to training each week?
              </label>
              <div className="space-y-2">
                {timeCommitments.map((time) => (
                  <button
                    key={time.value}
                    onClick={() => updateData('timeCommitment', time.value)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      onboardingData.timeCommitment === time.value
                        ? 'border-teal-500 bg-teal-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-medium ${
                          onboardingData.timeCommitment === time.value ? 'text-teal-300' : 'text-gray-300'
                        }`}>{time.label}</span>
                        <span className="text-gray-400 text-sm ml-2">- {time.description}</span>
                      </div>
                      {onboardingData.timeCommitment === time.value && (
                        <Check className="w-5 h-5 text-teal-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'preferences':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 mb-6">
              How do you learn best? This helps us prioritize content for you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningStyles.map((style) => {
                const Icon = style.icon
                return (
                  <button
                    key={style.value}
                    onClick={() => updateData('preferredLearning', style.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      onboardingData.preferredLearning === style.value
                        ? 'border-teal-500 bg-teal-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${
                        onboardingData.preferredLearning === style.value ? 'text-teal-400' : 'text-gray-400'
                      }`} />
                      <h3 className={`font-semibold ${
                        onboardingData.preferredLearning === style.value ? 'text-teal-300' : 'text-gray-300'
                      }`}>{style.label}</h3>
                      <p className={`text-sm mt-1 ${
                        onboardingData.preferredLearning === style.value ? 'text-teal-400' : 'text-gray-400'
                      }`}>{style.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 'tutorial':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Let's Tour Your Dashboard
              </h3>
              <p className="text-gray-300">
                Here's how to make the most of your training platform
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">
                  Step {tutorialStep + 1} of {tutorialSteps.length}
                </span>
                <div className="flex space-x-1">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                                          className={`w-2 h-2 rounded-full ${
                        index <= tutorialStep ? 'bg-teal-500 shadow-sm shadow-teal-500/50' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20">
                  {React.createElement(tutorialSteps[tutorialStep].icon, { className: "w-8 h-8 text-black" })}
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  {tutorialSteps[tutorialStep].title}
                </h4>
                <p className="text-gray-300 mb-6">
                  {tutorialSteps[tutorialStep].description}
                </p>

                <div className="flex justify-center space-x-4">
                  {tutorialStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setTutorialStep(tutorialStep - 1)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  {tutorialStep < tutorialSteps.length - 1 ? (
                    <Button
                      onClick={() => setTutorialStep(tutorialStep + 1)}
                      className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-black font-semibold shadow-lg shadow-teal-500/20"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleComplete}
                      disabled={isCompleting}
                      className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-black font-semibold shadow-lg shadow-teal-500/20 disabled:opacity-50"
                    >
                      {isCompleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          Setting up your dashboard...
                        </>
                      ) : (
                        <>
                          Start Training
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return true
      case 'profile':
        return onboardingData.name.trim() !== '' && onboardingData.disciplines.length > 0
      case 'experience':
        return onboardingData.experience !== ''
      case 'goals':
        return onboardingData.goals.length > 0 && onboardingData.timeCommitment !== ''
      case 'preferences':
        return onboardingData.preferredLearning !== ''
      case 'tutorial':
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Getting Started</h1>
            <span className="text-sm text-gray-400">
              {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-teal-400 to-teal-500 h-2 rounded-full transition-all duration-300 shadow-lg shadow-teal-500/20"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8 bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/20">
                {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-black" })}
              </div>
            </div>
            <CardTitle className="text-2xl text-white">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-lg text-gray-300">{steps[currentStep].subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        {steps[currentStep].id !== 'tutorial' && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-black font-semibold shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length - 1 ? 'Start Tutorial' : 'Continue'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
