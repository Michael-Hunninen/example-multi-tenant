import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Get the user from the current session
    const { user } = await payload.auth({ headers: request.headers })
    
    if (!user) {
      return NextResponse.json({ isAdmin: false, error: 'Not authenticated' }, { status: 401 })
    }
    
    // Check if user has admin-level roles
    const isAdminUser = user.roles?.some((role: string) => 
      ['super-admin', 'admin', 'business'].includes(role)
    )
    
    return NextResponse.json({ 
      isAdmin: isAdminUser,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles
      }
    })
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json({ isAdmin: false, error: 'Authentication failed' }, { status: 500 })
  }
}
