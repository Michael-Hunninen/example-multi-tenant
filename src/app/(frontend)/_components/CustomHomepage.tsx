"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import CustomHeader from './CustomHeader'
import { Play, ChevronRight, User, CheckCircle, ArrowRight, Star, Crown, Quote, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'

// 3D Animated Testimony Slider Component
function TestimonySlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  
  const testimonials = [
    {
      id: 1,
      quote: "Working with Josiane has completely transformed my riding. Her expertise in reining fundamentals and advanced techniques helped me achieve my NRHA goals faster than I ever imagined possible.",
      author: "Sarah Mitchell",
      title: "NRHA Open Champion",
      location: "Texas",
      image: "/api/media/file/sarah-mitchell.jpg",
      rating: 5,
      achievement: "$50,000+ in earnings"
    },
    {
      id: 2,
      quote: "The personalized training approach at JG Performance Horses is unmatched. Every session builds on the last, creating a clear path to success. My horse and I have never been more confident in the arena.",
      author: "Michael Rodriguez",
      title: "AQHA World Show Qualifier",
      location: "Oklahoma",
      image: "/api/media/file/michael-rodriguez.jpg",
      rating: 5,
      achievement: "World Show Qualifier"
    },
    {
      id: 3,
      quote: "From a complete beginner to competing at regional shows, Josiane's structured program and incredible support system made it all possible. The online training videos are a game-changer.",
      author: "Emma Thompson",
      title: "Regional Champion",
      location: "North Carolina",
      image: "/api/media/file/emma-thompson.jpg",
      rating: 5,
      achievement: "Regional Champion"
    },
    {
      id: 4,
      quote: "The level of detail and personalized feedback in every lesson is extraordinary. JG Performance Horses doesn't just teach riding—they build champions with character and skill.",
      author: "David Chen",
      title: "Youth World Champion",
      location: "California",
      image: "/api/media/file/david-chen.jpg",
      rating: 5,
      achievement: "Youth World Champion"
    },
    {
      id: 5,
      quote: "The combination of traditional training methods with modern technology creates an unbeatable learning experience. I've improved more in 6 months than in my previous 3 years of training.",
      author: "Jessica Williams",
      title: "Amateur Champion",
      location: "Florida",
      image: "/api/media/file/jessica-williams.jpg",
      rating: 5,
      achievement: "Amateur Champion"
    }
  ]
  
  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])
  
  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }
  
  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }
  
  return (
    <div className="relative max-w-6xl mx-auto">
      {/* 3D Container with Perspective */}
      <div className="relative h-[500px] md:h-[400px] perspective-1000">
        <div className="relative w-full h-full preserve-3d">
          {testimonials.map((testimonial, index) => {
            const offset = index - currentIndex
            const isActive = offset === 0
            const isPrev = offset === -1 || (currentIndex === 0 && index === testimonials.length - 1)
            const isNext = offset === 1 || (currentIndex === testimonials.length - 1 && index === 0)
            
            return (
              <motion.div
                key={testimonial.id}
                className="absolute inset-0 w-full h-full"
                initial={false}
                animate={{
                  rotateY: offset * 20,
                  z: isActive ? 100 : offset > 0 ? -100 - (offset * 50) : -100 + (Math.abs(offset) * 50),
                  x: offset * 280,
                  opacity: Math.abs(offset) <= 1 ? 1 : 0,
                  scale: isActive ? 1 : 0.85,
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.23, 1, 0.32, 1],
                  opacity: { duration: 0.3 }
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  pointerEvents: isActive ? 'auto' : 'none',
                  zIndex: isActive ? 50 : Math.max(0, 40 - Math.abs(offset) * 10)
                }}
              >
                <div className={`relative h-full bg-gradient-to-br from-gray-900/95 to-gray-800/90 rounded-2xl border border-gray-700/50 backdrop-blur-lg shadow-2xl overflow-hidden transition-all duration-500 ${
                  isActive ? 'shadow-teal-500/20 border-teal-500/30' : ''
                }`}>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                        <Quote className="h-8 w-8 text-black" />
                      </div>
                    </div>
                    
                    {/* Testimonial Text */}
                    <blockquote className="text-lg md:text-xl text-gray-200 leading-relaxed text-center mb-8 flex-1 flex items-center justify-center">
                      <p className="italic">"{testimonial.quote}"</p>
                    </blockquote>
                    
                    {/* Author Info */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-black font-bold text-2xl shadow-lg mr-4">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div className="text-left">
                          <h4 className="text-xl font-bold text-white mb-1">{testimonial.author}</h4>
                          <p className="text-teal-400 font-medium mb-1">{testimonial.title}</p>
                          <p className="text-gray-400 text-sm">{testimonial.location}</p>
                        </div>
                      </div>
                      
                      {/* Achievement Badge */}
                      <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 px-4 py-2 rounded-full">
                        <Star className="h-4 w-4 text-teal-400 fill-current" />
                        <span className="text-teal-300 text-sm font-medium">{testimonial.achievement}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-transparent rounded-full blur-2xl" />
                  <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-teal-400/10 to-transparent rounded-full blur-xl" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="flex items-center justify-center mt-12 space-x-4">
        {/* Previous Button */}
        <motion.button
          onClick={prevTestimonial}
          className="w-12 h-12 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-teal-500/50 rounded-full flex items-center justify-center transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-teal-400 transition-colors" />
        </motion.button>
        
        {/* Dot Indicators */}
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-teal-500 shadow-lg shadow-teal-500/50'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
        
        {/* Next Button */}
        <motion.button
          onClick={nextTestimonial}
          className="w-12 h-12 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-teal-500/50 rounded-full flex items-center justify-center transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-teal-400 transition-colors" />
        </motion.button>
      </div>
      
      {/* Auto-play Toggle */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${
            isAutoPlaying
              ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
              : 'bg-gray-800 text-gray-400 border border-gray-600 hover:border-gray-500'
          }`}
        >
          {isAutoPlaying ? 'Auto-playing' : 'Paused'}
        </button>
      </div>
    </div>
  )
}

export default function CustomHomepage() {
  const [billingPeriod, setBillingPeriod] = useState<'annual' | 'monthly'>('annual')
  
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

  return (
    <div className="min-h-screen bg-black text-white">
      <CustomHeader />
      <main className="flex-1 relative z-0">
        {/* Hero Section - Full Screen with Professional Horse/Rider Image */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
          {/* Video Background with Overlay */}
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-20"
              style={{ filter: 'brightness(0.8)' }}
              onLoadedData={(e) => {
                const video = e.target as HTMLVideoElement;
                video.playbackRate = 0.75;
              }}
            >
              <source src="/api/media/file/Untitled%20design%20(22).mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 container px-4 text-left max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight"
              >
The Best Preparation for Tomorrow
                <span className="block text-teal-400 font-normal">Is Doing Your Best Today</span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                  Access world-class reining and ranch riding instruction through our comprehensive on-demand training library. 
                  Learn at your own pace with professional techniques from Josiane Gauthier and the JG Performance Horses team.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600 text-black px-8 py-3 text-lg">
                  <Link href="/pricing">
                    Start Your Subscription
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
                  <Link href="/about">Learn More</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section id="video" className="py-20 bg-black">
          <div className="container px-4 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                Ranch Riding Fundamentals
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                An informational DVD about Ranch Riding with Josiane Gauthier. 
                Maneuvers, Gates, Transitions, Lead Changes, Equipment & more!
              </p>
              <p className="text-lg text-teal-400 mb-12 font-semibold">
                Learn what it takes to reach the next level!
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-teal-500 hover:bg-teal-600 text-black rounded-full p-6"
                >
                  <Play className="w-8 h-8" />
                </Button>
              </div>
              <Image
                src="/placeholder.svg?height=720&width=1280"
                alt="Training video thumbnail"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="py-20 bg-gray-900">
          <div className="container px-4 max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
                  Championship
                  <span className="block font-bold text-teal-500">Proven Methods</span>
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Our training methodology has been refined through decades of competition success 
                  and countless hours perfecting the art of reining. We don't just teach techniques – 
                  we develop champions.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-teal-500 rounded mr-4 mt-1 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Professional Experience</h4>
                      <p className="text-gray-300">NRHA and AQHA professional trainer since 2012, earned over $350,000 as non-pro</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-teal-500 rounded mr-4 mt-1 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Individual Training Programs</h4>
                      <p className="text-gray-300">Each horse receives a customized program based on their mental and physical capabilities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-teal-500 rounded mr-4 mt-1 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Proven Philosophy</h4>
                      <p className="text-gray-300">Pressure and release training method focused on understanding how horses think and react</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Image
                  src="/api/media/file/posterpicture4.jpg"
                  alt="Professional horse training session"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Training Subscriptions Section */}
        <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative">
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
                Training Subscriptions
              </Badge>
              <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
                Master Reining with
                <br />
                <span className="bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">Expert Training</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Unlock professional reining training with our flexible subscription plans. Start your journey today with a 7-day free trial.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-12">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 text-teal-400">✓</div>
                  <span>7-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 text-teal-400">✓</div>
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 text-teal-400">✓</div>
                  <span>30-day money back guarantee</span>
                </div>
              </div>
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

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <p className="text-gray-400 mb-6">
                All plans include a 7-day free trial and 30-day money-back guarantee
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-teal-500/25 transition-all duration-300">
                <Link href="/checkout?plan=premium&price=59&interval=month&trial=true" className="flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* 3D Animated Testimony Slider */}
        <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent" />
          <div className="container px-4 max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="border-teal-500/50 text-teal-400 bg-teal-500/10 mb-6">
                Client Success Stories
              </Badge>
              <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
                What Our Riders
                <br />
                <span className="bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">Are Saying</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Real stories from real riders who've transformed their skills and achieved their reining dreams with JG Performance Horses.
              </p>
            </motion.div>

            <TestimonySlider />
          </div>
        </section>

        {/* Contact & Location Section */}
        <section className="py-20 bg-black">
          <div className="container px-4 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
                  Come Ride With Us!
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Ready to start your journey with JG Performance Horses? 
                  Contact us today to discuss your training goals.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-teal-500 rounded mt-1 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Office</h4>
                      <p className="text-gray-300">252.239.0025</p>
                      <p className="text-gray-300">jgphoffice@yahoo.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-teal-500 rounded mt-1 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Josiane Gauthier</h4>
                      <p className="text-gray-300">252.205.9945</p>
                      <p className="text-gray-300">jgperformancehorses@yahoo.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-teal-500 rounded mt-1 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Location</h4>
                      <p className="text-gray-300">7144 St Marys Church Road</p>
                      <p className="text-gray-300">Lucama, North Carolina 27851</p>
                      <p className="text-gray-400 text-sm mt-2">50 miles east of Raleigh, NC • Near I-95</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600 text-black">
                    <Link href="tel:2522390025">Call Now</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-teal-500 text-teal-400 hover:bg-teal-500/10">
                    <Link href="mailto:jgphoffice@yahoo.com">Send Email</Link>
                  </Button>
                </div>
              </motion.div>
              
              {/* Map/Location Visual */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center justify-center"
              >
                <div className="w-full h-96 bg-gray-800 rounded-lg border border-teal-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-black font-bold text-xl">📍</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Sunny Pines Farm</h3>
                    <p className="text-gray-400">Lucama, North Carolina</p>
                    <Button asChild className="mt-4 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 border border-teal-500/50">
                      <Link href="https://www.google.com/maps/place/7144+St+Marys+Church+Rd,+Lucama,+NC+27851" target="_blank">
                        View on Google Maps
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-800 to-black">
          <div className="container px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-white mb-6 md:text-4xl">
                Transform Your Riding Today
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Experience the difference that professional training and a supportive community can make in your equestrian journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-teal hover:bg-teal/90 text-black text-lg px-8 py-6"
                >
                  <Link href="/register">
                    Get Started Today
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                >
                  <Link href="/about">Learn About Us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

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
                    ></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.341-.09.381-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"
                      clipRule="evenodd"
                    ></path>
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
