import { NextRequest, NextResponse } from 'next/server'
import { registerUserWithTenant } from '@/utilities/tenantUserManagement.server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    console.log('REGISTER WITH TENANT API DEBUG - Request for:', email)
    
    const result = await registerUserWithTenant(email, password, name)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        userId: result.userId,
        tenantId: result.tenantId
      })
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: result.message || 'Registration failed'
        },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('REGISTER WITH TENANT API ERROR:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
