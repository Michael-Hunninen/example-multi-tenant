import type { Block } from 'payload'

export const DashboardLayout: Block = {
  slug: 'dashboardLayout',
  interfaceName: 'DashboardLayoutBlock',
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
      name: 'showWelcomeMessage',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'welcomeMessage',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData.showWelcomeMessage,
      },
    },
    {
      name: 'quickStats',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name',
          },
        },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'teal',
          options: [
            { label: 'Teal', value: 'teal' },
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
            { label: 'Yellow', value: 'yellow' },
            { label: 'Red', value: 'red' },
            { label: 'Purple', value: 'purple' },
          ],
        },
      ],
      maxRows: 6,
    },
    {
      name: 'recentActivity',
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
          name: 'timestamp',
          type: 'text',
          admin: {
            description: 'Relative time (e.g., "2 hours ago")',
          },
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Video Watched', value: 'video' },
            { label: 'Course Completed', value: 'course' },
            { label: 'Achievement Earned', value: 'achievement' },
            { label: 'Assignment Submitted', value: 'assignment' },
          ],
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
      maxRows: 10,
    },
    {
      name: 'quickActions',
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
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Lucide icon name',
          },
        },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'teal',
          options: [
            { label: 'Teal', value: 'teal' },
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
            { label: 'Yellow', value: 'yellow' },
            { label: 'Red', value: 'red' },
            { label: 'Purple', value: 'purple' },
          ],
        },
      ],
      maxRows: 8,
    },
    {
      name: 'requiresAuth',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Require user authentication to view dashboard',
      },
    },
  ],
}
