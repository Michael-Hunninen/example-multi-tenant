import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidatePage: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context?.disableRevalidate) {
    // Only revalidate on server-side (not during client-side bundling)
    if (typeof window === 'undefined') {
      try {
        // Dynamic import to avoid bundling issues
        const { revalidatePath, revalidateTag } = await import('next/cache')
        
        if (doc._status === 'published') {
          const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

          payload.logger.info(`Revalidating page at path: ${path}`)

          revalidatePath(path)
          revalidateTag('pages-sitemap')
        }

        // If the page was previously published, we need to revalidate the old path
        if (previousDoc?._status === 'published' && doc._status !== 'published') {
          const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

          payload.logger.info(`Revalidating old page at path: ${oldPath}`)

          revalidatePath(oldPath)
          revalidateTag('pages-sitemap')
        }
      } catch (err) {
        payload.logger.error(`Error during page revalidation: ${err}`)
      }
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = async ({ doc, req: { context } }) => {
  if (!context?.disableRevalidate) {
    // Only revalidate on server-side (not during client-side bundling)
    if (typeof window === 'undefined') {
      try {
        // Dynamic import to avoid bundling issues
        const { revalidatePath, revalidateTag } = await import('next/cache')
        
        const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
        revalidatePath(path)
        revalidateTag('pages-sitemap')
      } catch (err) {
        console.error(`Error during page delete revalidation: ${err}`)
      }
    }
  }

  return doc
}
