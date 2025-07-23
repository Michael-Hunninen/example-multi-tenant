import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { authenticateUser, userHasTenantAccess } from '@/utilities/authenticateUser'

// POST /api/lms/notifications/mark-read
// Body: { id: string, allNotifications?: boolean }
export async function POST(request: NextRequest) {
  console.log('\n=== MARK READ API CALLED ===')  
  try {
    const payload = await getPayload({ config })
    
    // Get tenant ID using the same approach as in notifications API
    const headersList = request.headers
    const host = headersList.get('host') || ''
    const domain = host.split(':')[0]
    
    console.log('MARK READ API - Host:', host, 'Domain:', domain)
    
    // Find tenant by domain
    let tenantId: string | null = null
    const domainsResult = await payload.find({
      collection: 'domains',
      where: {
        domain: {
          equals: domain
        },
        isActive: {
          equals: true
        }
      },
      depth: 1
    })
    
    if (domainsResult.docs.length > 0) {
      const domainDoc = domainsResult.docs[0]
      tenantId = typeof domainDoc.tenant === 'object' && domainDoc.tenant ? domainDoc.tenant.id : (domainDoc.tenant as string | null)
      console.log('MARK READ API - Found tenant from domain:', tenantId)
    } else {
      // Fallback to default tenant for development
      tenantId = process.env.DEFAULT_TENANT_ID || null
      console.log('MARK READ API - Using default tenant:', tenantId)
    }
    
    if (!tenantId) {
      return NextResponse.json({ success: false, message: 'Tenant not found' }, { status: 404 })
    }
    
    // Get the actual authenticated user from the token
    const currentUser = await authenticateUser(request)
    
    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }
    
    // Verify user has access to this tenant
    if (!userHasTenantAccess(currentUser, tenantId)) {
      console.log('MARK READ API - User does not have access to tenant:', tenantId)
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied for this tenant'
      }, { status: 403 })
    }
    
    console.log('MARK READ API - Authenticated user:', currentUser.id, currentUser.email)
    
    // Parse request body
    const body = await request.json()
    const { id, allNotifications = false } = body
    
    console.log('MARK READ API - Request:', { id, allNotifications, userId: currentUser.id, tenantId })
    
    if (allNotifications) {
      // Mark all notifications as read for this user in this tenant
      const result = await payload.update({
        collection: 'notifications',
        where: {
          and: [
            {
              tenant: {
                equals: tenantId,
              }
            },
            {
              user: {
                equals: currentUser.id,
              }
            },
            {
              read: {
                equals: false,
              }
            }
          ]
        },
        data: {
          read: true,
        }
      })
      
      console.log('MARK READ API - Marked all notifications as read:', result.docs.length)
      
      return NextResponse.json({
        success: true,
        message: `Marked ${result.docs.length} notifications as read`,
        updatedCount: result.docs.length
      })
    } else if (id) {
      // Mark a specific notification as read
      // First verify this notification belongs to the user
      const notification = await payload.findByID({
        collection: 'notifications',
        id,
      })
      
      if (!notification) {
        return NextResponse.json({ success: false, message: 'Notification not found' }, { status: 404 })
      }
      
      const userId = typeof notification.user === 'string' ? notification.user : notification.user?.id
      
      console.log('MARK READ API - Authorization check:')
      console.log('  - Notification ID:', id)
      console.log('  - Notification user:', notification.user)
      console.log('  - Extracted userId:', userId)
      console.log('  - Current user ID:', currentUser.id)
      console.log('  - User IDs match:', userId === currentUser.id)
      console.log('  - No user (tenant-wide):', !userId)
      console.log('  - Authorization result:', userId === currentUser.id || !userId)
      
      // Allow read status update if the notification belongs to this user OR if it's a tenant-wide notification
      if (userId === currentUser.id || !userId) {
        const result = await payload.update({
          collection: 'notifications',
          id,
          data: {
            read: true,
          }
        })
        
        console.log('MARK READ API - Marked notification as read:', result.id)
        
        return NextResponse.json({
          success: true,
          message: 'Notification marked as read',
          updatedNotification: {
            id: result.id,
            read: result.read,
          }
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'Unauthorized to update this notification' 
        }, { status: 403 })
      }
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing id or allNotifications parameter' 
      }, { status: 400 })
    }
    
  } catch (error: any) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unknown error occurred' 
    }, { status: 500 })
  }
}
