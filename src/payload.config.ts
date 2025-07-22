import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { defaultLexical } from './fields/defaultLexical'
import sharp from 'sharp' // Import sharp exactly as in the website template
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

// Import plugins
import { plugins } from './plugins'

import { Pages } from './collections/Pages'
import { Tenants } from './collections/Tenants'
import Users from './collections/Users'
import { Headers } from './collections/Headers'
import { Footers } from './collections/Footers'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Branding } from './collections/Branding'
import { Domains } from './collections/Domains'
// LMS Collections
import { Videos } from './collections/Videos'
import { Programs } from './collections/Programs'
import { Enrollments } from './collections/Enrollments'
import { VideoProgress } from './collections/VideoProgress'
import { Comments } from './collections/Comments'
import { Achievements } from './collections/Achievements'
import { UserAchievements } from './collections/UserAchievements'
// Stripe Collections
import { Products } from './collections/Products'
import { Subscriptions } from './collections/Subscriptions'
import { Transactions } from './collections/Transactions'
import { Customers } from './collections/Customers'
// Forms collection is provided by the FormBuilder plugin
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { tenantStripeEndpoints } from './endpoints/stripe/tenantStripeEndpoints'
import { isSuperAdmin } from './access/isSuperAdmin'
import type { Config } from './payload-types'
import { getUserTenantIDs } from './utilities/getUserTenantIDs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
  endpoints: [
    // Only include Stripe endpoints if API keys are configured
    ...(process.env.STRIPE_SECRET_KEY ? tenantStripeEndpoints : []),
  ],
  admin: {
    components: {
      // Adding BeforeDashboard component for admin UI
      beforeDashboard: [
       // '@/components/BeforeDashboard',
        '@/components/AnalyticsDashboard'
      ],
      // Adding Logo and Icon components for whitelabel
      graphics: {
        Icon: '/graphics/Icon/index.tsx#Icon',
        Logo: '/graphics/Logo/index.tsx#Logo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Custom meta data for whitelabel
    meta: {
      description: 'Multi-Tenant SaaS Platform',
      icons: [
        {
          type: 'image/svg+xml',
          rel: 'icon',
          url: '/favicon.ico',
        },
      ],
      openGraph: {
        description: 'Enterprise Multi-Tenant SaaS Platform',
        images: [
          {
            height: 600,
            url: '/og-image.png',
            width: 800,
          },
        ],
        title: 'Multi-Tenant Dashboard',
      },
      titleSuffix: '- Multi-Tenant Platform',
    },
    user: 'users',
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  collections: [
    Users, 
    Tenants, 
    Domains, 
    Branding, 
    Pages, 
    Media, 
    Posts, 
    Categories, 
    Headers, 
    Footers,
    // LMS Collections
    Videos,
    Programs,
    Enrollments,
    VideoProgress,
    Comments,
    Achievements,
    UserAchievements,
    // Stripe Collections
    Products,
    Subscriptions,
    Transactions,
    Customers,
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
    connectOptions: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  }),
  // db: postgresAdapter({
  //   pool: {
  //     connectionString: process.env.POSTGRES_URL,
  //   },
  // }),
  onInit: async (payload) => {
    // Seed functionality is now handled through the endpoints/seed files
    // and can be triggered manually through the API
    if (process.env.SEED_DB) {
      payload.logger.info('Seeding is now handled through the /api/seed endpoint')
    }
  },
  editor: defaultLexical,
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  secret: process.env.PAYLOAD_SECRET as string,
  sharp, // Add Sharp as a top-level property exactly as in the website template
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Global upload settings are limited in Payload v2+
  // The type FetchAPIFileUploadOptions only supports 'limits'
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
  plugins: [
    ...plugins,
    // Only include Stripe plugin if API keys are configured
    ...(process.env.STRIPE_SECRET_KEY ? [
      stripePlugin({
        stripeSecretKey: process.env.STRIPE_SECRET_KEY,
        isTestKey: Boolean(process.env.STRIPE_SECRET_KEY?.includes('sk_test')),
        stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET,
        rest: false,
        sync: [
          {
            collection: 'products',
            stripeResourceType: 'products',
            stripeResourceTypeSingular: 'product',
            fields: [
              {
                fieldPath: 'name',
                stripeProperty: 'name',
              },
              {
                fieldPath: 'description',
                stripeProperty: 'description',
              },
              {
                fieldPath: 'stripeProductId',
                stripeProperty: 'id',
              },
            ],
          },
          {
            collection: 'customers',
            stripeResourceType: 'customers',
            stripeResourceTypeSingular: 'customer',
            fields: [
              {
                fieldPath: 'email',
                stripeProperty: 'email',
              },
              {
                fieldPath: 'name',
                stripeProperty: 'name',
              },
              {
                fieldPath: 'stripeCustomerId',
                stripeProperty: 'id',
              },
            ],
          },
        ],
      })
    ] : []),
    multiTenantPlugin<Config>({
      collections: {
        pages: {
          // Standard collection - each tenant has their own pages
        },
        posts: {
          // Standard collection - each tenant has their own posts
        },
        media: {
          // Standard collection - each tenant has their own media
        },
        categories: {
          // Standard collection - each tenant has their own categories
        },
        headers: {
          // Standard collection - each tenant has their own headers
        },
        footers: {
          // Standard collection - each tenant has their own footers
        },
        domains: {
          // Domains collection as global - one set of domain mappings per tenant
          isGlobal: true,
        },
        // tenants: removed from multi-tenant plugin - tenants collection should not have tenant field added to itself
        // users: removed from multi-tenant plugin - uses tenantsArrayField instead of standard tenant field
        forms: {
          // Standard collection - each tenant has their own forms
        },
        // LMS Collections
        videos: {
          // Standard collection - each tenant has their own videos
        },
        programs: {
          // Standard collection - each tenant has their own programs
        },
        enrollments: {
          // Standard collection - each tenant has their own enrollments
        },
        'video-progress': {
          // Standard collection - each tenant has their own video progress
        },
        comments: {
          // Standard collection - each tenant has their own comments
        },
        achievements: {
          // Standard collection - each tenant has their own achievements
        },
        'user-achievements': {
          // Standard collection - each tenant has their own user achievements
        },
        '_branding_': {
          // Set as a global collection (one branding per tenant)
          isGlobal: true,
        },
        // Stripe Collections
        products: {
          // Standard collection - each tenant has their own products
        },
        subscriptions: {
          // Standard collection - each tenant has their own subscriptions
        },
        transactions: {
          // Standard collection - each tenant has their own transactions
        },
        customers: {
          // Standard collection - each tenant has their own customers
        },
      },
      // Debug mode disabled to prevent duplicate tenant fields in admin UI
      debug: false,
      tenantField: {
        access: {
          read: () => true,
          update: ({ req }) => {
            if (isSuperAdmin(req.user)) {
              return true
            }
            return getUserTenantIDs(req.user).length > 0
          },
        },
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
  ],
})
