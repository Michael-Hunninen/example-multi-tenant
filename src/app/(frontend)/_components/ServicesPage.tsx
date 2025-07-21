"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Play, Users, Calendar, Award, ChevronRight, Video, BookOpen, MessageCircle } from 'lucide-react'
import CustomHeader from './CustomHeader'

export default function ServicesPage() {
  const services = [
    {
      icon: Video,
      title: "On-Demand Video Library",
      description: "Access hundreds of professional training videos covering all aspects of reining, from basic fundamentals to advanced techniques.",
      features: ["HD video quality", "Mobile-friendly", "Downloadable content", "Progress tracking"]
    },
    {
      icon: Users,
      title: "Live Q&A Sessions",
      description: "Join monthly live sessions where you can ask questions directly and get personalized advice from Josiane.",
      features: ["Interactive sessions", "Real-time feedback", "Community discussion", "Session recordings"]
    },
    {
      icon: MessageCircle,
      title: "Personal Coaching",
      description: "Get one-on-one guidance through video submissions and personalized feedback on your riding technique.",
      features: ["Video analysis", "Custom training plans", "Progress monitoring", "Direct communication"]
    },
    {
      icon: BookOpen,
      title: "Training Resources",
      description: "Comprehensive guides, exercises, and training materials to supplement your video learning experience.",
      features: ["Downloadable guides", "Exercise routines", "Training schedules", "Progress worksheets"]
    }
  ]

  const disciplines = [
    {
      title: "Reining Fundamentals",
      description: "Master the basic patterns and techniques that form the foundation of successful reining.",
      level: "Beginner to Intermediate"
    },
    {
      title: "Advanced Reining",
      description: "Perfect your spins, stops, and lead changes with professional-level training techniques.",
      level: "Intermediate to Advanced"
    },
    {
      title: "Ranch Riding",
      description: "Learn the popular discipline of ranch riding with comprehensive training programs.",
      level: "All Levels"
    },
    {
      title: "Competition Preparation",
      description: "Get ready for shows with specialized training focused on competition success.",
      level: "Intermediate to Advanced"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <CustomHeader />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container px-4 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-teal-400 bg-clip-text text-transparent">
              Professional Training Services
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive reining education through our subscription-based platform, designed to take your riding to the next level.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild className="bg-teal-500 hover:bg-teal-600 text-black font-semibold px-8 py-3">
                <Link href="/pricing">
                  View Subscription Plans
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-black px-8 py-3">
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">What's Included</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every subscription includes access to our comprehensive training ecosystem designed for riders of all levels.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-teal-500/10 to-black border border-teal-500/30 rounded-xl p-8 hover:border-teal-500/50 transition-all duration-300"
              >
                <service.icon className="h-12 w-12 text-teal-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-teal-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Disciplines */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">Training Disciplines</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized training programs covering all aspects of western riding and competition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {disciplines.map((discipline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-black to-gray-800 border border-gray-700 rounded-xl p-8 hover:border-teal-500/50 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{discipline.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{discipline.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-teal-400 font-semibold">{discipline.level}</span>
                  <Award className="h-6 w-6 text-teal-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Journey */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">Your Learning Journey</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Follow a structured path from beginner to advanced, with personalized guidance every step of the way.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Start Learning</h3>
              <p className="text-gray-300 leading-relaxed">
                Begin with fundamental techniques and basic reining patterns designed for your skill level.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Practice & Progress</h3>
              <p className="text-gray-300 leading-relaxed">
                Apply what you've learned with guided practice sessions and track your improvement over time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Master & Compete</h3>
              <p className="text-gray-300 leading-relaxed">
                Perfect advanced techniques and prepare for competition with professional-level training.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button asChild className="bg-teal-500 hover:bg-teal-600 text-black font-semibold px-8 py-4 text-lg">
              <Link href="/pricing">
                Start Your Journey Today
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
