import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: {
    singular: 'Comment',
    plural: 'Comments',
  },
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['user', 'content', 'video', 'status', 'createdAt'],
    group: 'LMS Data',
  },
  access: {
    read: () => true, // Public read access for approved comments
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false
      // Users can only update their own comments unless they're admin
      return user.role === 'admin' ? true : { user: { equals: user.id } }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      // Users can only delete their own comments unless they're admin
      return user.role === 'admin' ? true : { user: { equals: user.id } }
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user who posted the comment',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The comment content',
      },
    },
    {
      name: 'video',
      type: 'relationship',
      relationTo: 'videos',
      admin: {
        description: 'The video this comment is on',
      },
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      admin: {
        description: 'The program this comment is on',
      },
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'comments',
      admin: {
        description: 'Parent comment for replies',
      },
    },
    {
      name: 'timestamp',
      type: 'number',
      admin: {
        description: 'Video timestamp for the comment (in seconds)',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'approved',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of likes on this comment',
      },
    },
  ],
  timestamps: true,
}
