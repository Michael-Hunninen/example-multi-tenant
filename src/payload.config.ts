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
// Forms collection is provided by the FormBuilder plugin
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { isSuperAdmin } from './access/isSuperAdmin'
import type { Config } from './payload-types'
import { getUserTenantIDs } from './utilities/getUserTenantIDs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
  admin: {
    components: {
      // Adding BeforeDashboard component for admin UI
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
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
  collections: [Pages, Posts, Media, Categories, Users, Headers, Footers, Tenants],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
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
    multiTenantPlugin<Config>({
      collections: {
        pages: {},
        posts: {},
        media: {},
        categories: {},
        headers: {},
        footers: {},
        tenants: {},
        forms: {},
      },
      // Removing debug mode to hide the duplicate tenant field in admin UI
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
