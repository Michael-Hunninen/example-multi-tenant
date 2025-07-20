import type { CollectionConfig } from 'payload'

export const VideoProgress: CollectionConfig = {
  slug: 'video-progress',
  labels: {
    singular: 'Video Progress',
    plural: 'Video Progress',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'video', 'progress', 'lastWatchedAt'],
    group: 'LMS Data',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      // Users can only see their own video progress unless they're admin
      return user.roles?.includes('admin') ? true : { user: { equals: user.id } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false
      // Users can only update their own video progress unless they're admin
      return user.roles?.includes('admin') ? true : { user: { equals: user.id } }
    },
    delete: ({ req: { user } }) => Boolean(user && user.roles?.includes('admin')),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user watching the video',
      },
    },
    {
      name: 'video',
      type: 'relationship',
      relationTo: 'videos',
      required: true,
      admin: {
        description: 'The video being watched',
      },
    },
    {
      name: 'progress',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 0,
      admin: {
        description: 'Watch progress as percentage (0-100)',
      },
    },
    {
      name: 'currentTime',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Current playback position in seconds',
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        description: 'Total video duration in seconds',
      },
    },
    {
      name: 'completed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the video has been completed',
      },
    },
    {
      name: 'watchTime',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total time spent watching this video in seconds',
      },
    },
    {
      name: 'lastWatchedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        description: 'When the video was last watched',
      },
    },
    {
      name: 'firstWatchedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        description: 'When the video was first watched',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-mark as completed if progress is 95% or higher
        if (data.progress >= 95) {
          data.completed = true
        }
        
        // Update last watched time
        data.lastWatchedAt = new Date()
        
        return data
      },
    ],
  },
  timestamps: true,
}
