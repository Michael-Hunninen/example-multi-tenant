import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const EventsBlock: Block = {
  slug: 'eventsBlock',
  interfaceName: 'EventsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Section Title',
    },
    {
      name: 'description',
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
      label: 'Section Description',
    },
    {
      name: 'displayStyle',
      type: 'select',
      options: [
        {
          label: 'List',
          value: 'list',
        },
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'Calendar',
          value: 'calendar',
        },
      ],
      defaultValue: 'list',
      required: true,
      label: 'Display Style',
    },
    {
      name: 'events',
      type: 'array',
      label: 'Events',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Event Name',
        },
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Event Date',
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Event End Date (if multi-day)',
        },
        {
          name: 'location',
          type: 'text',
          label: 'Event Location',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Event Image',
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
          label: 'Event Description',
        },
        {
          name: 'link',
          type: 'group',
          label: 'Event Link',
          fields: [
            {
              name: 'url',
              label: 'URL',
              type: 'text',
            },
            {
              name: 'label',
              label: 'Label',
              type: 'text',
            },
            {
              name: 'newTab',
              label: 'Open in new tab',
              type: 'checkbox',
            }
          ]
        }
      ]
    },
  ],
  graphQL: {
    singularName: 'EventsBlock',
  },
  labels: {
    plural: 'Events Blocks',
    singular: 'Events Block',
  },
}
