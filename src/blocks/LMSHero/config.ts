import type { Block } from 'payload'

export const LMSHero: Block = {
  slug: 'lmsHero',
  interfaceName: 'LMSHeroBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'default',
      label: 'Type',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Dashboard',
          value: 'dashboard',
        },
        {
          label: 'Course',
          value: 'course',
        },
      ],
      required: true,
    },
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
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'primaryButton',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            {
              label: 'Primary',
              value: 'primary',
            },
            {
              label: 'Secondary',
              value: 'secondary',
            },
            {
              label: 'Outline',
              value: 'outline',
            },
          ],
        },
      ],
    },
    {
      name: 'secondaryButton',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'outline',
          options: [
            {
              label: 'Primary',
              value: 'primary',
            },
            {
              label: 'Secondary',
              value: 'secondary',
            },
            {
              label: 'Outline',
              value: 'outline',
            },
          ],
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name (e.g., "award", "users", "book-open")',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      maxRows: 6,
    },
  ],
}
