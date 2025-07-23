"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Award, Users, Video, Clock } from 'lucide-react'
import CustomHeader from './CustomHeader'
import SponsorsCarousel from './SponsorsCarousel'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <CustomHeader />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        {/* Subtle Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/api/media/file/AR5Z8033.jpg"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/60 to-black/70"></div>
        </div>
        <div className="container px-4 py-20 max-w-6xl mx-auto relative z-10">
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
              <div className="aspect-square bg-gradient-to-br from-teal-500/20 to-black rounded-2xl p-4 border border-teal-500/30 overflow-hidden">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <Image
                    src="/api/media/file/AR5Z1532.jpg"
                    alt="Josiane Gauthier reining"
                    fill
                    className="object-cover"
                    priority
                  />
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

      {/* The Ranch Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
        {/* Ranch Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/api/media/file/gate-web-min.jpg"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-black/70"></div>
        </div>
        <div className="container px-4 max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">The Ranch</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A legacy of excellence built on decades of dedication to the reining horse industry
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-teal-500/10 to-black border border-teal-500/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Sunny Pines Farm</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Josiane Gauthier Performance Horses operates on the beautiful family-owned ranch in Lucama, NC. 
                  "Sunny Pines Farm" was founded by Josiane's father in 1993. This ranch was originally the home 
                  of legendary Cutter Dick Pieper. When he relocated to Texas, the opportunity presented itself 
                  and Francois moved his training facility from Quebec, Canada to North Carolina.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Having undergone quite a few transformations over the past 25 years, the ranch offers an 
                  enormous training and breeding program. Josiane moved to North Carolina in 2000 to join the 
                  family business and learn all aspects of the reining horse industry.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-teal-500/10 to-black border border-teal-500/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Early Experience</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  As a young woman, Josiane focused on running her dad's breeding operation. Through the years, 
                  she managed the ranch and over 200 to 250 horses during peak season. The breeding program was 
                  well-rounded, standing 5 to 8 stallions per season, breeding 100 to 150 mares including 
                  shipping cool semen, frozen, embryo transfer, and AI.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  During this very busy time, she kept her non-pro status showing her father's horses, and helped 
                  training and preparing sale horses. Through her career as a non-pro she earned over $350,000 
                  and multiple major events.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Current Operations Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">JG Performance Horses Today</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional training and coaching with NRHA lifetime earnings of over $690,000
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
                <p className="text-gray-300 leading-relaxed">
                  In 2016 Josiane and her husband Russell had the opportunity to purchase Sunny Pines Farm, 
                  and have been running JG Performance Horses on their ranch since. Through her professional 
                  career, Josiane has increased her NRHA lifetime earnings to $690,000, building a very large 
                  team of non-pros and elite aged event horses.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Her main goal is to train and show L4 open caliber prospects and continue to help non-pros 
                  learn and compete at their own level. JG Performance Horses keeps approximately 40 selected 
                  horses in training with a full care program tailored to each individual horse.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-teal-500/10 to-black border border-teal-500/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Training Programs</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Yearling and prospect selection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">2 Year old training and evaluation for Futurity prospects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Open and Non Pro Futurity and derby aged events</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Green Reiner to L4 Non Pro show horses training and coaching</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
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
                My mission is to make professional reining training accessible to everyone through our comprehensive subscription platform. 
                We guide each individual and mentor them through all the steps, whether you're seeking to purchase top yearlings for resale, 
                buying a reining horse to pursue your own show career, or simply learning the fundamentals.
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

      {/* Sponsors Carousel */}
      <SponsorsCarousel />

      {/* Custom Footer */}
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
                  <Link href="/about" className="text-gray-400 hover:text-teal-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-400 hover:text-teal-400 transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/eques-academy" className="text-gray-400 hover:text-teal-400 transition-colors">
                    Academy
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-400 hover:text-teal-400 transition-colors">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
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
