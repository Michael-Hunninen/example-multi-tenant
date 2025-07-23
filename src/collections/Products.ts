import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'price', 'active', 'updatedAt'],
  },
  access: {
    read: () => true, // Products can be read publicly for display
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Product name displayed to customers',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Product description for customers',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'One-time Purchase',
          value: 'one_time',
        },
        {
          label: 'Subscription',
          value: 'subscription',
        },
        {
          label: 'Course Access',
          value: 'course_access',
        },
        {
          label: 'Program Bundle',
          value: 'program_bundle',
        },
      ],
      defaultValue: 'one_time',
    },
    {
      name: 'prices',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Multiple pricing options for this product (e.g., monthly and annual)',
      },
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          admin: {
            description: 'Price in cents (e.g., 2999 for $29.99)',
          },
        },
        {
          name: 'currency',
          type: 'select',
          required: true,
          options: [
            { label: 'USD', value: 'usd' },
            { label: 'EUR', value: 'eur' },
            { label: 'GBP', value: 'gbp' },
          ],
          defaultValue: 'usd',
        },
        {
          name: 'interval',
          type: 'select',
          admin: {
            condition: (data, siblingData) => {
              // Access the parent document's type field
              return data.type === 'subscription'
            },
            description: 'Billing interval for subscriptions',
          },
          options: [
            { label: 'Monthly', value: 'month' },
            { label: 'Yearly', value: 'year' },
            { label: 'Weekly', value: 'week' },
          ],
        },
        {
          name: 'stripePriceId',
          type: 'text',
          admin: {
            description: 'Stripe Price ID for this specific price option',
            readOnly: true,
          },
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Display label for this price (e.g., "Monthly", "Annual")',
          },
        },
      ],
    },
    {
      name: 'stripeProductId',
      type: 'text',
      admin: {
        description: 'Stripe Product ID (auto-populated)',
        readOnly: true,
      },
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'List of product features',
      },
    },
    {
      name: 'accessLevel',
      type: 'select',
      required: true,
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Premium', value: 'premium' },
        { label: 'VIP', value: 'vip' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
      defaultValue: 'basic',
      admin: {
        description: 'Access level granted by this product',
      },
    },
    {
      name: 'relatedPrograms',
      type: 'relationship',
      relationTo: 'programs',
      hasMany: true,
      admin: {
        description: 'Programs included with this product',
      },
    },
    {
      name: 'relatedVideos',
      type: 'relationship',
      relationTo: 'videos',
      hasMany: true,
      admin: {
        description: 'Videos included with this product',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this product is available for purchase',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Display this product prominently',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Product image for display',
      },
    },
  ],
}
