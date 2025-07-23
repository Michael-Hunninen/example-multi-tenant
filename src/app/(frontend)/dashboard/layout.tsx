"use client"

import { Suspense, useState, useEffect } from 'react'
import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Search, Bell, ChevronDown, User as UserIcon, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import DashboardSearch from '@/components/DashboardSearch'
import NotificationsDropdown from '@/components/NotificationsDropdown'
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileBottomNav } from "@/components/MobileBottomNav"
import { cn } from "@/utilities/cn"
import { AuthGuard, useAuth, AuthProvider } from '@/components/LMSAuth/AuthWrapper'
import { useBranding } from '@/hooks/useBranding'
import GenericDashboardLayout from '../_components/GenericDashboardLayout'
import TenantAccessGuard from '../_components/TenantAccessGuard'
import PWAMetadata from '@/components/PWAMetadata'
import Head from 'next/head'

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface DashboardContentProps {
  children: React.ReactNode;
}

function DashboardContent({ children }: DashboardContentProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { branding, loading: brandingLoading } = useBranding()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [customPagesEnabled, setCustomPagesEnabled] = useState<boolean | null>(null)
  const [layoutLoading, setLayoutLoading] = useState(true)
  
  useEffect(() => {
    async function checkCustomPagesStatus() {
      try {
        // Get current domain from window location
        const currentDomain = window.location.host
        
        // Fetch domain info to check if custom pages are enabled
        const response = await fetch(`/api/domain-info?domain=${currentDomain}`)
        if (response.ok) {
          const domainInfo = await response.json()
          setCustomPagesEnabled(domainInfo?.enableCustomPages === true)
        } else {
          // Default to false if we can't fetch domain info
          setCustomPagesEnabled(false)
        }
      } catch (error) {
        console.error('Error checking custom pages status:', error)
        // Default to false on error
        setCustomPagesEnabled(false)
      } finally {
        setLayoutLoading(false)
      }
    }
    
    checkCustomPagesStatus()
  }, [])
  
  // Show loading while we determine which layout to use
  if (layoutLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }
  
  // If custom pages are NOT enabled, use the generic layout
  if (customPagesEnabled === false) {
    return <GenericDashboardLayout>{children}</GenericDashboardLayout>
  }
  
  // Otherwise, use the branded JG Performance Horses layout (rest of existing code)

  // AuthGuard ensures user is not null, but we add safety checks for TypeScript
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden">
      <PWAMetadata 
        tenantName={branding?.name || undefined}
        tenantDescription={undefined}
        themeColor="#14b8a6"
      />
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex flex-col bg-gray-900/95 backdrop-blur-sm border-r border-gray-800/50 fixed top-0 left-0 bottom-0 z-10 transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="p-4 border-b border-gray-800/50 flex items-center justify-between">
          <Link href="/dashboard" className={cn(
            "flex items-center gap-3 transition-all duration-200",
            sidebarCollapsed && "justify-center"
          )}>
            {branding?.logo?.url ? (
              <Image
                src={branding.logo.url}
                alt={`${branding.name} Logo`}
                width={branding.logo.width || 32}
                height={branding.logo.height || 32}
                className="max-w-[32px] max-h-[32px] object-contain flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {branding?.name?.charAt(0) || 'L'}
                </span>
              </div>
            )}
            {!sidebarCollapsed && (
              <span className="text-lg font-bold text-white truncate">
                {branding?.name || 'LMS'}
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <nav className={cn(
          "flex-1 overflow-y-auto transition-all duration-300",
          sidebarCollapsed ? "px-2 py-4" : "p-4"
        )}>
          <div className="space-y-1">
            <Button
              variant="ghost"
              asChild
              className={cn(
                "w-full transition-all duration-200 hover:bg-gray-800/50",
                sidebarCollapsed ? "justify-center px-2" : "justify-start px-3",
                pathname === "/dashboard" 
                  ? 'text-teal-400 bg-teal-500/10 border-r-2 border-teal-400 hover:text-white' 
                  : 'text-gray-300 hover:text-white'
              )}
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                {!sidebarCollapsed && <span className="font-medium">Dashboard</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className={cn(
                "w-full transition-all duration-200 hover:bg-gray-800/50",
                sidebarCollapsed ? "justify-center px-2" : "justify-start px-3",
                pathname.startsWith("/dashboard/videos") 
                  ? 'text-teal-400 bg-teal-500/10 border-r-2 border-teal-400 hover:text-white' 
                  : 'text-gray-300 hover:text-white'
              )}
            >
              <Link href="/dashboard/videos" className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
                  <path d="m22 8-6 4 6 4V8Z" />
                  <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                </svg>
                {!sidebarCollapsed && <span className="font-medium">Library</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className={cn(
                "w-full transition-all duration-200 hover:bg-gray-800/50",
                sidebarCollapsed ? "justify-center px-2" : "justify-start px-3",
                pathname.startsWith("/dashboard/programs") 
                  ? 'text-teal-400 bg-teal-500/10 border-r-2 border-teal-400 hover:text-white' 
                  : 'text-gray-300 hover:text-white'
              )}
            >
              <Link href="/dashboard/programs" className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                {!sidebarCollapsed && <span className="font-medium">Programs</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className={cn(
                "w-full transition-all duration-200 hover:bg-gray-800/50",
                sidebarCollapsed ? "justify-center px-2" : "justify-start px-3",
                pathname.startsWith("/dashboard/lessons") 
                  ? 'text-teal-400 bg-teal-500/10 border-r-2 border-teal-400 hover:text-white' 
                  : 'text-gray-300 hover:text-white'
              )}
            >
              <Link href="/dashboard/lessons" className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                {!sidebarCollapsed && <span className="font-medium">Live Lessons</span>}
              </Link>
            </Button>
            
            <div className="my-4 border-t border-gray-800/50" />
            
            <Button
              variant="ghost"
              asChild
              className={cn(
                "w-full transition-all duration-200 hover:bg-gray-800/50",
                sidebarCollapsed ? "justify-center px-2" : "justify-start px-3",
                pathname.startsWith("/dashboard/profile") 
                  ? 'text-teal-400 bg-teal-500/10 border-r-2 border-teal-400 hover:text-white' 
                  : 'text-gray-300 hover:text-white'
              )}
            >
              <Link href="/dashboard/profile" className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="font-medium">Profile</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className={cn(
                "w-full transition-all duration-200 hover:bg-gray-800/50",
                sidebarCollapsed ? "justify-center px-2" : "justify-start px-3",
                pathname.startsWith("/dashboard/settings") 
                  ? 'text-teal-400 bg-teal-500/10 border-r-2 border-teal-400 hover:text-white' 
                  : 'text-gray-300 hover:text-white'
              )}
            >
              <Link href="/dashboard/settings" className="flex items-center gap-3">
                <Settings className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="font-medium">Settings</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                // Trigger the walkthrough by dispatching a custom event
                window.dispatchEvent(new CustomEvent('startTutorial'))
              }}
              className={cn(
                "w-full transition-all duration-200 hover:bg-gray-800/50",
                sidebarCollapsed ? "justify-center px-2" : "justify-start px-3",
                'text-gray-300 hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6"/>
                  <path d="m15.14 8.86 4.24-4.24m-4.24 10.76 4.24 4.24"/>
                  <path d="m8.86 8.86-4.24-4.24m4.24 10.76-4.24 4.24"/>
                </svg>
                {!sidebarCollapsed && <span className="font-medium">Tutorial</span>}
              </div>
            </Button>
            {/* Admin-only section */}
            {user.roles && (user.roles.includes('admin') || user.roles.includes('super-admin')) && (
              <>
                <div className="my-4 border-t border-gray-800/50" />
                {!sidebarCollapsed && (
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-3 font-medium">Admin</p>
                )}
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full transition-all duration-200 hover:bg-gray-800/50",
                    sidebarCollapsed ? "justify-center px-2" : "justify-start px-3",
                    'text-gray-300 hover:text-white'
                  )}
                >
                  <Link href="/admin" className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {!sidebarCollapsed && <span className="font-medium">Admin Panel</span>}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
        
        {/* User Profile */}
        <div className={cn(
          "border-t border-gray-800/50 transition-all duration-300",
          sidebarCollapsed ? "p-2" : "p-4"
        )}>
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{user?.name || user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                size="sm"
                className="w-full text-red-400 border-red-400/20 hover:bg-red-400/10 hover:text-red-300 transition-colors"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex justify-center">
              <Button 
                onClick={handleSignOut}
                variant="ghost" 
                size="sm"
                className="h-10 w-10 p-0 text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors"
                title="Sign Out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "md:pl-16" : "md:pl-64"
      )}>
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-gray-950/95 backdrop-blur-sm sticky top-0 z-20 w-full flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Mobile menu button - only show on mobile when sidebar is hidden */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-10 w-10 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </div>
            
            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <DashboardSearch />
            </div>
            
            <div className="flex items-center gap-2">
              <NotificationsDropdown />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-3 py-2 h-auto hover:bg-gray-800/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-white hidden sm:inline">
                      {user?.name || user?.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900/95 backdrop-blur-sm border-gray-800/50 text-white shadow-xl">
                  <DropdownMenuLabel className="text-gray-300">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800/50" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="cursor-pointer hover:bg-gray-800/50 transition-colors">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="cursor-pointer hover:bg-gray-800/50 transition-colors">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-gray-800/50" />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer hover:bg-gray-800/50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span>View Site</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800/50" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-300 hover:text-white hover:bg-red-500/10 transition-colors cursor-pointer">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-950 pb-16 md:pb-0">
          <div className="container mx-auto py-6 px-6 max-w-7xl">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading...</p>
                </div>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <AuthGuard>
        <TenantAccessGuard>
          <DashboardContent>{children}</DashboardContent>
        </TenantAccessGuard>
      </AuthGuard>
    </AuthProvider>
  )
}
