import { Payload } from 'payload'

import type { Header, Footer, Page } from '../../payload-types';

// Type to help with creating Headers in collections
type HeaderData = Omit<Header, 'id' | 'createdAt' | 'updatedAt'> & {
  tenant: string;
  name: string;
  navItems?: Array<{
    link: {
      type?: 'reference' | 'custom' | null;
      label: string;
      url?: string | null;
      newTab?: boolean | null;
      reference?: {
        relationTo: 'pages';
        value: string | Page;
      } | null;
    };
    id?: string | null;
  }> | null;
};

// Type to help with creating Footers in collections
type FooterData = Omit<Footer, 'id' | 'createdAt' | 'updatedAt'> & {
  tenant: string;
  name: string;
  navItems?: Array<{
    link: {
      type?: 'reference' | 'custom' | null;
      label: string;
      url?: string | null;
      newTab?: boolean | null;
      reference?: {
        relationTo: 'pages';
        value: string | Page;
      } | null;
    };
    id?: string | null;
  }> | null;
};

// Create categories for a tenant
export async function createCategories(payload: Payload, tenantId: string) {
  const categoryTitles = [
    'Technology',
    'News',
    'Finance',
    'Design',
    'Software',
    'Engineering'
  ]
  
  const categoryDocs = []
  for (const categoryTitle of categoryTitles) {
    const category = await payload.create({
      collection: 'categories',
      data: {
        title: categoryTitle,
        tenant: tenantId,
      },
    })
    categoryDocs.push(category)
  }

  return categoryDocs
}

// Create header for a tenant
export async function createHeader(payload: Payload, tenantId: string) {
  // Create header as collection item, not global
  const headerData: HeaderData = {
    name: 'Main Header',  // Required field for headers collection
    tenant: tenantId,
    navItems: [
      {
        link: {
          type: 'custom',
          label: 'Home',
          url: '/',
        },
      },
      {
        link: {
          type: 'custom',
          label: 'About',
          url: '/about',
        },
      },
      {
        link: {
          type: 'custom',
          label: 'Posts',
          url: '/posts',
        },
      },
    ]
  };
  
  return await payload.create({
    collection: 'headers',
    data: headerData
  })
}

// Create footer for a tenant
export async function createFooter(payload: Payload, tenantId: string, tierName: string) {
  // Create footer as collection item, not global
  const footerData: FooterData = {
    name: 'Main Footer',  // Required field for footers collection
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
          label: tierName ? `${tierName} Tier` : 'Default Tier',
          url: '#',
        },
      },
      {
        link: {
          type: 'custom',
          label: 'Documentation',
          url: 'https://payloadcms.com/docs',
          newTab: true,
        },
      },
    ]
  };
  
  return await payload.create({
    collection: 'footers',
    data: footerData
  })
}
