import type { CollectionConfig } from 'payload'

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  labels: {
    singular: 'Achievement',
    plural: 'Achievements',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'points', 'status'],
    group: 'LMS Content',
  },
  access: {
    read: () => true, // Public read access for achievements
    create: ({ req: { user } }) => Boolean(user && user.roles?.includes('admin')),
    update: ({ req: { user } }) => Boolean(user && user.roles?.includes('admin')),
    delete: ({ req: { user } }) => Boolean(user && user.roles?.includes('admin')),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Achievement title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Achievement description',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Achievement badge/icon',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Video Completion', value: 'video_completion' },
        { label: 'Program Completion', value: 'program_completion' },
        { label: 'Streak', value: 'streak' },
        { label: 'Time Spent', value: 'time_spent' },
        { label: 'First Login', value: 'first_login' },
        { label: 'Comment', value: 'comment' },
        { label: 'Special', value: 'special' },
      ],
      required: true,
    },
    {
      name: 'points',
      type: 'number',
      defaultValue: 10,
      admin: {
        description: 'Points awarded for this achievement',
      },
    },
    {
      name: 'criteria',
      type: 'group',
      fields: [
        {
          name: 'videosToComplete',
          type: 'number',
          admin: {
            description: 'Number of videos to complete (for video completion achievements)',
          },
        },
        {
          name: 'programsToComplete',
          type: 'number',
          admin: {
            description: 'Number of programs to complete (for program completion achievements)',
          },
        },
        {
          name: 'streakDays',
          type: 'number',
          admin: {
            description: 'Number of consecutive days (for streak achievements)',
          },
        },
        {
          name: 'timeSpentHours',
          type: 'number',
          admin: {
            description: 'Total hours to spend learning (for time spent achievements)',
          },
        },
      ],
      admin: {
        description: 'Achievement criteria',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      defaultValue: 'active',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'rarity',
      type: 'select',
      options: [
        { label: 'Common', value: 'common' },
        { label: 'Uncommon', value: 'uncommon' },
        { label: 'Rare', value: 'rare' },
        { label: 'Epic', value: 'epic' },
        { label: 'Legendary', value: 'legendary' },
      ],
      defaultValue: 'common',
    },
  ],
  timestamps: true,
}
