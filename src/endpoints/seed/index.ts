import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home-static'
import { createTenantMedia } from './media'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'tenants',
  'redirects',
  'headers',
  'footers'
]
// Multi-tenant uses collections for headers/footers, not globals
const globals: GlobalSlug[] = []

// Define the tenant configurations for our multi-tenant setup
const tenantConfigs = [
  { name: 'Gold Tenant', slug: 'gold-tenant', tier: 'gold' },
  { name: 'Silver Tenant', slug: 'silver-tenant', tier: 'silver' },
  { name: 'Bronze Tenant', slug: 'bronze-tenant', tier: 'bronze' }
]

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database - we no longer have globals to clear in multi-tenant setup

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection]?.config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  // Delete generic demo author
  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })
  
  // Delete all tenant-specific author users
  for (const tenantConfig of tenantConfigs) {
    await payload.delete({
      collection: 'users',
      depth: 0,
      where: {
        email: {
          equals: `demo-author-${tenantConfig.slug}@example.com`,
        },
      },
    })
  }

  // Create tenants first
  payload.logger.info(`— Creating tenants...`)
  
  const tenantDocs = []
  for (const tenantConfig of tenantConfigs) {
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: tenantConfig.name,
        slug: tenantConfig.slug,
        // Store tier information in a separate variable to use later
      } as any, // Type assertion for tenant fields
    })
    tenantDocs.push(tenant)
  }

  // For each tenant, seed content with tenant-specific assets
  for (const tenant of tenantDocs) {
    payload.logger.info(`— Seeding content for ${tenant.name}...`)
    
    payload.logger.info(`— Seeding media for ${tenant.name}...`)

    // Create tenant-specific media assets
    const { heroImage: imageHomeDoc, image1: image1Doc, image2: image2Doc, image3: image3Doc } = await createTenantMedia(payload, tenant.id)

    // Include tenant ID in all created content
    const tenantData = { tenant: tenant.id }

    const [demoAuthor, category1, category2, category3] = await Promise.all([
      payload.create({
        collection: 'users',
        data: {
          name: `Demo Author - ${tenant.name}`,
          email: `demo-author-${tenant.slug}@example.com`,
          password: 'password',
          tenants: [{
            tenant: tenant.id,
            roles: ['tenant-admin'],
          }],
        } as any, // Type assertion for multi-tenant plugin fields
      }),
      payload.create({
        collection: 'categories',
        data: {
          title: 'Category One',
          tenant: tenant.id,
        } as any, // Type assertion for tenant fields
      }),
      payload.create({
        collection: 'categories',
        data: {
          title: 'Category Two',
          tenant: tenant.id,
        } as any, // Type assertion for tenant fields
      }),
      payload.create({
        collection: 'categories',
        data: {
          title: 'Category Three',
          tenant: tenant.id,
        } as any, // Type assertion for tenant fields
      }),
    ])

    payload.logger.info(`— Seeding posts for ${tenant.name}...`)

    // Do not create posts with `Promise.all` because we want the posts to be created in order
    // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
    const post1Doc = await payload.create({
      collection: 'posts',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: {
        title: 'Post 1',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'This is the content of post 1',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        author: demoAuthor.id,
        categories: [category1.id],
        ...tenantData,
      } as any, // Type assertion for multi-tenant plugin fields
    })

    const post2Doc = await payload.create({
      collection: 'posts',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: {
        title: 'Post 2',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'This is the content of post 2',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        author: demoAuthor.id,
        categories: [category2.id],
        ...tenantData,
      } as any, // Type assertion for multi-tenant plugin fields
    })

    const post3Doc = await payload.create({
      collection: 'posts',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: {
        title: 'Post 3',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'This is the content of post 3',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        author: demoAuthor.id,
        categories: [category3.id],
        ...tenantData,
      } as any, // Type assertion for multi-tenant plugin fields
    })

    // update each post with related posts
    await payload.update({
      id: post1Doc.id,
      collection: 'posts',
      data: {
        relatedPosts: [post2Doc.id, post3Doc.id],
      },
    })
    await payload.update({
      id: post2Doc.id,
      collection: 'posts',
      data: {
        relatedPosts: [post1Doc.id, post3Doc.id],
      },
    })
    await payload.update({
      id: post3Doc.id,
      collection: 'posts',
      data: {
        relatedPosts: [post1Doc.id, post2Doc.id],
      },
    })

    payload.logger.info(`— Seeding contact form for ${tenant.name}...`)

    // Create a Contact Form
    const contactForm = await payload.create({
      collection: 'forms',
      data: {
        ...contactFormData,
        title: `Contact Form - ${tenant.name}`,
        tenant: tenant.id,
      } as any, // Type assertion for multi-tenant plugin fields
    })

    payload.logger.info(`— Seeding pages for ${tenant.name}...`)

    const [homePage, contactPage] = await Promise.all([
      payload.create({
        collection: 'pages',
        depth: 0,
        data: {
          ...home,
          hero: {
            ...home.hero,
            media: imageHomeDoc.id,
          },
          tenant: tenant.id,
        } as any, // Type assertion for multi-tenant plugin fields
      }),
      payload.create({
        collection: 'pages',
        depth: 0,
        data: {
          ...contactPageData,
          tenant: tenant.id,
          title: 'Contact', // Explicitly set the title field
          layout: [
            {
              blockType: 'formBlock',
              blockName: 'Contact Form Block',
              form: contactForm.id,
              enableIntro: true,
              introContent: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'heading',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Example contact form:',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      tag: 'h3',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
              },
            },
          ],
        } as any, // Type assertion for multi-tenant plugin fields
      }),
    ])

    payload.logger.info(`— Seeding globals for ${tenant.name}...`)

    await Promise.all([
      // Create or update tenant-specific header collection item
      payload.create({
        collection: 'headers',
        data: {
          name: `${tenant.name} Header`, // Required field for headers collection
          tenant: tenant.id,
          navItems: [
            {
              link: {
                type: 'custom',
                label: 'Posts',
                url: '/posts',
              },
            },
            {
              link: {
                type: 'reference',
                label: 'Contact',
                reference: {
                  relationTo: 'pages',
                  value: contactPage.id,
                },
              },
            },
          ],
        } as any, // Type assertion for multi-tenant plugin fields
      }),
      // Create or update tenant-specific footer collection item
      payload.create({
        collection: 'footers',
        data: {
          name: `${tenant.name} Footer`, // Required field for footers collection
          tenant: tenant.id,
          navItems: [
            {
              link: {
                type: 'custom',
                label: 'Admin',
                url: '/admin',
              },
            },
            {
              link: {
                type: 'custom',
                label: 'Source Code',
                newTab: true,
                url: 'https://github.com/payloadcms/payload/tree/main/templates/website',
              },
            },
            {
              link: {
                type: 'custom',
                label: 'Payload',
                newTab: true,
                url: 'https://payloadcms.com/',
              },
            },
          ],
        } as any, // Type assertion for multi-tenant plugin fields
      }),
    ])
  }

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
