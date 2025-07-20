import type { CollectionConfig } from 'payload'

export const UserAchievements: CollectionConfig = {
  slug: 'user-achievements',
  labels: {
    singular: 'User Achievement',
    plural: 'User Achievements',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'achievement', 'earnedAt'],
    group: 'LMS Data',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      // Users can only see their own achievements unless they're admin
      return user.roles?.includes('admin') ? true : { user: { equals: user.id } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user && user.roles?.includes('admin')),
    delete: ({ req: { user } }) => Boolean(user && user.roles?.includes('admin')),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user who earned the achievement',
      },
    },
    {
      name: 'achievement',
      type: 'relationship',
      relationTo: 'achievements',
      required: true,
      admin: {
        description: 'The achievement that was earned',
      },
    },
    {
      name: 'earnedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        description: 'When the achievement was earned',
      },
    },
    {
      name: 'progress',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 100,
      admin: {
        description: 'Progress towards earning this achievement (0-100)',
      },
    },
  ],
  timestamps: true,
}
