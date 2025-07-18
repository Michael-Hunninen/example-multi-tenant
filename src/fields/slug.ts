import type { Field, FieldHook } from 'payload'

export const slugField = (): Field[] => {
  return [
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, originalDoc, data }) => {
            if (typeof value === 'string') {
              return value
            }

            // If no value exists, but we have a title, convert it to a slug
            if (data?.title && typeof data.title === 'string') {
              return data.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            }

            return value
          },
        ],
      },
    },
  ]
}
