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
  ],
}
