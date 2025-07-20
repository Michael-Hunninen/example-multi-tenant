"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Video, BookOpen, User, Settings } from "lucide-react"
import { cn } from "@/utilities/cn"

type NavItem = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Videos",
    href: "/dashboard/videos",
    icon: Video,
  },
  {
    name: "Programs",
    href: "/dashboard/programs",
    icon: BookOpen,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-800 bg-black/95 backdrop-blur-sm md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href || 
                       (item.href !== "/dashboard" && pathname.startsWith(item.href))
        const Icon = item.icon
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
              isActive
                ? "text-teal"
                : "text-gray-400 hover:text-teal"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "text-teal")} />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
