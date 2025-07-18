import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const TestimonialsBlock: Block = {
  slug: 'testimonialsBlock',
  interfaceName: 'TestimonialsBlock',
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
      name: 'layout',
      type: 'select',
      options: [
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'Carousel',
          value: 'carousel',
        },
      ],
      defaultValue: 'carousel',
      required: true,
      label: 'Layout Style',
    },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      fields: [
        {
          name: 'author',
          type: 'text',
          required: true,
          label: 'Author Name',
        },
        {
          name: 'location',
          type: 'text',
          label: 'Author Location',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Author Image',
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          label: 'Rating (1-5)',
        },
        {
          name: 'text',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                InlineToolbarFeature(),
              ]
            },
          }),
          label: 'Testimonial Text',
          required: true,
        },
      ]
    },
  ],
  graphQL: {
    singularName: 'TestimonialsBlock',
  },
  labels: {
    plural: 'Testimonials Blocks',
    singular: 'Testimonials Block',
  },
}
