import type { Block } from 'payload'

export const VideoPlayer: Block = {
  slug: 'videoPlayer',
  interfaceName: 'VideoPlayerBlock',
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
      name: 'videoType',
      type: 'select',
      defaultValue: 'upload',
      options: [
        {
          label: 'Upload',
          value: 'upload',
        },
        {
          label: 'YouTube',
          value: 'youtube',
        },
        {
          label: 'Vimeo',
          value: 'vimeo',
        },
        {
          label: 'External URL',
          value: 'url',
        },
      ],
      required: true,
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData.videoType === 'upload',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => ['youtube', 'vimeo', 'url'].includes(siblingData.videoType),
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Custom thumbnail image (optional)',
      },
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        description: 'Video duration (e.g., "5:30")',
      },
    },
    {
      name: 'requiresAuth',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Require user authentication to view this video',
      },
    },
    {
      name: 'allowedRoles',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Regular User',
          value: 'regular',
        },
        {
          label: 'Business User',
          value: 'business',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData.requiresAuth,
        description: 'Which user roles can access this video',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'controls',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'muted',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
