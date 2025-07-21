'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, User, Settings, Phone, BookOpen, DollarSign, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CustomHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: User },
    { href: '/services', label: 'Services', icon: Briefcase },
    { href: '/pricing', label: 'Pricing', icon: DollarSign },
    { href: '/contact', label: 'Contact', icon: Phone },
    { href: '/dashboard', label: 'Dashboard', icon: BookOpen },
  ]

  return (
    <>
      {/* Minimal Header with Hamburger on Left */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-sm">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Hamburger Menu - Left Corner */}
          <button
            onClick={toggleMenu}
            className="p-2 text-teal-400 hover:text-teal-300 transition-colors z-50 relative"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={isMenuOpen ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>

          {/* Center Logo */}
          <Link href="/" className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">R</span>
            </div>
            <span className="text-white font-semibold text-lg">Reining Academy</span>
          </Link>

          {/* Right CTA Button */}
          <Button asChild className="bg-teal-500 hover:bg-teal-600 text-black text-sm px-4 py-2">
            <Link href="/pricing">Start Subscription</Link>
          </Button>
        </div>
      </header>

      {/* Sleek Angled Side Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />

            {/* Sleek Angled Navigation Panel */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ 
                type: 'spring', 
                damping: 30, 
                stiffness: 300,
                opacity: { duration: 0.2 }
              }}
              className="fixed top-0 left-0 h-full z-50"
              style={{ width: '350px', maxWidth: '85vw' }}
            >
              {/* Main Navigation Container with Angled Right Edge */}
              <div 
                className="h-full bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 60px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 60px) 100%, 0 100%)'
                }}
              >
                {/* Subtle teal glow effect */}
                <div 
                  className="absolute top-0 right-0 h-full w-2 bg-gradient-to-b from-teal-400 via-teal-500 to-teal-600 opacity-60"
                  style={{
                    clipPath: 'polygon(0 0, 100% 40px, 100% calc(100% - 40px), 0 100%)'
                  }}
                ></div>

                {/* Content Container */}
                <div className="relative h-full flex flex-col p-0">
                  {/* Elegant Header */}
                  <div className="px-8 py-6 border-b border-gray-700/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-black font-bold text-lg">R</span>
                      </div>
                      <div>
                        <h2 className="text-white font-semibold text-xl tracking-wide">Navigation</h2>
                        <p className="text-gray-400 text-sm">Reining Academy</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <nav className="flex-1 py-8 px-4">
                    <ul className="space-y-2">
                      {menuItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <motion.li
                            key={item.href}
                            initial={{ opacity: 0, x: -40, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ 
                              delay: index * 0.08 + 0.15,
                              type: 'spring',
                              damping: 20,
                              stiffness: 300
                            }}
                          >
                            <Link
                              href={item.href}
                              onClick={toggleMenu}
                              className="group flex items-center space-x-4 px-6 py-4 rounded-xl text-white hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-teal-600/10 transition-all duration-300 relative overflow-hidden"
                            >
                              {/* Hover effect background */}
                              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                              
                              {/* Icon */}
                              <div className="relative z-10 p-2 rounded-lg bg-gray-800/50 group-hover:bg-teal-500/20 transition-all duration-300">
                                <Icon size={20} className="text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
                              </div>
                              
                              {/* Label */}
                              <span className="relative z-10 font-medium text-lg group-hover:text-teal-100 transition-colors duration-300">
                                {item.label}
                              </span>
                              
                              {/* Subtle arrow indicator */}
                              <div className="relative z-10 ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                <div className="w-2 h-2 border-r-2 border-t-2 border-teal-400 rotate-45"></div>
                              </div>
                            </Link>
                          </motion.li>
                        )
                      })}
                    </ul>
                  </nav>

                  {/* Elegant Footer CTA */}
                  <div className="px-8 py-6 border-t border-gray-700/50">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button 
                        asChild 
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Link href="/pricing" onClick={toggleMenu}>
                          Start Your Subscription
                        </Link>
                      </Button>
                      <p className="text-gray-400 text-sm text-center mt-4 font-light">
                        Professional training at your fingertips
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
