import { Payload } from 'payload'
import { heroRichText } from './rich-text'

// Create posts for a tenant
export const createPosts = async (payload: Payload, tenantId: string, userId: string, categoryIds: string[], media: Record<string, any>) => {
  const postTitles = [`First Post for ${tenantId}`, `Second Post for ${tenantId}`]
  const postDescriptions = [`This is the first post for ${tenantId}.`, `This is the second post for ${tenantId}.`]

  // Create first post for tenant
  const post1 = await payload.create({
    collection: 'posts',
    data: {
      title: postTitles[0],
      tenant: tenantId,
      publishedAt: new Date().toISOString(),
      authors: [userId],
      categories: [categoryIds[0]], // Use first category
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
                  text: postDescriptions[0],
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
      hero: {
        type: 'highImpact',
        media: media.image1.id,
        richText: heroRichText(postTitles[0], ''),
      },
      meta: {
        title: postTitles[0],
        description: postDescriptions[0],
        image: media.image1.id,
      },
    } as any, // Type assertion for the entire data object
  })
  
  // Create second post
  const post2 = await payload.create({
    collection: 'posts',
    data: {
      title: postTitles[1],
      tenant: tenantId,
      publishedAt: new Date().toISOString(),
      authors: [userId],
      categories: [categoryIds[1]], // Use second category
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
                  text: postDescriptions[1],
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
      hero: {
        type: 'highImpact',
        media: media.image2.id,
        richText: heroRichText(postTitles[1], ''),
      },
      meta: {
        title: postTitles[1],
        description: postDescriptions[1],
        image: media.image2.id,
      },
    } as any, // Type assertion for the entire data object
  })

  // Update posts with related posts
  await payload.update({
    collection: 'posts',
    id: post1.id,
    data: {
      relatedPosts: [post2.id],
    },
  })
  
  await payload.update({
    collection: 'posts',
    id: post2.id,
    data: {
      relatedPosts: [post1.id],
    },
  })

  return [post1, post2]
}
