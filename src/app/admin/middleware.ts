import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function middleware(request: NextRequest) {
  try {
    // Get the user from the session/cookies
    const payload = await getPayload({ config })
    
    // Check if user is authenticated and has admin privileges
    const { user } = await payload.auth({ headers: request.headers })
    
    if (!user) {
      // Redirect unauthenticated users to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Check if user has admin-level roles
    const isAdminUser = user.roles?.some((role: string) => 
      ['super-admin', 'admin', 'business'].includes(role)
    )
    
    if (!isAdminUser) {
      // Redirect regular users to their dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // Allow admin users to proceed
    return NextResponse.next()
  } catch (error) {
    console.error('Admin middleware error:', error)
    // Redirect to login on error
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: '/admin/:path*'
}
