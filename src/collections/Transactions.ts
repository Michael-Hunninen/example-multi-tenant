import type { CollectionConfig } from 'payload'
import { createCustomerOnTransaction } from './hooks/createCustomerOnTransaction'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'product', 'amount', 'status', 'createdAt'],
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
    update: ({ req }) => Boolean(req.user?.roles?.includes('super-admin')),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('super-admin')),
  },
  hooks: {
    afterChange: [createCustomerOnTransaction],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who made this transaction',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      admin: {
        description: 'Product purchased (if applicable)',
      },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      unique: true,
      admin: {
        description: 'Stripe Payment Intent ID',
        readOnly: true,
      },
    },
    {
      name: 'stripeChargeId',
      type: 'text',
      admin: {
        description: 'Stripe Charge ID',
        readOnly: true,
      },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        description: 'Stripe Customer ID',
        readOnly: true,
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      admin: {
        description: 'Transaction amount in cents',
      },
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
      defaultValue: 'usd',
      admin: {
        description: 'Currency code (e.g., usd, eur)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Succeeded', value: 'succeeded' },
        { label: 'Failed', value: 'failed' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Partially Refunded', value: 'partially_refunded' },
      ],
      admin: {
        description: 'Transaction status from Stripe',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Payment', value: 'payment' },
        { label: 'Refund', value: 'refund' },
        { label: 'Subscription Payment', value: 'subscription_payment' },
        { label: 'Setup Fee', value: 'setup_fee' },
      ],
      defaultValue: 'payment',
    },
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Transaction description',
      },
    },
    {
      name: 'receiptUrl',
      type: 'text',
      admin: {
        description: 'Stripe receipt URL',
        readOnly: true,
      },
    },
    {
      name: 'refundAmount',
      type: 'number',
      admin: {
        condition: (data) => data.status === 'refunded' || data.status === 'partially_refunded',
        description: 'Amount refunded in cents',
      },
    },
    {
      name: 'refundReason',
      type: 'text',
      admin: {
        condition: (data) => data.status === 'refunded' || data.status === 'partially_refunded',
        description: 'Reason for refund',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata from Stripe',
      },
    },
    {
      name: 'subscription',
      type: 'relationship',
      relationTo: 'subscriptions',
      admin: {
        condition: (data) => data.type === 'subscription_payment',
        description: 'Related subscription (for subscription payments)',
      },
    },
  ],
}
