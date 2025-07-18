import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'centered',
      options: [
        {
          label: 'Centered',
          value: 'centered',
        },
        {
          label: 'Content Left',
          value: 'contentLeft',
        },
        {
          label: 'Content Right',
          value: 'contentRight',
        },
      ],
      label: 'Layout Type',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'subtitle',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Subtitle',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Background Image',
    },
    {
      name: 'primaryButton',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'page',
          options: [
            {
              label: 'Page',
              value: 'page',
            },
            {
              label: 'Custom URL',
              value: 'custom',
            },
          ],
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'page',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'custom',
          },
        },
      ],
    },
    {
      name: 'secondaryButton',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'page',
          options: [
            {
              label: 'Page',
              value: 'page',
            },
            {
              label: 'Custom URL',
              value: 'custom',
            },
          ],
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'page',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'custom',
          },
        },
      ],
    },
    {
      name: 'overlayColor',
      type: 'select',
      defaultValue: 'dark',
      options: [
        {
          label: 'Dark',
          value: 'dark',
        },
        {
          label: 'Light',
          value: 'light',
        },
        {
          label: 'None',
          value: 'none',
        },
      ],
      label: 'Overlay Color',
    },
  ],
  graphQL: {
    singularName: 'HeroBlock',
  },
  labels: {
    plural: 'Hero Blocks',
    singular: 'Hero Block',
  },
}
