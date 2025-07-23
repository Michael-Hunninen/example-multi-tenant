"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Play, Users, Calendar, Award, ChevronRight, Video, BookOpen, MessageCircle, 
  BarChart3, Target, Zap, Globe, Lock, Crown, Star, Trophy, 
  CheckCircle, ArrowRight, Sparkles, TrendingUp, Clock, User
} from 'lucide-react'
import CustomHeader from './CustomHeader'

export default function ServicesPage() {
  const [billingPeriod, setBillingPeriod] = useState<'annual' | 'monthly'>('annual')
  const platformFeatures = [
    {
      icon: Video,
      title: "Premium Video Library",
      description: "Access our comprehensive collection of professional reining training videos with advanced progress tracking and personalized recommendations.",
      features: ["4K HD Quality", "Smart Progress Tracking", "Mobile & Offline Access", "Custom Speed Controls", "Chapter Navigation"],
      tier: "All Plans"
    },
    {
      icon: BookOpen,
      title: "Structured Learning Programs",
      description: "Follow expertly designed training curricula that take you from fundamentals to advanced techniques with measurable progress milestones.",
      features: ["Step-by-Step Curricula", "Progress Analytics", "Completion Certificates", "Skill Assessments", "Personalized Pathways"],
      tier: "Premium+"
    },
    {
      icon: Calendar,
      title: "Live Interactive Sessions",
      description: "Join scheduled live training sessions, Q&A workshops, and exclusive masterclasses with direct access to professional instructors.",
      features: ["Weekly Live Sessions", "Real-Time Q&A", "Session Recordings", "Small Group Format", "Expert Feedback"],
      tier: "VIP+"
    },
    {
      icon: Award,
      title: "Achievement & Gamification",
      description: "Earn points, unlock badges, and track your learning journey with our comprehensive achievement system that keeps you motivated.",
      features: ["XP Point System", "Skill Badges", "Leaderboards", "Weekly Challenges", "Progress Rewards"],
      tier: "All Plans"
    },
    {
      icon: MessageCircle,
      title: "Community & Collaboration",
      description: "Connect with fellow riders, share experiences, get feedback, and participate in discussions within our exclusive member community.",
      features: ["Video Comments", "Community Forums", "Peer Reviews", "Study Groups", "Mentorship Matching"],
      tier: "Premium+"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Monitor your learning progress with detailed analytics, time tracking, performance insights, and personalized improvement recommendations.",
      features: ["Watch Time Analytics", "Skill Progress Charts", "Learning Streaks", "Performance Insights", "Goal Tracking"],
      tier: "All Plans"
    }
  ]

  const membershipTiers = [
    {
      name: "Basic",
      icon: User,
      prices: {
        monthly: { amount: 29, display: "$29" },
        annual: { amount: 290, display: "$24.17", fullPrice: "$290" } // 10 months price for 12 months
      },
      description: "Perfect for beginners starting their reining journey",
      features: [
        "Access to foundational video library",
        "Basic progress tracking",
        "Mobile app access",
        "Community forum access",
        "Email support"
      ],
      popular: false,
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Premium",
      icon: Star,
      prices: {
        monthly: { amount: 49, display: "$49" },
        annual: { amount: 490, display: "$40.83", fullPrice: "$490" } // 10 months price for 12 months
      },
      description: "Comprehensive training for serious riders",
      features: [
        "Full video library access",
        "Structured learning programs",
        "Advanced progress analytics",
        "Community features & forums",
        "Priority email support",
        "Downloadable resources"
      ],
      popular: true,
      color: "from-teal-500 to-teal-600"
    },
    {
      name: "VIP",
      icon: Crown,
      prices: {
        monthly: { amount: 99, display: "$99" },
        annual: { amount: 990, display: "$82.50", fullPrice: "$990" } // 10 months price for 12 months
      },
      description: "Premium experience with live instruction",
      features: [
        "Everything in Premium",
        "Weekly live training sessions",
        "Live Q&A with instructors",
        "Session recordings library",
        "Priority community access",
        "Phone & video support"
      ],
      popular: false,
      color: "from-yellow-500 to-yellow-600"
    }
  ]

  const learningPath = [
    {
      step: 1,
      title: "Assessment & Onboarding",
      description: "Complete your skill assessment and get personalized learning recommendations",
      icon: Target,
      duration: "5 minutes"
    },
    {
      step: 2,
      title: "Structured Learning",
      description: "Follow your personalized curriculum with video lessons and practice exercises",
      icon: BookOpen,
      duration: "Self-paced"
    },
    {
      step: 3,
      title: "Community Engagement",
      description: "Connect with other riders, share progress, and get feedback from the community",
      icon: Users,
      duration: "Ongoing"
    },
    {
      step: 4,
      title: "Live Practice Sessions",
      description: "Apply your knowledge in live sessions with real-time instructor feedback",
      icon: Calendar,
      duration: "Weekly"
    },
    {
      step: 5,
      title: "Achievement & Mastery",
      description: "Earn certifications, unlock advanced content, and track your expertise growth",
      icon: Award,
      duration: "Milestone-based"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <CustomHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        {/* Subtle Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/api/media/file/AR5Z8336-2.jpg"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/60 to-black/70"></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent" />
        <div className="container px-4 max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span className="text-teal-400 font-medium text-sm">Premium Learning Platform</span>
            </motion.div>
            
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-teal-200 to-teal-400 bg-clip-text text-transparent leading-tight">
              Master Reining with
              <br />
              <span className="text-teal-400">Expert Guidance</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join our comprehensive digital learning platform designed by professionals. 
              From foundational techniques to competition mastery—your journey starts here.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-teal-500/25 transition-all duration-300">
                <Link href="/pricing" className="flex items-center gap-2">
                  Start Learning Today
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-teal-400/50 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400 px-8 py-4 text-lg backdrop-blur-sm">
                <Link href="#platform-features">Explore Features</Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-400 mb-2">500+</div>
                <div className="text-gray-400">Training Videos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-400 mb-2">10k+</div>
                <div className="text-gray-400">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-400 mb-2">15+</div>
                <div className="text-gray-400">Expert Instructors</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="platform-features" className="py-24 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="container px-4 max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="border-teal-500/50 text-teal-400 bg-teal-500/10 mb-6">
              Platform Features
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">Excel in Reining</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform combines cutting-edge technology with expert instruction 
              to deliver an unmatched learning experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {platformFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/50 rounded-2xl p-8 border border-gray-800/50 hover:border-teal-500/30 transition-all duration-500 hover:transform hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <IconComponent className="h-7 w-7 text-black" />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-1 ${
                          feature.tier === 'All Plans' 
                            ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                            : feature.tier === 'Premium+'
                            ? 'border-teal-500/50 text-teal-400 bg-teal-500/10'
                            : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                        }`}
                      >
                        {feature.tier}
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-200 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    <ul className="space-y-3">
                      {feature.features.map((item, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) }}
                          viewport={{ once: true }}
                          className="flex items-center gap-3 text-gray-300"
                        >
                          <CheckCircle className="h-4 w-4 text-teal-400 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent" />
        <div className="container px-4 max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="border-teal-500/50 text-teal-400 bg-teal-500/10 mb-6">
              Membership Plans
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
              Choose Your
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">Learning Journey</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From beginner-friendly basics to professional-level mastery, 
              find the perfect plan for your reining goals.
            </p>
          </motion.div>

          {/* Billing Period Tablist */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Tabs value={billingPeriod} onValueChange={(value: any) => setBillingPeriod(value)} className="max-w-md mx-auto">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
                <TabsTrigger value="annual" className="data-[state=active]:bg-teal-500 data-[state=active]:text-black">
                  Annual
                  <span className="ml-1 text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full">2 months free</span>
                </TabsTrigger>
                <TabsTrigger value="monthly" className="data-[state=active]:bg-teal-500 data-[state=active]:text-black">
                  Monthly
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Billing Period Info */}
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">
                {billingPeriod === 'annual' 
                  ? 'Get 2 months free with annual billing - prices shown as monthly equivalent'
                  : 'Monthly billing - upgrade or cancel anytime'
                }
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {membershipTiers.map((tier, index) => {
              const IconComponent = tier.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative group ${
                    tier.popular 
                      ? 'transform scale-105 lg:scale-110' 
                      : 'hover:transform hover:scale-105'
                  } transition-all duration-500`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <Badge className="bg-gradient-to-r from-teal-500 to-teal-600 text-black font-semibold px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className={`relative bg-gradient-to-br from-gray-900/90 to-gray-800/50 rounded-2xl p-8 border-2 ${
                    tier.popular 
                      ? 'border-teal-500/50 shadow-2xl shadow-teal-500/20' 
                      : 'border-gray-800/50 hover:border-teal-500/30'
                  } transition-all duration-500 backdrop-blur-sm h-full flex flex-col`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <div className="relative z-10 flex-1">
                      <div className="text-center mb-8">
                        <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                        <div className="flex items-baseline justify-center gap-1 mb-2">
                          <span className="text-4xl font-bold text-teal-400">{tier.prices[billingPeriod].display}</span>
                          <span className="text-gray-400">/mo</span>
                        </div>
                        {billingPeriod === 'annual' && (
                          <div className="text-sm text-teal-500 font-medium mb-1">get 2 months free</div>
                        )}
                        {billingPeriod === 'annual' && (
                          <div className="text-xs text-gray-400 mb-2">
                            {tier.prices.annual.fullPrice} billed annually
                          </div>
                        )}
                        <p className="text-gray-300 text-sm leading-relaxed">{tier.description}</p>
                      </div>
                      
                      <ul className="space-y-3 mb-8 flex-1">
                        {tier.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3 text-gray-300">
                            <CheckCircle className="h-4 w-4 text-teal-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Link 
                      href={`/checkout?plan=${tier.name}&price=${tier.prices[billingPeriod].amount}&billing=${billingPeriod}`}
                      className={`inline-flex items-center justify-center gap-2 w-full mt-auto px-4 py-3 rounded-md font-medium transition-all duration-300 relative z-20 ${
                        tier.popular
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold shadow-lg'
                          : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-teal-500/50'
                      }`}
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="container px-4 max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="border-teal-500/50 text-teal-400 bg-teal-500/10 mb-6">
              Learning Path
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
              Your Path to
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">Reining Mastery</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Follow our proven 5-step methodology that has helped thousands of riders 
              achieve their reining goals, from first lesson to competition success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            {learningPath.map((step, index) => {
              const IconComponent = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  {/* Connection Line */}
                  {index < learningPath.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-teal-500/50 to-teal-400/30 transform translate-x-8 z-0" />
                  )}
                  
                  <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/50 rounded-2xl p-6 border border-gray-800/50 hover:border-teal-500/30 transition-all duration-500 group-hover:transform group-hover:scale-105 backdrop-blur-sm text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="w-8 h-8 bg-teal-400 text-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-sm">
                        {step.step}
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-teal-200 transition-colors duration-300">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {step.description}
                      </p>
                      
                      <div className="inline-flex items-center gap-2 text-xs text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full">
                        <Clock className="h-3 w-3" />
                        {step.duration}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold px-12 py-4 text-lg shadow-lg hover:shadow-teal-500/25 transition-all duration-300">
              <Link href="/pricing" className="flex items-center gap-2">
                Begin Your Journey
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <p className="text-gray-400 text-sm mt-4">
              Join thousands of riders who've transformed their skills with our platform
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent" />
        <div className="container px-4 max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
                Ready to Transform
                <br />
                <span className="bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">Your Riding?</span>
              </h2>
              
              <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed">
                Join our community of passionate riders and start your journey to reining excellence today. 
                With expert guidance, structured learning, and cutting-edge technology, success is within reach.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold px-12 py-4 text-lg shadow-lg hover:shadow-teal-500/25 transition-all duration-300">
                  <Link href="/pricing" className="flex items-center gap-2">
                    Start Learning Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 px-8 py-4 text-lg backdrop-blur-sm">
                  <Link href="/contact">Have Questions?</Link>
                </Button>
              </div>
              
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-3 text-gray-400">
                  <CheckCircle className="h-5 w-5 text-teal-400" />
                  <span>30-Day Money Back Guarantee</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-400">
                  <CheckCircle className="h-5 w-5 text-teal-400" />
                  <span>Cancel Anytime</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-400">
                  <CheckCircle className="h-5 w-5 text-teal-400" />
                  <span>Expert Support Included</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="container px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="font-semibold text-white mb-4">JG Performance Horses</h3>
              <p className="text-gray-400 mb-4">
                Dedicated to excellence in equestrian training and horsemanship education.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-teal transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-400 hover:text-teal transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/eques-academy" className="text-gray-400 hover:text-teal transition-colors">
                    Academy
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-400 hover:text-teal transition-colors">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-teal transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.341-.09.381-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} JG Performance Horses. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
