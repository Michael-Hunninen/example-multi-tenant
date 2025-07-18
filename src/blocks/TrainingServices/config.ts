import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const TrainingServicesBlock: Block = {
  slug: 'trainingServicesBlock',
  interfaceName: 'TrainingServicesBlock',
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
      name: 'services',
      type: 'array',
      label: 'Training Services',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Service Name',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Service Image',
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
          label: 'Service Description',
        },
        {
          name: 'price',
          type: 'text',
          label: 'Price (optional)',
        }
      ]
    },
  ],
  graphQL: {
    singularName: 'TrainingServicesBlock',
  },
  labels: {
    plural: 'Training Services Blocks',
    singular: 'Training Services Block',
  },
}
