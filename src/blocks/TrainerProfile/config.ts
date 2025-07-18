import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const TrainerProfileBlock: Block = {
  slug: 'trainerProfileBlock',
  interfaceName: 'TrainerProfileBlock',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Trainer Name',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title/Position',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Image',
    },
    {
      name: 'bio',
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
      label: 'Biography',
    },
    {
      name: 'achievements',
      type: 'array',
      label: 'Achievements',
      fields: [
        {
          name: 'achievement',
          type: 'text',
          required: true,
          label: 'Achievement',
        }
      ]
    },
  ],
  graphQL: {
    singularName: 'TrainerProfileBlock',
  },
  labels: {
    plural: 'Trainer Profile Blocks',
    singular: 'Trainer Profile Block',
  },
}
