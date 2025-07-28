'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, User, Settings, Phone, BookOpen, DollarSign, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBrandingContext } from '@/contexts/BrandingContext'

export default function CustomHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { branding, loading } = useBrandingContext()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Handle scroll detection for blur effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      {/* Transparent Header with Scroll-Based Blur */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6">
          {/* Hamburger Menu - Left Corner with larger touch target */}
          <button
            onClick={toggleMenu}
            className="p-2 sm:p-3 text-white hover:text-teal-300 transition-colors z-50 relative group min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={isMenuOpen ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {isMenuOpen ? <X size={24} className="sm:w-7 sm:h-7" /> : <Menu size={24} className="sm:w-7 sm:h-7" />}
            </motion.div>
            <div className="absolute inset-0 bg-teal-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Center Logo - Tenant Branded with responsive sizing */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 absolute left-1/2 transform -translate-x-1/2 group max-w-[calc(100vw-160px)] sm:max-w-none">
            {!loading && branding?.logo?.url ? (
              <div className="relative">
                <Image
                  src={branding.logo.url}
                  alt={branding.name || 'Logo'}
                  width={branding.logo.width || 120}
                  height={branding.logo.height || 40}
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300 max-w-full"
                  priority
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-black font-bold text-sm sm:text-lg md:text-xl">
                    {branding?.name?.[0] || 'J'}
                  </span>
                </div>
                <span className="text-white font-bold text-sm sm:text-lg md:text-xl tracking-wide truncate">
                  {branding?.name || 'JG Performance Horses'}
                </span>
              </div>
            )}
          </Link>

          {/* Right CTA Button - Responsive sizing */}
          <Button asChild className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Link href="/pricing">
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
            </Link>
          </Button>
        </div>
      </motion.header>

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
              className="fixed top-0 left-0 h-full z-50 w-full max-w-[320px] sm:max-w-[350px]"
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
                  <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-gray-700/50">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-black font-bold text-base sm:text-lg">R</span>
                      </div>
                      <div>
                        <h2 className="text-white font-semibold text-lg sm:text-xl tracking-wide">Navigation</h2>
                        <p className="text-gray-400 text-xs sm:text-sm">Reining Academy</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <nav className="flex-1 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
                    <ul className="space-y-1 sm:space-y-2">
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
                              className="group flex items-center space-x-3 sm:space-x-4 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-white hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-teal-600/10 transition-all duration-300 relative overflow-hidden min-h-[48px] active:scale-95"
                            >
                              {/* Hover effect background */}
                              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>
                              
                              {/* Icon */}
                              <div className="relative z-10 p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-gray-800/50 group-hover:bg-teal-500/20 transition-all duration-300">
                                <Icon size={18} className="sm:w-5 sm:h-5 text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
                              </div>
                              
                              {/* Label */}
                              <span className="relative z-10 font-medium text-base sm:text-lg group-hover:text-teal-100 transition-colors duration-300">
                                {item.label}
                              </span>
                              
                              {/* Subtle arrow indicator */}
                              <div className="relative z-10 ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 border-r-2 border-t-2 border-teal-400 rotate-45"></div>
                              </div>
                            </Link>
                          </motion.li>
                        )
                      })}
                    </ul>
                  </nav>

                  {/* Elegant Footer CTA */}
                  <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t border-gray-700/50">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button 
                        asChild 
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-h-[48px]"
                      >
                        <Link href="/pricing" onClick={toggleMenu}>
                          Start Your Training
                        </Link>
                      </Button>
                      <p className="text-gray-400 text-xs sm:text-sm text-center mt-3 sm:mt-4 font-light">
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
