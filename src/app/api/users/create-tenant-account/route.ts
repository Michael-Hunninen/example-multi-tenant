import { NextRequest, NextResponse } from 'next/server'
import { createTenantAssociationForUser, determineTenantForRegistration } from '@/utilities/tenantUserManagement.server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    console.log('CREATE TENANT ACCOUNT DEBUG - Request for:', email)
    
    // Check if user exists
    const existingUserResponse = await fetch(`${request.nextUrl.origin}/api/users?where[email][equals]=${encodeURIComponent(email)}&limit=1`)
    if (!existingUserResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to check existing user' },
        { status: 500 }
      )
    }
    
    const existingUserData = await existingUserResponse.json()
    
    if (!existingUserData.docs || existingUserData.docs.length === 0) {
      return NextResponse.json(
        { error: 'User does not exist. Please register first.' },
        { status: 404 }
      )
    }
    
    const existingUser = existingUserData.docs[0]
    
    // Verify password by attempting login
    const loginResponse = await fetch(`${request.nextUrl.origin}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    
    if (!loginResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Determine which tenant to create account for
    const hostname = request.headers.get('host') || 'localhost:3000'
    const tenantId = await determineTenantForRegistration()
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Could not determine tenant for account creation' },
        { status: 500 }
      )
    }
    
    console.log('CREATE TENANT ACCOUNT DEBUG - Creating association:', {
      userId: existingUser.id,
      tenantId,
      hostname
    })
    
    // Create tenant association
    const success = await createTenantAssociationForUser(
      existingUser.id,
      tenantId,
      ['tenant-viewer'], // Default role
      password // Could be different password per tenant in future
    )
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Account created for this tenant successfully',
        userId: existingUser.id,
        tenantId
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to create tenant account association' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('CREATE TENANT ACCOUNT ERROR:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
