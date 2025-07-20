import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'
import { isSuperAdminAccess } from '../access/isSuperAdmin'

export const Branding: CollectionConfig = {
  slug: '_branding_',
  // This collection is configured as isGlobal:true in the multi-tenant plugin config
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
    // Hide tenant field from admin UI to prevent duplicate fields
    hideAPIURL: true,
  },
  access: {
    read: () => true,
    update: isAdmin,
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
  },
  // Admin section moved up to avoid duplicate settings
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      required: true,
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Icon',
      required: true,
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon',
      required: true,
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'OG Image',
      required: true,
    },
    {
      name: 'titleSuffix',
      type: 'text',
      label: 'Title Suffix',
      defaultValue: '- Multi-Tenant Platform',
      required: true,
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta Description',
      defaultValue: 'Multi-Tenant SaaS Platform',
    },
    {
      name: 'ogDescription',
      type: 'textarea',
      label: 'OG Description',
      // Multi-tenant configuration will be handled by the plugin
      // The collection will be auto-detected and managed by the multi-tenant plugin
      defaultValue: 'Multi-Tenant Dashboard',
    },
    {
      name: 'ogTitle',
      type: 'text',
      label: 'OG Title',
      defaultValue: 'Multi-Tenant Dashboard',
    },
    {
      name: 'primaryColor',
      type: 'text',
      label: 'Primary Color',
      defaultValue: '#0C0C0C',
    },
    {
      name: 'accentColor',
      type: 'text',
      label: 'Accent Color',
      defaultValue: '#ffffff',
    },
    {
      name: 'headerBackgroundColor',
      type: 'text',
      label: 'Header Background Color',
      defaultValue: 'transparent',
    },
    {
      name: 'headerTextColor',
      type: 'text',
      label: 'Header Text Color',
      defaultValue: '#000000',
    },
    {
      name: 'headerLinks',
      type: 'array',
      label: 'Header Navigation Links',
      minRows: 0,
      maxRows: 10,
      labels: {
        singular: 'Navigation Link',
        plural: 'Navigation Links',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Link Text',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Link URL',
        },
      ],
    },
    {
      name: 'footerBackgroundColor',
      type: 'text',
      label: 'Footer Background Color',
      defaultValue: '#000000',
    },
    {
      name: 'footerTextColor',
      type: 'text',
      label: 'Footer Text Color',
      defaultValue: '#ffffff',
    },
    {
      name: 'footerLinkColor',
      type: 'text',
      label: 'Footer Link Color',
      defaultValue: '#ffffff',
    },
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Copyright Text',
    },
    {
      name: 'footerLinks',
      type: 'array',
      label: 'Footer Navigation Links',
      minRows: 0,
      maxRows: 10,
      labels: {
        singular: 'Footer Link',
        plural: 'Footer Links',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Link Text',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Link URL',
        },
      ],
    },
  ],
  versions: {
    drafts: true,
  },
}
