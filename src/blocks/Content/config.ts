import type { Block } from 'payload'

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'oneThird',
          options: [
            {
              label: 'One Third',
              value: 'oneThird',
            },
            {
              label: 'Half',
              value: 'half',
            },
            {
              label: 'Two Thirds',
              value: 'twoThirds',
            },
            {
              label: 'Full',
              value: 'full',
            },
          ],
        },
        {
          name: 'richText',
          type: 'richText',
          label: false,
        },
        {
          name: 'enableLink',
          type: 'checkbox',
        },
        {
          name: 'link',
          type: 'group',
          admin: {
            condition: (data, siblingData) => {
              return Boolean(siblingData?.enableLink)
            },
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
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
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'page',
              },
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'custom',
              },
            },
          ],
        },
      ],
    },
  ],
}
