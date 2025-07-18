import { CollectionConfig } from 'payload'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { isSuperAdmin } from '../../access/isSuperAdmin'
import { getUserTenantIDs } from '../../utilities/getUserTenantIDs'

// This is a simple wrapper around the form-builder's form collection
// It allows us to customize it for our multi-tenant project
export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
  },
  access: {
    create: ({ req }) => {
      // Allow super-admin or tenant-admin to create forms
      if (isSuperAdmin(req.user)) return true
      return getUserTenantIDs(req.user, 'tenant-admin').length > 0
    },
    delete: ({ req }) => {
      // Allow super-admin or tenant-admin to delete forms
      if (isSuperAdmin(req.user)) return true
      return getUserTenantIDs(req.user, 'tenant-admin').length > 0
    },
    read: authenticatedOrPublished,
    update: ({ req }) => {
      // Allow super-admin or tenant-admin to update forms
      if (isSuperAdmin(req.user)) return true
      return getUserTenantIDs(req.user, 'tenant-admin').length > 0
    },
  },
  fields: [
    // The tenant field is automatically added by the multi-tenant plugin
    // when the collection is registered in the plugin config
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
