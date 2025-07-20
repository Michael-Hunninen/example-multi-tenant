import type { CollectionConfig } from 'payload'

export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'duration', 'status', 'createdAt'],
    group: 'LMS Content',
  },
  access: {
    read: () => true, // Public read access for videos
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the video',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the title',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed description of the video content',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Video thumbnail image',
      },
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'The video file',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description: 'External video URL (YouTube, Vimeo, etc.)',
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        description: 'Video duration in seconds',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Video category',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        description: 'Tags for better searchability',
      },
    },
    {
      name: 'chapters',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'startTime',
          type: 'number',
          required: true,
          admin: {
            description: 'Start time in seconds',
          },
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      admin: {
        description: 'Video chapters for navigation',
      },
    },
    {
      name: 'instructor',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Video instructor',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
      defaultValue: 'beginner',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Feature this video on the dashboard',
      },
    },
    {
      name: 'accessLevel',
      type: 'select',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Basic', value: 'basic' },
        { label: 'Premium', value: 'premium' },
        { label: 'VIP', value: 'vip' },
      ],
      defaultValue: 'free',
      admin: {
        position: 'sidebar',
        description: 'Required access level to view this video',
      },
    },
  ],
  timestamps: true,
}
