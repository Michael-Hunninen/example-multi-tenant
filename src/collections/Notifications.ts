import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'user', 'read', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      
      // Super-admins can read all notifications
      if (user.roles?.includes('super-admin')) {
        return true
      }
      
      // Regular users can only read their own notifications
      return {
        user: {
          equals: user.id,
        },
      }
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      
      // Super-admins and admins can create notifications for anyone
      if (user.roles?.includes('super-admin') || user.roles?.includes('admin')) {
        return true
      }
      
      // Regular users can create their own notifications
      return true
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      
      // Super-admins can update all notifications
      if (user.roles?.includes('super-admin')) {
        return true
      }
      
      // Regular users can only update their own notifications (mark as read/delete)
      return {
        user: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      
      // Super-admins can delete all notifications
      if (user.roles?.includes('super-admin')) {
        return true
      }
      
      // Regular users can only delete their own notifications
      return {
        user: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Achievement',
          value: 'achievement',
        },
        {
          label: 'Comment',
          value: 'comment',
        },
        {
          label: 'Progress',
          value: 'progress',
        },
        {
          label: 'Enrollment',
          value: 'enrollment',
        },
        {
          label: 'Live Session',
          value: 'live_session',
        },
        {
          label: 'System',
          value: 'system',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'actionUrl',
      type: 'text',
      admin: {
        description: 'URL to navigate to when notification is clicked',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional data for the notification (video ID, program ID, etc.)',
      },
    },
  ],
  timestamps: true,
}
