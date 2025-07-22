"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from "next/image"
import { motion } from "framer-motion"
import { Play, ChevronRight } from 'lucide-react'
import CustomHeader from './CustomHeader'

export default function CustomHomepage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <CustomHeader />
      <main className="flex-1 relative z-0">
        {/* Hero Section - Full Screen with Professional Horse/Rider Image */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gray-800"></div>
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
                  src="/placeholder.svg?height=600&width=800"
                  alt="Professional horse training session"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-black">
          <div className="container px-4 max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                Training Subscriptions
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
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
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900/80 p-8 rounded-lg border border-gray-700 hover:border-teal-500/50 transition-all duration-300"
                >
                  <h3 className="text-2xl font-semibold text-white mb-4">Basic</h3>
                  <p className="text-gray-400 mb-4">Perfect for beginners starting their reining journey</p>
                  <div className="text-3xl font-bold text-teal-400 mb-6">$29<span className="text-lg text-gray-400">/month</span></div>
                  <ul className="text-gray-300 text-sm mb-6 space-y-2 text-left">
                    <li>• Access to fundamental training videos</li>
                    <li>• Basic reining patterns and techniques</li>
                    <li>• Monthly group Q&A sessions</li>
                    <li>• Training progress tracking</li>
                    <li>• Mobile app access</li>
                    <li>• Community forum access</li>
                  </ul>
                  <Button asChild className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                    <Link href="/checkout?plan=basic&price=29&interval=month">Start Basic Plan</Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-teal-500/10 p-8 rounded-lg border-2 border-teal-500 relative"
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Premium</h3>
                  <p className="text-gray-300 mb-4">Comprehensive training for serious riders</p>
                  <div className="text-3xl font-bold text-teal-400 mb-6">$59<span className="text-lg text-gray-400">/month</span></div>
                  <ul className="text-gray-300 text-sm mb-6 space-y-2 text-left">
                    <li>• Everything in Basic plan</li>
                    <li>• Advanced training techniques</li>
                    <li>• Weekly live Q&A sessions</li>
                    <li>• Video submission reviews</li>
                    <li>• Personalized training plans</li>
                    <li>• Direct messaging with trainers</li>
                    <li>• Competition preparation guides</li>
                    <li>• Priority support</li>
                  </ul>
                  <Button asChild className="w-full bg-teal-500 hover:bg-teal-600 text-black">
                    <Link href="/checkout?plan=premium&price=59&interval=month">Start Premium Plan</Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-gray-900/80 p-8 rounded-lg border border-gray-700 hover:border-teal-500/50 transition-all duration-300"
                >
                  <h3 className="text-2xl font-semibold text-white mb-4">Elite</h3>
                  <p className="text-gray-400 mb-4">Professional-level training and personal coaching</p>
                  <div className="text-3xl font-bold text-teal-400 mb-6">$99<span className="text-lg text-gray-400">/month</span></div>
                  <ul className="text-gray-300 text-sm mb-6 space-y-2 text-left">
                    <li>• Everything in Premium plan</li>
                    <li>• One-on-one video coaching sessions</li>
                    <li>• Custom training program development</li>
                    <li>• Competition strategy planning</li>
                    <li>• Phone consultations</li>
                    <li>• Early access to new content</li>
                    <li>• Exclusive masterclass sessions</li>
                    <li>• Show preparation support</li>
                  </ul>
                  <Button asChild className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                    <Link href="/checkout?plan=elite&price=99&interval=month">Start Elite Plan</Link>
                  </Button>
                </motion.div>
              </div>
              <div className="text-center">
                <p className="text-gray-400 mb-4">All plans include a 7-day free trial and 30-day money-back guarantee</p>
                <Button asChild className="bg-teal-500 hover:bg-teal-600 text-black font-semibold px-8 py-3 text-lg">
                  <Link href="/checkout?plan=premium&price=59&interval=month&trial=true">Start Free Trial</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 bg-black">
          <div className="container px-4 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <blockquote className="text-2xl md:text-3xl font-light text-white mb-8 leading-relaxed italic">
                "The level of expertise and dedication to excellence here is unmatched. 
                My horse and I have achieved results we never thought possible."
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-teal-500 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-black font-bold text-xl">S</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">Sarah Mitchell</div>
                  <div className="text-teal-500">NRHA Open Champion</div>
                </div>
              </div>
            </motion.div>
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
