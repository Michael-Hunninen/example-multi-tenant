import type { Block } from 'payload'

export const CourseGrid: Block = {
  slug: 'courseGrid',
  interfaceName: 'CourseGridBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'courses',
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'duration',
          type: 'text',
          admin: {
            description: 'Course duration (e.g., "4 weeks", "12 lessons")',
          },
        },
        {
          name: 'level',
          type: 'select',
          options: [
            {
              label: 'Beginner',
              value: 'beginner',
            },
            {
              label: 'Intermediate',
              value: 'intermediate',
            },
            {
              label: 'Advanced',
              value: 'advanced',
            },
            {
              label: 'All Levels',
              value: 'all',
            },
          ],
        },
        {
          name: 'price',
          type: 'text',
          admin: {
            description: 'Course price (e.g., "$99", "Free")',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'requiresAuth',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'allowedRoles',
          type: 'select',
          hasMany: true,
          options: [
            {
              label: 'Basic Member',
              value: 'basic',
            },
            {
              label: 'Premium Member',
              value: 'premium',
            },
            {
              label: 'VIP Member',
              value: 'vip',
            },
          ],
          admin: {
            condition: (_, siblingData) => siblingData.requiresAuth,
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
          maxRows: 5,
        },
      ],
      maxRows: 12,
    },
    {
      name: 'displayStyle',
      type: 'select',
      defaultValue: 'grid',
      options: [
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'List',
          value: 'list',
        },
        {
          label: 'Carousel',
          value: 'carousel',
        },
      ],
    },
    {
      name: 'showFilters',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show level and category filters',
      },
    },
  ],
}
