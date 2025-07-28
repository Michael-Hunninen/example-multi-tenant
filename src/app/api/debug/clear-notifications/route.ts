import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    console.log('=== CLEARING OLD NOTIFICATIONS ===')
    
    // Get all notifications with "Welcome" or "Getting Started" in the title (the auto-created ones)
    const welcomeNotifications = await payload.find({
      collection: 'notifications',
      where: {
        or: [
          {
            title: {
              contains: 'Welcome'
            }
          },
          {
            title: {
              contains: 'Getting Started'
            }
          },
          {
            title: {
              contains: 'Complete Your Profile'
            }
          }
        ]
      }
    })
    
    console.log('Found', welcomeNotifications.docs.length, 'welcome notifications to delete')
    
    // Delete each welcome notification
    let deletedCount = 0
    for (const notification of welcomeNotifications.docs) {
      try {
        await payload.delete({
          collection: 'notifications',
          id: notification.id
        })
        deletedCount++
        console.log('Deleted notification:', notification.title)
      } catch (deleteError) {
        console.error('Error deleting notification:', notification.id, deleteError)
      }
    }
    
    // Get remaining notifications
    const remainingNotifications = await payload.find({
      collection: 'notifications',
      limit: 20,
      sort: '-createdAt'
    })
    
    console.log('Remaining notifications:', remainingNotifications.docs.length)
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} welcome notifications`,
      remainingNotifications: remainingNotifications.docs.map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        user: typeof n.user === 'string' ? n.user : n.user?.id,
        tenant: typeof n.tenant === 'string' ? n.tenant : n.tenant?.id
      }))
    })
    
  } catch (error) {
    console.error('Clear notifications error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 })
  }
}
