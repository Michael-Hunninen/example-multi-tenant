import type { Payload, PayloadRequest, File } from 'payload'
import type { Media, User, Page, Post } from '../payload-types'

/**
 * Standalone seed script for JGPerformanceHorses tenant
 * This script adds a new tenant without affecting existing data
 */

// Define the tenant data
const tenantData = {
  name: 'JG Performance Horses',
  slug: 'jgperformancehorses',
  domain: 'jgperformancehorses.localhost:3000', // Local development domain
  tier: 'gold', // Using gold tier for premium features
  allowPublicRead: true,
  isActive: true,
}

// Define the tenant-specific content
const tenantContent = {
  // Company information
  companyName: 'JG Performance Horses',
  owner: 'Josiane Gauthier',
  location: 'Lucama, North Carolina',
  address: '7144 St Marys Church Road, Lucama, NC 27851',
  email: 'jgperformancehorses@yahoo.com',
  phone: '252.205.9945',
  officePhone: '252.239.0025',
  officeEmail: 'jgphoffice@yahoo.com',
  website: 'https://jgperformancehorses.com/',
  
  // Services
  services: [
    'Reining',
    'Ranch Riding',
    'Coaching',
    'Horses for Sale',
    'Training DVDs'
  ],
  
  // About content
  about: `
    Josiane Gauthier Performance Horses is dedicated to provide the best horse care available 
    in the industry along with a training program based on each horse as an individual. 
    With the owner's goal in mind, we project a short and long-term plan for each horse, 
    based on his personal mental and physical capability.
  `,

  // Feature content
  featureTitle: 'Ranch Riding Fundamentals',
  featureDescription: `
    An informational DVD about Ranch Riding with Josiane Gauthier. 
    Maneuvers, Gates, Transition, Lead Changes, Equipment & more!
    Learn what it takes to reach the next level!
  `,

  // Slogan
  slogan: 'The best preparation for tomorrow is doing your best today!',

  // Navigation items
  navItems: [
    { label: 'Home', url: '/' },
    { label: 'Services', url: '/services' },
    { label: 'Horses for Sale', url: '/horses-for-sale' },
    { label: 'About', url: '/about' },
    { label: 'Eques Academy', url: '/eques-academy' },
    { label: 'Contact', url: '/contact' },
    { label: 'Training DVDs', url: '/training' }
  ],

  // Admin user
  adminUser: {
    name: 'Josiane Gauthier',
    email: 'admin@jgperformancehorses.com',
    password: 'securePassword123' // Should be changed after initial setup
  }
}

// Define the types for our seed function
interface SeedArgs {
  payload: Payload;
  req?: PayloadRequest;
}

interface CreateMediaAssetArgs {
  tenant: string;
  url: string;
  alt: string;
  filename: string;
  payload: Payload;
}

// Type definitions for Payload CMS rich text content
type TextNode = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
};

type BlockNode = {
  type: string;
  children: TextNode[];
  version?: number;
  format?: "" | "left" | "start" | "center" | "right" | "end" | "justify";
  indent?: number;
};

// Helper function to create properly formatted rich text content for Payload CMS
function createRichText(blocks: BlockNode[]) {
  // Add version and other required properties to each block if not already present
  const blocksWithVersion = blocks.map(block => ({
    ...block,
    version: block.version || 1,
    format: block.format || "",
    indent: typeof block.indent === 'number' ? block.indent : 0
  }));
  
  return {
    root: {
      children: blocksWithVersion,
      direction: null as "ltr" | "rtl" | null,
      format: "" as "" | "left" | "start" | "center" | "right" | "end" | "justify",
      indent: 0,
      type: 'root',
      version: 1,
    }
  };
}

// Helper function to fetch file from URL and return as File object
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

// URLs for image assets
const imageUrls = {
  hero: 'https://raw.githubusercontent.com/payloadcms/payload/main/templates/website/src/endpoints/seed/image-hero1.webp',
  post1: 'https://raw.githubusercontent.com/payloadcms/payload/main/templates/website/src/endpoints/seed/image-post1.webp',
  post2: 'https://raw.githubusercontent.com/payloadcms/payload/main/templates/website/src/endpoints/seed/image-post2.webp',
}

/**
 * Helper function to create media asset
 */
async function createMediaAsset({
  tenant,
  url,
  alt,
  filename,
  payload,
}: CreateMediaAssetArgs): Promise<Media> {
  const file = await fetchFileByURL(url);
  return await payload.create({
    collection: 'media',
    data: {
      tenant,
      alt,
    } as any,
    file,
  });
}

/**
 * Helper function to create the tenant
 */
async function createTenant(payload: Payload): Promise<any> {
  return await payload.create({
    collection: 'tenants',
    data: tenantData,
  });
}

/**
 * Helper function to create the admin user
 */
async function createAdmin(payload: Payload, tenantId: string): Promise<User> {
  return await payload.create({
    collection: 'users',
    data: {
      name: tenantContent.adminUser.name,
      email: tenantContent.adminUser.email,
      password: tenantContent.adminUser.password,
      roles: ['tenant-admin'],
      tenants: [
        {
          tenant: tenantId,
          roles: ['tenant-admin'],
        },
      ],
    } as any
  });
}

/**
 * Helper function to create header navigation
 */
async function createHeaderNav(payload: Payload, tenantId: string): Promise<any> {
  return await payload.create({
    collection: 'headers',
    data: {
      name: `${tenantData.name} Header`,
      tenant: tenantId,
      navItems: tenantContent.navItems.map(item => ({
        link: {
          type: 'custom',
          label: item.label,
          url: item.url,
        },
      })),
    } as any
  });
}

/**
 * Helper function to create footer navigation
 */
async function createFooterNav(payload: Payload, tenantId: string): Promise<any> {
  return await payload.create({
    collection: 'footers',
    data: {
      name: `${tenantData.name} Footer`,
      tenant: tenantId,
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
            label: 'Contact Us',
            url: '/contact',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Website',
            newTab: true,
            url: tenantContent.website,
          },
        },
      ],
    } as any
  });
}

/**
 * Helper function to create home page
 */
async function createHomePage(
  payload: Payload, 
  tenantId: string, 
  logoId: string, 
  heroImageId: string
): Promise<any> {
  payload.logger.info('— Creating home page...');
  
  return await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      tenant: tenantId,
      _status: 'published',
      hero: {
        type: 'highImpact',
        richText: createRichText([
          {
            children: [
              {
                text: tenantContent.slogan,
              },
            ],
            type: 'h2',
          },
        ]),
        media: heroImageId,
      },
      layout: [
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: createRichText([
                {
                  children: [
                    {
                      text: tenantContent.companyName,
                    },
                  ],
                  type: 'h1',
                },
                {
                  children: [
                    {
                      text: tenantContent.about,
                    },
                  ],
                  type: 'p',
                },
              ])
            },
          ],
        },
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: createRichText([
                {
                  children: [
                    {
                      text: tenantContent.featureTitle,
                    },
                  ],
                  type: 'h2',
                },
                {
                  children: [
                    {
                      text: tenantContent.featureDescription,
                    },
                  ],
                  type: 'p',
                },
              ])
            },
          ],
        },
      ],
    } as any
  });
}

/**
 * Helper function to create about page
 */
async function createAboutPage(
  payload: Payload, 
  tenantId: string, 
  logoId: string, 
  coachImageId: string
): Promise<any> {
  payload.logger.info('— Creating about page...');
  
  return await payload.create({
    collection: 'pages',
    data: {
      title: 'About',
      slug: 'about',
      tenant: tenantId,
      _status: 'published',
      layout: [
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: createRichText([
                {
                  children: [
                    {
                      text: `About ${tenantContent.companyName}`,
                    },
                  ],
                  type: 'h1',
                },
                {
                  children: [
                    {
                      text: tenantContent.about,
                    },
                  ],
                  type: 'p',
                },
                {
                  children: [
                    {
                      text: `Located in ${tenantContent.location}, our facility provides top-notch training services including ${tenantContent.services.join(', ')}.`,
                    },
                  ],
                  type: 'p',
                },
              ])
            },
          ],
        },
      ],
    } as any
  });
}

/**
 * Helper function to create contact page
 */
async function createContactPage(
  payload: Payload, 
  tenantId: string, 
  logoId: string
): Promise<any> {
  payload.logger.info('— Creating contact page...');
  
  return await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      tenant: tenantId,
      _status: 'published',
      layout: [
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: createRichText([
                {
                  children: [
                    {
                      text: 'Contact Us',
                    },
                  ],
                  type: 'h1',
                },
                {
                  children: [
                    {
                      text: `Get in touch with ${tenantContent.companyName} to learn more about our services or schedule a visit.`,
                    },
                  ],
                  type: 'p',
                },
                {
                  children: [
                    {
                      text: 'Contact Information:',
                    },
                  ],
                  type: 'h3',
                },
                {
                  children: [
                    {
                      text: `Owner: ${tenantContent.owner}`,
                    },
                  ],
                  type: 'p',
                },
                {
                  children: [
                    {
                      text: `Phone: ${tenantContent.phone}`,
                    },
                  ],
                  type: 'p',
                },
                {
                  children: [
                    {
                      text: `Email: ${tenantContent.email}`,
                    },
                  ],
                  type: 'p',
                },
                {
                  children: [
                    {
                      text: `Office Phone: ${tenantContent.officePhone}`,
                    },
                  ],
                  type: 'p',
                },
                {
                  children: [
                    {
                      text: `Office Email: ${tenantContent.officeEmail}`,
                    },
                  ],
                  type: 'p',
                },
                {
                  children: [
                    {
                      text: `Address: ${tenantContent.address}`,
                    },
                  ],
                  type: 'p',
                },
              ])
            },
          ],
        },
      ],
    } as any
  });
}

/**
 * Helper function to create a blog post
 */
async function createBlogPost(
  payload: Payload, 
  tenantId: string, 
  heroImageId: string,
  authorId: string
): Promise<any> {
  payload.logger.info('— Creating blog post...');
  
  return await payload.create({
    collection: 'posts',
    data: {
      title: 'Ranch Riding Fundamentals',
      slug: 'ranch-riding-fundamentals',
      tenant: tenantId,
      _status: 'published',
      authors: [authorId],
      publishedAt: new Date().toISOString(),
      content: createRichText([
        {
          children: [
            {
              text: 'Ranch Riding Fundamentals',
            },
          ],
          type: 'h1',
        },
        {
          children: [
            {
              text: 'Learn the essentials of Ranch Riding with expert training from Josiane Gauthier.',
            },
          ],
          type: 'p',
        },
        {
          children: [
            {
              text: 'Our Ranch Riding Fundamentals program covers maneuvers, gates, transitions, lead changes, equipment and more.',
            },
          ],
          type: 'p',
        },
        {
          children: [
            {
              text: 'Contact us to schedule your training session today!',
            },
          ],
          type: 'p',
        },
      ])
    } as any
  });
}

/**
 * Main seed function for JG Performance Horses tenant
 */
export const seedJGPerformanceHorses = async ({ payload, req }: SeedArgs): Promise<void> => {
  payload.logger.info('Seeding JG Performance Horses tenant...');

  // Create tenant
  payload.logger.info('— Creating JG Performance Horses tenant...');
  const tenant = await createTenant(payload);

  // Create admin user for this tenant
  payload.logger.info('— Creating tenant admin user...');
  const adminUser = await createAdmin(payload, tenant.id);

  // Upload assets for the tenant
  payload.logger.info('— Uploading assets...');
  const logoDoc = await createMediaAsset({
    tenant: tenant.id,
    url: imageUrls.hero,
    alt: 'JG Performance Horses Logo',
    filename: 'jg-performance-horses-logo.webp',
    payload,
  });

  const heroImage = await createMediaAsset({
    tenant: tenant.id,
    url: imageUrls.post1,
    alt: 'Horse Reining Performance',
    filename: 'horse-reining.jpg',
    payload,
  });

  const coachImage = await createMediaAsset({
    tenant: tenant.id,
    url: imageUrls.post2,
    alt: 'Josiane Gauthier - Professional Reining Trainer',
    filename: 'josiane-gauthier.jpg',
    payload,
  });

  // Create header navigation
  payload.logger.info('— Creating header navigation...');
  await createHeaderNav(payload, tenant.id);

  // Create footer navigation
  payload.logger.info('— Creating footer navigation...');
  await createFooterNav(payload, tenant.id);

  // Create pages and post
  await createHomePage(payload, tenant.id, logoDoc.id, heroImage.id);
  await createAboutPage(payload, tenant.id, logoDoc.id, coachImage.id);
  await createContactPage(payload, tenant.id, logoDoc.id);

  // Create a sample blog post
  await createBlogPost(payload, tenant.id, heroImage.id, adminUser.id);

  payload.logger.info('✅ Successfully seeded JG Performance Horses tenant!');
};

// Export the seed function
export default seedJGPerformanceHorses;
