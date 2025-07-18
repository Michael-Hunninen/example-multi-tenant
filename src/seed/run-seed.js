// JavaScript runner for the JG Performance Horses seed script
import * as dotenv from 'dotenv';
import { createLocalReq, getPayload } from 'payload';
import configPromise from '../payload.config.js';

// Load environment variables
dotenv.config();

const seed = async () => {
  console.log('Initializing Payload...');
  
  try {
    // Initialize Payload with the configuration
    const payload = await getPayload({
      config: configPromise,
    });

    console.log('Starting JG Performance Horses seeding process...');
    
    // Create a local request for Payload transactions
    const payloadReq = await createLocalReq({}, payload);
    
    // Create tenant data
    console.log('Creating JG Performance Horses tenant...');
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: 'JG Performance Horses',
        slug: 'jgperformancehorses',
        domain: 'jgperformancehorses.localhost:3000',
        tier: 'gold',
        allowPublicRead: true,
        isActive: true,
      },
    });
    
    console.log(`Created tenant with ID: ${tenant.id}`);
    
    // Create admin user
    console.log('Creating admin user...');
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        name: 'Josiane Gauthier',
        email: 'admin@jgperformancehorses.com',
        password: 'securePassword123',
        roles: ['tenant-admin'],
        tenants: [
          {
            tenant: tenant.id,
            roles: ['tenant-admin'],
          },
        ],
      },
    });
    
    console.log(`Created admin user with ID: ${adminUser.id}`);
    
    // Fetch image from URL function
    async function fetchFileByURL(url) {
      const res = await fetch(url, {
        credentials: 'include',
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`);
      }

      const data = await res.arrayBuffer();

      return {
        name: url.split('/').pop() || `file-${Date.now()}`,
        data: Buffer.from(data),
        mimetype: `image/${url.split('.').pop()}`,
        size: data.byteLength,
      };
    }
    
    // Upload logo/hero image
    console.log('Uploading media assets...');
    const heroImageUrl = 'https://raw.githubusercontent.com/payloadcms/payload/main/templates/website/src/endpoints/seed/image-hero1.webp';
    const file = await fetchFileByURL(heroImageUrl);
    
    const heroImage = await payload.create({
      collection: 'media',
      data: {
        tenant: tenant.id,
        alt: 'JG Performance Horses Hero',
      },
      file,
    });
    
    console.log(`Created hero image with ID: ${heroImage.id}`);
    
    // Create navigation
    console.log('Creating header navigation...');
    await payload.create({
      collection: 'headers',
      data: {
        name: `JG Performance Horses Header`,
        tenant: tenant.id,
        navItems: [
          { link: { type: 'custom', label: 'Home', url: '/' } },
          { link: { type: 'custom', label: 'Services', url: '/services' } },
          { link: { type: 'custom', label: 'About', url: '/about' } },
          { link: { type: 'custom', label: 'Contact', url: '/contact' } },
        ],
      },
    });
    
    console.log('Creating footer navigation...');
    await payload.create({
      collection: 'footers',
      data: {
        name: `JG Performance Horses Footer`,
        tenant: tenant.id,
        navItems: [
          { link: { type: 'custom', label: 'Admin', url: '/admin' } },
          { link: { type: 'custom', label: 'Contact Us', url: '/contact' } },
        ],
      },
    });
    
    // Helper function for creating formatted rich text
    function createRichText(blocks) {
      const blocksWithVersion = blocks.map(block => ({
        ...block,
        version: block.version || 1,
        format: block.format || "",
        indent: typeof block.indent === 'number' ? block.indent : 0
      }));
      
      return {
        root: {
          children: blocksWithVersion,
          direction: null,
          format: "",
          indent: 0,
          type: 'root',
          version: 1,
        }
      };
    }
    
    // Create homepage
    console.log('Creating home page...');
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        tenant: tenant.id,
        _status: 'published',
        hero: {
          type: 'highImpact',
          richText: createRichText([
            {
              children: [{ text: 'The best preparation for tomorrow is doing your best today!' }],
              type: 'h2',
            },
          ]),
          media: heroImage.id,
        },
        layout: [
          {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: createRichText([
                  {
                    children: [{ text: 'JG Performance Horses' }],
                    type: 'h1',
                  },
                  {
                    children: [
                      {
                        text: 'Dedicated to provide the best horse care available in the industry along with a training program based on each horse as an individual.',
                      },
                    ],
                    type: 'p',
                  },
                ])
              },
            ],
          },
        ],
      },
    });
    
    // Create about page
    console.log('Creating about page...');
    await payload.create({
      collection: 'pages',
      data: {
        title: 'About',
        slug: 'about',
        tenant: tenant.id,
        _status: 'published',
        layout: [
          {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: createRichText([
                  {
                    children: [{ text: 'About JG Performance Horses' }],
                    type: 'h1',
                  },
                  {
                    children: [
                      {
                        text: 'Josiane Gauthier Performance Horses is dedicated to provide the best horse care available in the industry along with a training program based on each horse as an individual.',
                      },
                    ],
                    type: 'p',
                  },
                ])
              },
            ],
          },
        ],
      },
    });
    
    // Create contact page
    console.log('Creating contact page...');
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Contact',
        slug: 'contact',
        tenant: tenant.id,
        _status: 'published',
        layout: [
          {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: createRichText([
                  {
                    children: [{ text: 'Contact Us' }],
                    type: 'h1',
                  },
                  {
                    children: [
                      {
                        text: 'Get in touch with JG Performance Horses to learn more about our services or schedule a visit.',
                      },
                    ],
                    type: 'p',
                  },
                  {
                    children: [{ text: 'Contact Information:' }],
                    type: 'h3',
                  },
                  {
                    children: [{ text: 'Owner: Josiane Gauthier' }],
                    type: 'p',
                  },
                  {
                    children: [{ text: 'Email: jgperformancehorses@yahoo.com' }],
                    type: 'p',
                  },
                  {
                    children: [{ text: 'Phone: 252.205.9945' }],
                    type: 'p',
                  },
                ])
              },
            ],
          },
        ],
      },
    });
    
    // Create a blog post
    console.log('Creating blog post...');
    await payload.create({
      collection: 'posts',
      data: {
        title: 'Ranch Riding Fundamentals',
        slug: 'ranch-riding-fundamentals',
        tenant: tenant.id,
        _status: 'published',
        authors: [adminUser.id],
        publishedAt: new Date().toISOString(),
        content: createRichText([
          {
            children: [{ text: 'Ranch Riding Fundamentals' }],
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
        ]),
      },
    });
    
    console.log('✅ Successfully seeded JG Performance Horses tenant!');
    
  } catch (error) {
    console.error('Error seeding JG Performance Horses tenant:');
    console.error(error);
  }

  process.exit(0);
};

seed();
