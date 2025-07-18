import { CollectionConfig } from 'payload'

// This is a simple wrapper around the form-builder's form collection
// It allows us to customize it for our multi-tenant project
export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
