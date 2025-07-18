import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'

export const plugins: Plugin[] = [
  formBuilderPlugin({}),
  redirectsPlugin({
    collections: ['pages', 'posts'],
  }),
  seoPlugin({
    // Configuration for SEO plugin
    collections: ['pages', 'posts'],
  }),
]
