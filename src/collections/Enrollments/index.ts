import type { CollectionConfig } from 'payload'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  labels: {
    singular: 'Enrollment',
    plural: 'Enrollments',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'program', 'progress', 'status', 'enrolledAt'],
    group: 'LMS Data',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      // Users can only see their own enrollments unless they're admin
      return user.roles?.includes('admin') ? true : { user: { equals: user.id } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false
      // Users can only update their own enrollments unless they're admin
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
        description: 'The enrolled user',
      },
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      required: true,
      admin: {
        description: 'The program the user is enrolled in',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Paused', value: 'paused' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'active',
    },
    {
      name: 'progress',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 0,
      admin: {
        description: 'Completion progress as percentage (0-100)',
      },
    },
    {
      name: 'completedLessons',
      type: 'array',
      fields: [
        {
          name: 'lessonIndex',
          type: 'number',
          required: true,
        },
        {
          name: 'completedAt',
          type: 'date',
          required: true,
        },
        {
          name: 'timeSpent',
          type: 'number',
          admin: {
            description: 'Time spent on lesson in minutes',
          },
        },
      ],
      admin: {
        description: 'Track which lessons have been completed',
      },
    },
    {
      name: 'enrolledAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        description: 'When the user enrolled in the program',
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        description: 'When the user completed the program',
      },
    },
    {
      name: 'lastAccessedAt',
      type: 'date',
      admin: {
        description: 'When the user last accessed the program',
      },
    },
    {
      name: 'totalTimeSpent',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total time spent in the program (minutes)',
      },
    },
    {
      name: 'certificateIssued',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether a completion certificate has been issued',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-update completion status based on progress
        if (data.progress >= 100 && data.status === 'active') {
          data.status = 'completed'
          if (!data.completedAt) {
            data.completedAt = new Date()
          }
        }
        
        // Update last accessed time
        if (data.status === 'active') {
          data.lastAccessedAt = new Date()
        }
        
        return data
      },
    ],
  },
  timestamps: true,
}
