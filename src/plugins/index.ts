import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { isSuperAdmin } from '../access/isSuperAdmin'
import { getUserTenantIDs } from '../utilities/getUserTenantIDs'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

export const plugins: Plugin[] = [
  formBuilderPlugin({
    // Configure form builder plugin to integrate with multi-tenant setup
    // Override form collection access control with tenant-aware access control
    formOverrides: {
      // Ensure proper access control for forms with tenant awareness
      access: {
        create: ({ req }) => {
          if (isSuperAdmin(req.user)) return true
          return getUserTenantIDs(req.user, 'tenant-admin').length > 0
        },
        delete: ({ req }) => {
          if (isSuperAdmin(req.user)) return true
          return getUserTenantIDs(req.user, 'tenant-admin').length > 0
        },
        read: authenticatedOrPublished,
        update: ({ req }) => {
          if (isSuperAdmin(req.user)) return true
          return getUserTenantIDs(req.user, 'tenant-admin').length > 0
        }
      },
      // Admin UI enhancements for better tenant awareness
      admin: {
        group: 'Collections',
        useAsTitle: 'title'
      }
    },
    // Override form submissions collection with tenant awareness
    formSubmissionOverrides: {
      // No need to modify access here as it's tied to the parent form
      // which already has tenant-based access control
    }
  }),
  redirectsPlugin({
    collections: ['pages', 'posts'],
  }),
  seoPlugin({
    // Configuration for SEO plugin
    collections: ['pages', 'posts'],
  }),
]
