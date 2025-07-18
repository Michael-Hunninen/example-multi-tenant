import type { CollectionBeforeChangeHook } from 'payload'

export const populatePublishedAt: CollectionBeforeChangeHook = ({ data, operation }) => {
  const now = new Date()

  // If this is a create operation, or if explicitly published right now
  if (operation === 'create' || (data._status === 'published' && !data.publishedAt)) {
    return {
      ...data,
      publishedAt: now,
    }
  }

  // Otherwise, return data as-is
  return data
}
