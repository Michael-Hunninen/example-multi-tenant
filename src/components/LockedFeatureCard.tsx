'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LockedFeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  requiredTier?: string
  className?: string
  children?: React.ReactNode
}

export default function LockedFeatureCard({ 
  title, 
  description, 
  icon, 
  requiredTier = "Premium",
  className = "",
  children
}: LockedFeatureCardProps) {
  return (
    <Card className={`relative overflow-hidden border-gray-800 group cursor-pointer ${className}`}>
      {/* Hover overlay - only visible on hover */}
      <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="text-center space-y-3">
          <div>
            <h3 className="font-semibold text-white mb-1 text-sm">Upgrade To Unlock</h3>
            <p className="text-xs text-gray-300 mb-3">
              {requiredTier} required
            </p>
            <Button asChild size="sm" className="bg-teal-500 hover:bg-teal-600 text-white text-xs px-3 py-1.5">
              <Link href="/dashboard/pricing">
                View Plans
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Normal card content - grayed out */}
      <div className="opacity-40 grayscale">
        {children ? (
          children
        ) : (
          <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
              <div className="text-gray-600">
                {icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-500 mb-2">--</div>
              <p className="text-xs text-gray-500">{description}</p>
            </CardContent>
          </>
        )}
      </div>
    </Card>
  )
}
