import type { CollectionConfig } from 'payload'

import { isSuperAdminAccess } from '@/access/isSuperAdmin'
import { updateAndDeleteAccess } from './access/updateAndDelete'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: isSuperAdminAccess,
    delete: updateAndDeleteAccess,
    read: ({ req }) => Boolean(req.user),
    update: updateAndDeleteAccess,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tenant Name',
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        description: 'Used for URL paths and identification (e.g., agency-owner, bronze-tenant)',
      },
      index: true,
      required: true,
      unique: true,
      label: 'Tenant Slug',
    },
    {
      name: 'isAgencyOwner',
      type: 'checkbox',
      defaultValue: false,
      label: 'Agency Owner',
      admin: {
        description: 'Mark this tenant as the agency owner (system default). Only one should exist.',
        position: 'sidebar',
      },
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Internal description of this tenant',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
      defaultValue: 'active',
      required: true,
      label: 'Status',
    },
    {
      name: 'allowPublicRead',
      type: 'checkbox',
      admin: {
        description:
          'If checked, logging in is not required to read. Useful for building public pages.',
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
      label: 'Allow Public Read',
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Tenant Settings',
      fields: [
        {
          name: 'maxUsers',
          type: 'number',
          label: 'Max Users',
          admin: {
            description: 'Maximum number of users allowed for this tenant (0 = unlimited)',
          },
          defaultValue: 0,
        },
        {
          name: 'maxPages',
          type: 'number',
          label: 'Max Pages',
          admin: {
            description: 'Maximum number of pages allowed for this tenant (0 = unlimited)',
          },
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'stripe',
      type: 'group',
      label: 'Stripe Configuration',
      admin: {
        description: 'Stripe payment processing configuration for this tenant',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Stripe',
          defaultValue: false,
        },
        {
          name: 'secretKey',
          type: 'text',
          label: 'Stripe Secret Key',
          admin: {
            description: 'Secret key from Stripe dashboard (starts with sk_)',
            condition: (data) => data?.stripe?.enabled === true,
          },
        },
        {
          name: 'publishableKey',
          type: 'text',
          label: 'Stripe Publishable Key',
          admin: {
            description: 'Publishable key from Stripe dashboard (starts with pk_)',
            condition: (data) => data?.stripe?.enabled === true,
          },
        },
        {
          name: 'webhookSecret',
          type: 'text',
          label: 'Webhook Secret',
          admin: {
            description: 'Webhook signing secret from Stripe dashboard (starts with whsec_)',
            condition: (data) => data?.stripe?.enabled === true,
          },
        },
        {
          name: 'isTestMode',
          type: 'checkbox',
          label: 'Test Mode',
          defaultValue: true,
          admin: {
            description: 'Use Stripe test mode (keys should start with pk_test_ and sk_test_)',
            condition: (data) => data?.stripe?.enabled === true,
          },
        },
      ],
    },
  ],
}
