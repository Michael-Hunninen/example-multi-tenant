import type { CollectionConfig } from 'payload'
import { createCustomerOnSubscription } from './hooks/createCustomerOnSubscription'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'product', 'status', 'currentPeriodEnd', 'updatedAt'],
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
  hooks: {
    afterChange: [createCustomerOnSubscription],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who owns this subscription',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: {
        description: 'Product being subscribed to',
      },
    },
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      required: false, // Made optional for development without Stripe
      unique: true,
      admin: {
        description: 'Stripe Subscription ID (auto-populated when Stripe is connected)',
        readOnly: true,
      },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      required: false, // Made optional for development without Stripe
      admin: {
        description: 'Stripe Customer ID (auto-populated when Stripe is connected)',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Past Due', value: 'past_due' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Incomplete', value: 'incomplete' },
        { label: 'Incomplete Expired', value: 'incomplete_expired' },
        { label: 'Trialing', value: 'trialing' },
        { label: 'Paused', value: 'paused' },
      ],
      admin: {
        description: 'Current subscription status from Stripe',
      },
    },
    {
      name: 'currentPeriodStart',
      type: 'date',
      admin: {
        description: 'Start of current billing period',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'currentPeriodEnd',
      type: 'date',
      admin: {
        description: 'End of current billing period',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'cancelAtPeriodEnd',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether subscription will cancel at period end',
      },
    },
    {
      name: 'canceledAt',
      type: 'date',
      admin: {
        condition: (data) => data.cancelAtPeriodEnd || data.status === 'canceled',
        description: 'When subscription was canceled',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'trialStart',
      type: 'date',
      admin: {
        condition: (data) => data.status === 'trialing',
        description: 'Trial period start date',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'trialEnd',
      type: 'date',
      admin: {
        condition: (data) => data.status === 'trialing',
        description: 'Trial period end date',
        date: {
          pickerAppearance: 'dayAndTime',
        },
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
