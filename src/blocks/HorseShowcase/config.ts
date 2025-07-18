import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const HorseShowcaseBlock: Block = {
  slug: 'horseShowcaseBlock',
  interfaceName: 'HorseShowcaseBlock',
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
      name: 'horses',
      type: 'array',
      label: 'Horses',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Horse Name',
        },
        {
          name: 'breed',
          type: 'text',
          label: 'Breed',
        },
        {
          name: 'age',
          type: 'text',
          label: 'Age',
        },
        {
          name: 'color',
          type: 'text',
          label: 'Color',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Horse Image',
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
          label: 'Horse Description',
        },
        {
          name: 'price',
          type: 'text',
          label: 'Price (leave empty if not for sale)',
        }
      ]
    },
  ],
  graphQL: {
    singularName: 'HorseShowcaseBlock',
  },
  labels: {
    plural: 'Horse Showcase Blocks',
    singular: 'Horse Showcase Block',
  },
}
