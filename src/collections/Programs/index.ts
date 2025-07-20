import type { CollectionConfig } from 'payload'

export const Programs: CollectionConfig = {
  slug: 'programs',
  labels: {
    singular: 'Program',
    plural: 'Programs',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'instructor', 'lessonsCount', 'status', 'createdAt'],
    group: 'LMS Content',
  },
  access: {
    read: () => true, // Public read access for programs
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
        description: 'The title of the program',
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
        description: 'Detailed description of the program',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'Brief description for cards and previews',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Program thumbnail image',
      },
    },
    {
      name: 'instructor',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Program instructor',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Program category',
      },
    },
    {
      name: 'lessons',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'video',
          type: 'relationship',
          relationTo: 'videos',
        },
        {
          name: 'duration',
          type: 'number',
          admin: {
            description: 'Lesson duration in minutes',
          },
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          admin: {
            description: 'Lesson order within the program',
          },
        },
        {
          name: 'isPreview',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Allow free preview of this lesson',
          },
        },
      ],
      admin: {
        description: 'Program lessons in order',
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
      name: 'duration',
      type: 'number',
      admin: {
        description: 'Total program duration in hours',
      },
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        description: 'Program price (0 for free)',
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
        description: 'Required access level to enroll in this program',
      },
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
        description: 'Feature this program on the dashboard',
      },
    },
    {
      name: 'enrollmentLimit',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Maximum number of enrollments (0 for unlimited)',
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
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Calculate lessons count
        if (data.lessons) {
          data.lessonsCount = data.lessons.length
        }
        return data
      },
    ],
  },
  timestamps: true,
}
