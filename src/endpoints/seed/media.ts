import type { File, Payload } from 'payload'

// Fetches a file from URL and returns it as a payload-compatible File object
export const fetchFileByURL = async (url: string): Promise<File> => {
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

// URLs for image assets
export const imageUrls = {
  hero: 'https://raw.githubusercontent.com/payloadcms/payload/main/templates/website/src/endpoints/seed/image-hero1.webp',
  post1: 'https://raw.githubusercontent.com/payloadcms/payload/main/templates/website/src/endpoints/seed/image-post1.webp',
  post2: 'https://raw.githubusercontent.com/payloadcms/payload/main/templates/website/src/endpoints/seed/image-post2.webp',
  post3: 'https://raw.githubusercontent.com/payloadcms/payload/main/templates/website/src/endpoints/seed/image-post3.webp',
}

// Create media for a tenant
export async function createTenantMedia(payload: Payload, tenantId: string) {
  // Fetch image files from GitHub
  const [image1Buffer, image2Buffer, image3Buffer, heroBuffer] = await Promise.all([
    fetchFileByURL(imageUrls.post1),
    fetchFileByURL(imageUrls.post2),
    fetchFileByURL(imageUrls.post3),
    fetchFileByURL(imageUrls.hero),
  ])

  // Create media for tenant
  const heroImage = await payload.create({
    collection: 'media',
    data: {
      alt: `Hero Image`,
      tenant: tenantId,
    },
    file: heroBuffer,
  })

  const image1 = await payload.create({
    collection: 'media',
    data: {
      alt: `Image 1`,
      tenant: tenantId,
    },
    file: image1Buffer,
  })

  const image2 = await payload.create({
    collection: 'media',
    data: {
      alt: `Image 2`,
      tenant: tenantId,
    },
    file: image2Buffer,
  })

  const image3 = await payload.create({
    collection: 'media',
    data: {
      alt: `Image 3`,
      tenant: tenantId,
    },
    file: image3Buffer,
  })

  return {
    heroImage,
    image1,
    image2,
    image3,
  }
}
