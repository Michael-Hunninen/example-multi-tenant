import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { EventsBlock } from '../../blocks/Events/config'
import { FormBlock } from '../../blocks/Form/config'
import { HorseShowcaseBlock } from '../../blocks/HorseShowcase/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { TestimonialsBlock } from '../../blocks/Testimonials/config'
import { TrainerProfileBlock } from '../../blocks/TrainerProfile/config'
import { TrainingServicesBlock } from '../../blocks/TrainingServices/config'
import { hero } from '../../heros/config'
import { slugField } from '../../fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { isSuperAdmin } from '../../access/isSuperAdmin'
import { getUserTenantIDs } from '../../utilities/getUserTenantIDs'
import { tenantField } from '@payloadcms/plugin-multi-tenant/fields'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: ({ req }) => {
      // Allow super-admin or tenant-admin to create pages
      if (isSuperAdmin(req.user)) return true
      return getUserTenantIDs(req.user, 'tenant-admin').length > 0
    },
    delete: ({ req }) => {
      // Allow super-admin or tenant-admin to delete pages
      if (isSuperAdmin(req.user)) return true
      return getUserTenantIDs(req.user, 'tenant-admin').length > 0
    },
    read: authenticatedOrPublished,
    update: ({ req }) => {
      // Allow super-admin or tenant-admin to update pages
      if (isSuperAdmin(req.user)) return true
      return getUserTenantIDs(req.user, 'tenant-admin').length > 0
    },
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction, 
                Content, 
                MediaBlock, 
                Archive, 
                FormBlock, 
                TrainerProfileBlock, 
                HorseShowcaseBlock, 
                TrainingServicesBlock, 
                TestimonialsBlock, 
                EventsBlock
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // Optimal interval for live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
