import type { PayloadRequest } from 'payload'

const collectionPrefixMap: Partial<Record<string, string>> = {
  posts: '/posts',
  pages: '',
}

type Args = {
  slug: string
  collection: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ slug, collection }: Args): string => {
  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: `${collectionPrefixMap[collection] || ''}/${slug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
