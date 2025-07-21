import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'
import { isSuperAdminAccess } from '../access/isSuperAdmin'
import { getUserTenantIDs } from '../utilities/getUserTenantIDs'

// Custom access control for domains - allows tenant admins to manage their own domains
const domainAccess = ({ req }: { req: any }) => {
  const { user } = req
  
  // Super-admins have full access
  if (user?.roles?.includes('super-admin')) {
    return true
  }
  
  // Tenant admins can access domains for their tenants
  const tenantAdminIDs = getUserTenantIDs(user, 'tenant-admin')
  if (tenantAdminIDs.length > 0) {
    // Return a where constraint that limits to the tenant admin's tenants
    // The multi-tenant plugin will handle filtering based on these IDs
    return {
      tenant: {
        in: tenantAdminIDs,
      },
    }
  }
  
  return false
}

export const Domains: CollectionConfig = {
  slug: 'domains',
  access: {
    read: () => true, // Public read for domain resolution
    update: domainAccess,
    create: domainAccess,
    delete: isSuperAdminAccess,
  },
  admin: {
    group: 'System',
    useAsTitle: 'domain',
    defaultColumns: ['domain', 'isRootDomain', 'landingPage', 'enableCustomPages', 'isActive', 'isDefault'],
  },
  fields: [
    {
      name: 'domain',
      type: 'text',
      required: true,
      unique: true,
      label: 'Domain',
      admin: {
        description: 'Full domain (e.g., example.com, tenant.yourdomain.com, localhost:3000)',
      },
    },
    // tenant field is automatically added by multi-tenant plugin for global collections
    {
      name: 'isRootDomain',
      type: 'checkbox',
      label: 'Is Root Domain',
      defaultValue: false,
      admin: {
        description: 'Check if this is the root domain (e.g., yourdomain.com)',
        position: 'sidebar',
      },
    },
    {
      name: 'landingPageType',
      type: 'select',
      label: 'Landing Page Type',
      defaultValue: 'default',
      options: [
        {
          label: 'Default Dashboard',
          value: 'default',
        },
        {
          label: 'Custom Page',
          value: 'page',
        },
        {
          label: 'Custom Homepage (JG Performance Horses)',
          value: 'custom-homepage',
        },
      ],
      admin: {
        description: 'Choose what type of landing page to show for this domain',
      },
    },
    {
      name: 'enableCustomPages',
      type: 'checkbox',
      label: 'Enable Custom Pages',
      defaultValue: false,
      admin: {
        description: 'Enable custom pages (About, Services, Pricing, Contact) for this domain. When enabled, the main site header, footer, and admin bar will be hidden.',
        position: 'sidebar',
      },
    },
    {
      name: 'landingPage',
      type: 'relationship',
      relationTo: 'pages',
      required: false,
      label: 'Landing Page',
      admin: {
        description: 'The page to show when visiting this domain',
        condition: (data, siblingData) => siblingData?.landingPageType === 'page',
      },
      // filterOptions will be handled by multi-tenant plugin for tenant-scoped pages
      // The plugin automatically filters pages by the current tenant context
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Whether this domain mapping is active',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Default Domain',
      admin: {
        description: 'Mark as the primary domain for this tenant (only one per tenant)',
      },
    },
    {
      name: 'redirectTo',
      type: 'text',
      label: 'Redirect To',
      admin: {
        description: 'Optional: Redirect this domain to another URL',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // Ensure only one default domain per tenant
        if (data?.isDefault && data?.tenant) {
          // This would need additional logic to check for existing defaults
          // For now, we'll handle this in the admin UI
        }
        return data
      },
    ],
  },
  versions: {
    drafts: false, // Domains should be live immediately
  },
}
