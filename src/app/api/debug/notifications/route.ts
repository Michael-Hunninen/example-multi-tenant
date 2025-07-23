import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    console.log('=== DEBUG NOTIFICATIONS API ===')
    
    // Get ALL notifications without any filters
    const allNotifications = await payload.find({
      collection: 'notifications',
      limit: 100,
      sort: '-createdAt'
    })
    
    console.log('Total notifications in database:', allNotifications.docs.length)
    
    // Get all users
    const allUsers = await payload.find({
      collection: 'users',
      limit: 10
    })
    
    console.log('Total users:', allUsers.docs.length)
    
    // Get all tenants
    const allTenants = await payload.find({
      collection: 'tenants',
      limit: 10
    })
    
    console.log('Total tenants:', allTenants.docs.length)
    
    return NextResponse.json({
      success: true,
      notifications: allNotifications.docs.map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        read: n.read,
        user: typeof n.user === 'string' ? n.user : n.user?.id,
        tenant: typeof n.tenant === 'string' ? n.tenant : n.tenant?.id,
        createdAt: n.createdAt
      })),
      users: allUsers.docs.map((u: any) => ({
        id: u.id,
        email: u.email,
        tenants: u.tenants
      })),
      tenants: allTenants.docs.map((t: any) => ({
        id: t.id,
        name: t.name,
        slug: t.slug
      }))
    })
    
  } catch (error) {
    console.error('Debug notifications error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
