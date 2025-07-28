"use client"

import { Suspense, useState } from 'react'
import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, Bell, ChevronDown, User as UserIcon, Settings, ChevronLeft, ChevronRight, Home, Play, BookOpen, Calendar, Trophy, CreditCard } from "lucide-react"
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
import { cn } from "@/utilities/cn"
import { AuthGuard, useAuth, AuthProvider } from '@/components/LMSAuth/AuthWrapper'
import PWAMetadata from '@/components/PWAMetadata'

interface GenericDashboardLayoutProps {
  children: React.ReactNode;
}

function GenericDashboardContent({ children }: GenericDashboardLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // AuthGuard ensures user is not null, but we add safety checks for TypeScript
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  const navigationItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      isActive: pathname === "/dashboard"
    },
    {
      href: "/dashboard/videos",
      label: "Videos",
      icon: Play,
      isActive: pathname.startsWith("/dashboard/videos")
    },
    {
      href: "/dashboard/programs",
      label: "Programs",
      icon: BookOpen,
      isActive: pathname.startsWith("/dashboard/programs")
    },
    {
      href: "/dashboard/lessons",
      label: "Lessons",
      icon: Calendar,
      isActive: pathname.startsWith("/dashboard/lessons")
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: UserIcon,
      isActive: pathname.startsWith("/dashboard/profile")
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      isActive: pathname.startsWith("/dashboard/settings")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PWAMetadata 
        tenantName="Learning Portal"
        tenantDescription="Professional learning management system"
        themeColor="#3b82f6"
      />
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex flex-col bg-white border-r border-gray-200 fixed top-0 left-0 bottom-0 z-10 transition-all duration-300 ease-in-out shadow-sm",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link href="/dashboard" className={cn(
            "flex items-center gap-3 transition-all duration-200",
            sidebarCollapsed && "justify-center"
          )}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-white font-bold text-sm">LMS</span>
            </div>
            {!sidebarCollapsed && (
              <span className="text-lg font-bold text-gray-900 truncate">
                Learning Portal
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
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
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "w-full transition-all duration-200 hover:bg-gray-100",
                  sidebarCollapsed ? "justify-center px-2" : "justify-start px-3",
                  item.isActive 
                    ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-500' 
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </Button>
            ))}
          </div>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full transition-all duration-200 hover:bg-gray-100",
                  sidebarCollapsed ? "justify-center px-2" : "justify-start px-3"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-4 h-4 text-gray-600" />
                  </div>
                  {!sidebarCollapsed && (
                    <>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "md:ml-16" : "md:ml-64"
      )}>
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {navigationItems.find(item => item.isActive)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-600" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/profile">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                item.isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GenericDashboardLayout({ children }: GenericDashboardLayoutProps) {
  return (
    <AuthProvider>
      <AuthGuard>
        <GenericDashboardContent>{children}</GenericDashboardContent>
      </AuthGuard>
    </AuthProvider>
  );
}
