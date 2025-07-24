"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, MessageSquare, Calendar, User } from 'lucide-react'
import CustomHeader from './CustomHeader'

export default function ContactPage() {
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
              Get In Touch
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Ready to start your reining journey? Contact us today to learn more about our subscription plans and training programs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
                    <p className="text-gray-300">Office: (252) 239-0025</p>
                    <p className="text-gray-300">Josiane Cell: (252) 205-9945</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                    <p className="text-gray-300">jgphoffice@yahoo.com</p>
                    <p className="text-gray-300">jgperformancehorses@yahoo.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Location</h3>
                    <p className="text-gray-300">7144 St Marys Church Road</p>
                    <p className="text-gray-300">Lucama, North Carolina 27851</p>
                    <p className="text-gray-300 text-sm mt-1">50 miles east of Raleigh, NC, near I-95</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Business Hours</h3>
                    <p className="text-gray-300">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-300">Saturday: 8:00 AM - 4:00 PM</p>
                    <p className="text-gray-300">Sunday: By appointment</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-teal-500/10 to-black border border-teal-500/30 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-8">Send us a Message</h2>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">First Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Last Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-teal-500 focus:outline-none transition-colors"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Subject</label>
                    <select className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-teal-500 focus:outline-none transition-colors">
                      <option>Subscription Information</option>
                      <option>Training Questions</option>
                      <option>Technical Support</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Message</label>
                    <textarea 
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-teal-500 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your riding experience and what you'd like to achieve..."
                    ></textarea>
                  </div>

                  <Button className="w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold py-3 text-lg">
                    Send Message
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">Quick Actions</h2>
            <p className="text-xl text-gray-300">
              Get started with your reining journey today.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-black to-gray-800 border border-gray-700 rounded-xl p-8 text-center hover:border-teal-500/50 transition-all duration-300"
            >
              <MessageSquare className="h-12 w-12 text-teal-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Start Free Trial</h3>
              <p className="text-gray-300 mb-6">
                Try our platform risk-free for 7 days and explore all features.
              </p>
              <Button asChild className="bg-teal-500 hover:bg-teal-600 text-black font-semibold w-full">
                <Link href="/pricing">Start Trial</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-black to-gray-800 border border-gray-700 rounded-xl p-8 text-center hover:border-teal-500/50 transition-all duration-300"
            >
              <Calendar className="h-12 w-12 text-teal-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Schedule Consultation</h3>
              <p className="text-gray-300 mb-6">
                Book a personal consultation to discuss your training goals.
              </p>
              <Button asChild variant="outline" className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-black w-full">
                <Link href="tel:2522059945">Call Now</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-black to-gray-800 border border-gray-700 rounded-xl p-8 text-center hover:border-teal-500/50 transition-all duration-300"
            >
              <Phone className="h-12 w-12 text-teal-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Call Directly</h3>
              <p className="text-gray-300 mb-6">
                Speak with our team directly about subscriptions and training.
              </p>
              <Button asChild variant="outline" className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-black w-full">
                <Link href="tel:2522390025">Office: (252) 239-0025</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container px-4 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">Need Help?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Our support team is here to help you get the most out of your training experience.
            </p>
            
            <div className="bg-gradient-to-r from-teal-500/10 to-black border border-teal-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-white mb-2">How do I access my subscription content?</h4>
                  <p className="text-gray-300 text-sm">Log in to your account and navigate to the training library to access all your subscription content.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Can I download videos for offline viewing?</h4>
                  <p className="text-gray-300 text-sm">Yes, premium and elite subscribers can download videos for offline viewing on mobile devices.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">How do I submit videos for review?</h4>
                  <p className="text-gray-300 text-sm">Premium and elite subscribers can submit videos through the coaching portal in their dashboard.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">When are live Q&A sessions held?</h4>
                  <p className="text-gray-300 text-sm">Live sessions are scheduled monthly for basic subscribers and weekly for premium/elite subscribers.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
