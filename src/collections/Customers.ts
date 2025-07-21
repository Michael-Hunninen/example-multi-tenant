import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'stripeCustomerId', 'updatedAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.roles?.includes('super-admin')) return true
      if (req.user) {
        return {
          user: {
            equals: req.user.id,
          },
        }
      }
      return false
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('super-admin')),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      admin: {
        description: 'Associated user account',
      },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Stripe Customer ID',
        readOnly: true,
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Customer email address',
      },
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Customer full name',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Customer phone number',
      },
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'line1',
          type: 'text',
          admin: {
            description: 'Address line 1',
          },
        },
        {
          name: 'line2',
          type: 'text',
          admin: {
            description: 'Address line 2',
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            description: 'City',
          },
        },
        {
          name: 'state',
          type: 'text',
          admin: {
            description: 'State/Province',
          },
        },
        {
          name: 'postalCode',
          type: 'text',
          admin: {
            description: 'Postal/ZIP code',
          },
        },
        {
          name: 'country',
          type: 'text',
          admin: {
            description: 'Country',
          },
        },
      ],
    },
    {
      name: 'defaultPaymentMethod',
      type: 'text',
      admin: {
        description: 'Default Stripe Payment Method ID',
        readOnly: true,
      },
    },
    {
      name: 'balance',
      type: 'number',
      admin: {
        description: 'Customer balance in cents',
        readOnly: true,
      },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'usd',
      admin: {
        description: 'Customer preferred currency',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata from Stripe',
      },
    },
  ],
}
