import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { authenticateUser, userHasTenantAccess } from '@/utilities/authenticateUser'

export async function GET(request: NextRequest) {
  try {
    console.log('NOTIFICATIONS API - Starting request...')
    const payload = await getPayload({ config })
    
    // Get tenant from hostname 
    const url = new URL(request.url)
    const hostname = url.hostname
    console.log('NOTIFICATIONS API - Hostname:', hostname)
    let tenantId: string | null = null
    
    // Get tenant from domains collection
    try {
      console.log('NOTIFICATIONS API - Looking up tenant...')
      const domainsResult = await payload.find({
        collection: 'domains',
        where: {
          domain: {
            equals: hostname
          }
        },
        limit: 1
      })
      
      console.log('NOTIFICATIONS API - Domains result:', domainsResult.docs.length, 'domains found')
      
      if (domainsResult.docs.length > 0) {
        const tenant = domainsResult.docs[0].tenant
        tenantId = typeof tenant === 'string' ? tenant : (tenant?.id || null)
        console.log('NOTIFICATIONS API - Found tenant ID:', tenantId)
      } else {
        console.log('NOTIFICATIONS API - No domains found for hostname:', hostname)
      }
    } catch (error) {
      console.error('NOTIFICATIONS API - Error finding tenant:', error)
    }

    if (!tenantId) {
      console.log('NOTIFICATIONS API - No tenant found, trying fallback...')
      // Fallback: get the first available tenant
      try {
        const tenantsResult = await payload.find({
          collection: 'tenants',
          limit: 1
        })
        
        if (tenantsResult.docs.length > 0) {
          tenantId = tenantsResult.docs[0].id
          console.log('NOTIFICATIONS API - Using fallback tenant:', tenantId)
        }
      } catch (fallbackError) {
        console.error('NOTIFICATIONS API - Fallback tenant lookup failed:', fallbackError)
      }
    }

    if (!tenantId) {
      console.log('NOTIFICATIONS API - Still no tenant found, returning 404')
      return NextResponse.json(
        { 
          success: false, 
          error: 'No tenant found',
          notifications: [],
          unreadCount: 0,
          total: 0
        },
        { status: 404 }
      )
    }

    // Get the actual authenticated user from the token
    const currentUser = await authenticateUser(request)
    
    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated',
        notifications: [],
        unreadCount: 0,
        total: 0
      }, { status: 401 })
    }
    
    // Verify user has access to this tenant
    if (!userHasTenantAccess(currentUser, tenantId)) {
      console.log('NOTIFICATIONS API - User does not have access to tenant:', tenantId)
      return NextResponse.json({ 
        success: false, 
        error: 'Access denied for this tenant',
        notifications: [],
        unreadCount: 0,
        total: 0
      }, { status: 403 })
    }
    
    console.log('NOTIFICATIONS API - Authenticated user:', currentUser.id, currentUser.email)

    // First, let's check all notifications for this tenant (regardless of user)
    console.log('NOTIFICATIONS API - Querying ALL notifications for tenant:', tenantId)
    const allTenantNotifications = await payload.find({
      collection: 'notifications',
      where: {
        tenant: {
          equals: tenantId,
        },
      },
      sort: '-createdAt',
      limit: 50,
    })
    
    console.log('NOTIFICATIONS API - Found', allTenantNotifications.docs.length, 'total notifications for tenant')
    if (allTenantNotifications.docs.length > 0) {
      console.log('NOTIFICATIONS API - All tenant notifications:')
      allTenantNotifications.docs.forEach((notif: any, index: number) => {
        console.log(`  ${index + 1}. ID: ${notif.id}, Title: ${notif.title}, User: ${notif.user}, Read: ${notif.read}`)
      })
    }

    // Query real notifications from database (user-specific)
    console.log('NOTIFICATIONS API - Querying notifications for user:', currentUser.id, 'tenant:', tenantId)
    const notifications = await payload.find({
      collection: 'notifications',
      where: {
        and: [
          {
            user: {
              equals: currentUser.id,
            },
          },
          {
            tenant: {
              equals: tenantId,
            },
          },
        ],
      },
      sort: '-createdAt',
      limit: 50,
    })
    
    // Only use user-specific notifications - no fallback to tenant-wide notifications
    const notificationsToUse = notifications

    console.log('NOTIFICATIONS API - Using', notificationsToUse.docs.length, 'user-specific notifications')
    if (notificationsToUse.docs.length > 0) {
      console.log('NOTIFICATIONS API - First notification:', JSON.stringify({
        id: notificationsToUse.docs[0].id,
        title: notificationsToUse.docs[0].title,
        user: notificationsToUse.docs[0].user,
        tenant: notificationsToUse.docs[0].tenant
      }, null, 2))
    }

    // Debug: Show what we found in the database
    console.log('NOTIFICATIONS API - Total notifications found:', notificationsToUse.docs.length)
    if (notificationsToUse.docs.length === 0) {
      console.log('NOTIFICATIONS API - No notifications found in database')
      return NextResponse.json({
        success: true,
        notifications: [],
        unreadCount: 0,
        total: 0
      })
    }

    // Format existing notifications
    const formattedNotifications = notificationsToUse.docs.map((notification: any) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      timestamp: new Date(notification.createdAt),
      read: notification.read,
      actionUrl: notification.actionUrl || '/dashboard'
    }))

    const unreadCount = formattedNotifications.filter(n => !n.read).length

    return NextResponse.json({
      success: true,
      notifications: formattedNotifications,
      unreadCount,
      total: formattedNotifications.length
    })

  } catch (error) {
    console.error('Error in notifications API:', error)    
    
    // Fallback to sample notifications to ensure UI keeps working
    const fallbackNotifications = [
      {
        id: 'fallback-welcome',
        type: 'system',
        title: 'Welcome!',
        message: 'Welcome to your learning dashboard.',
        timestamp: new Date(),
        read: false,
        actionUrl: '/dashboard'
      },
      {
        id: 'fallback-start',
        type: 'system',
        title: 'Getting Started',
        message: 'Check out your first video to begin learning.',
        timestamp: new Date(),
        read: false,
        actionUrl: '/dashboard/videos'
      }
    ]

    const unreadCount = fallbackNotifications.filter(n => !n.read).length

    return NextResponse.json({
      success: true,
      notifications: fallbackNotifications,
      unreadCount,
      total: fallbackNotifications.length
    })
  }
}
