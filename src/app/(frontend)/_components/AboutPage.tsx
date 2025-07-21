"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronRight, Award, Users, Video, Clock } from 'lucide-react'
import CustomHeader from './CustomHeader'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <CustomHeader />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-teal-400 bg-clip-text text-transparent">
                Meet Josiane Gauthier
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                NRHA and AQHA professional trainer bringing decades of expertise to your reining journey through our comprehensive subscription platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-teal-500 hover:bg-teal-600 text-black font-semibold px-8 py-3">
                  <Link href="/pricing">
                    Start Learning Today
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-black px-8 py-3">
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-teal-500/20 to-black rounded-2xl p-8 border border-teal-500/30">
                <div className="w-full h-full bg-gray-800 rounded-xl flex items-center justify-center">
                  <p className="text-gray-400 text-center">Professional Photo<br />Coming Soon</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">My Journey</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From Sunny Pines Farm to professional training - a story of passion, dedication, and excellence in reining.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="border-l-4 border-teal-500 pl-6">
                  <h3 className="text-2xl font-bold text-white mb-3">Early Beginnings</h3>
                  <p className="text-gray-300 leading-relaxed">
                    I joined Sunny Pines Farm in 2000, a family ranch founded by my father Francois in 1993. Originally home to legendary cutter Dick Pieper, our farm became the foundation for my reining career.
                  </p>
                </div>
                
                <div className="border-l-4 border-teal-500 pl-6">
                  <h3 className="text-2xl font-bold text-white mb-3">Professional Career</h3>
                  <p className="text-gray-300 leading-relaxed">
                    After earning over $350,000 in major events as a non-pro, I turned professional in 2012. Since then, I've dedicated my career to training both horses and riders in the art of reining.
                  </p>
                </div>
                
                <div className="border-l-4 border-teal-500 pl-6">
                  <h3 className="text-2xl font-bold text-white mb-3">Training Philosophy</h3>
                  <p className="text-gray-300 leading-relaxed">
                    I believe in individual training programs based on each horse's mental and physical capability, using pressure and release methods to build better riders and showmanship.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-gradient-to-br from-teal-500/10 to-black border border-teal-500/30 rounded-xl p-6 text-center">
                <Award className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-white mb-2">$350K+</h4>
                <p className="text-gray-300">Earnings as Non-Pro</p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-500/10 to-black border border-teal-500/30 rounded-xl p-6 text-center">
                <Users className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-white mb-2">13+</h4>
                <p className="text-gray-300">Years Professional</p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-500/10 to-black border border-teal-500/30 rounded-xl p-6 text-center">
                <Video className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-white mb-2">100+</h4>
                <p className="text-gray-300">Training Videos</p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-500/10 to-black border border-teal-500/30 rounded-xl p-6 text-center">
                <Clock className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-white mb-2">24/7</h4>
                <p className="text-gray-300">Access to Content</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container px-4 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">Our Mission</h2>
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              "The best preparation for tomorrow, is doing your best today!"
            </p>
            <div className="bg-gradient-to-r from-teal-500/10 to-black border border-teal-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                My mission is to make professional reining training accessible to everyone through our comprehensive subscription platform. Whether you're a beginner or an experienced rider, our on-demand training system provides the tools and knowledge you need to excel.
              </p>
              <Button asChild className="bg-teal-500 hover:bg-teal-600 text-black font-semibold px-8 py-4 text-lg">
                <Link href="/pricing">
                  Join Our Community
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
