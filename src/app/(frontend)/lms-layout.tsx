'use client'

import React from 'react'
import { AuthProvider, useAuth } from '@/components/LMSAuth/AuthWrapper'
import { LMSNavigation } from '@/components/LMSNavigation'
import { RoleSwitcher } from '@/components/LMSAuth/RoleSwitcher'

// Internal layout that can access auth context
function InternalLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <LMSNavigation />
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Role switcher appears only when user is authenticated */}
      {user && <RoleSwitcher />}
    </div>
  )
}

// Main layout with auth provider
export default function LMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <InternalLayout>
        {children}
      </InternalLayout>
    </AuthProvider>
  )
}
