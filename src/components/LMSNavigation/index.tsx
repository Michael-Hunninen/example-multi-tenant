'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Play, 
  User, 
  Settings, 
  LogOut,
  ChevronDown 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/LMSAuth/AuthWrapper'

// No props needed anymore as we're using auth context

export const LMSNavigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const currentPath = usePathname() || '/'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, requiresAuth: true },
    { name: 'Courses', href: '/courses', icon: BookOpen, requiresAuth: false },
    { name: 'Videos', href: '/videos', icon: Play, requiresAuth: true },
    { name: 'About', href: '/about', icon: null, requiresAuth: false },
  ]

  const userMenuItems = [
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Sign Out', href: '/logout', icon: LogOut },
  ]

  const filteredNavItems = navigationItems.filter(item => 
    !item.requiresAuth || isAuthenticated
  )

  return (
    <header className="border-b border-teal/20 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="JG Performance Horses Logo"
            width={40}
            height={40}
            className="rounded"
          />
          <span className="text-xl font-bold text-white">JG Performance Horses</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {filteredNavItems.map((item) => {
            const IconComponent = item.icon
            const isActive = currentPath === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal/20 text-teal'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Menu / Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center">
                  <span className="text-black font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <span>{user?.name || 'Student'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg py-1">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-gray-300">{user?.name || 'Student'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.roles?.[0] || 'basic'} Member</p>
                  </div>
                  {userMenuItems.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <IconComponent className="w-4 h-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-teal hover:bg-teal/90 text-black"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700">
          <nav className="px-4 py-4 space-y-2">
            {filteredNavItems.map((item) => {
              const IconComponent = item.icon
              const isActive = currentPath === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal/20 text-teal'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  {item.name}
                </Link>
              )
            })}
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-700">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 py-2">
                    <p className="text-sm text-gray-300">{user?.name || 'Student'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.roles?.[0] || 'basic'} Member</p>
                  </div>
                  {userMenuItems.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <IconComponent className="w-4 h-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-sm bg-teal text-black hover:bg-teal/90 rounded-md transition-colors text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
