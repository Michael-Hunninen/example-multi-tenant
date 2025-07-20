import { Payload } from 'payload'
import { tenants, getTierSpecificContent } from './tenants'

interface NavLink {
  label: string
  url: string
}

// Define header links for each tenant tier
const getHeaderLinks = (tier: 'gold' | 'silver' | 'bronze'): NavLink[] => {
  const common = [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
  ]

  // Tier-specific header links
  switch (tier) {
    case 'gold':
      return [
        ...common,
        { label: 'Premium', url: '/premium' },
        { label: 'Gold Benefits', url: '/gold-benefits' },
        { label: 'Contact', url: '/contact' }
      ]
    case 'silver':
      return [
        ...common,
        { label: 'Features', url: '/features' },
        { label: 'Support', url: '/support' }
      ]
    case 'bronze':
      return [
        ...common,
        { label: 'Resources', url: '/resources' }
      ]
    default:
      return common
  }
}

// Define footer links for each tenant tier
const getFooterLinks = (tier: 'gold' | 'silver' | 'bronze'): NavLink[] => {
  const common = [
    { label: 'Privacy', url: '/privacy' },
    { label: 'Terms', url: '/terms' },
  ]

  // Tier-specific footer links
  switch (tier) {
    case 'gold':
      return [
        ...common,
        { label: 'Support', url: '/support' },
        { label: 'FAQ', url: '/faq' },
        { label: 'Contact', url: '/contact' }
      ]
    case 'silver':
      return [
        ...common,
        { label: 'FAQ', url: '/faq' },
        { label: 'Contact', url: '/contact' }
      ]
    case 'bronze':
      return [
        ...common,
        { label: 'Contact', url: '/contact' }
      ]
    default:
      return common
  }
}

// Create tenant-specific header
const createTenantHeader = async (payload: Payload, tenantId: string, tenantData: any) => {
  console.log(`Creating header for tenant: ${tenantData.name} (${tenantId})`)
  
  // Get tier-specific header navigation
  const headerLinks = getHeaderLinks(tenantData.tier)
  
  try {
    // Check if header exists for this tenant
    const existingHeaders = await payload.find({
      collection: 'headers',
      where: {
        tenant: { equals: tenantId }
      }
    })
    
    const navItems = headerLinks.map(link => ({
      link: {
        type: 'custom' as const,
        url: link.url,
        label: link.label
      }
    }))
    
    if (existingHeaders.docs.length > 0) {
      console.log(`Updating existing header for tenant ${tenantData.name}`)
      await payload.update({
        collection: 'headers',
        id: existingHeaders.docs[0].id,
        data: {
          name: `${tenantData.name} Header`,
          navItems: navItems,
          tenant: tenantId
        }
      })
    } else {
      console.log(`Creating new header for tenant ${tenantData.name}`)
      await payload.create({
        collection: 'headers',
        data: {
          name: `${tenantData.name} Header`,
          navItems: navItems,
          tenant: tenantId
        }
      })
    }
    
    console.log(`Header created/updated for tenant: ${tenantData.name}`)
    return true
  } catch (error) {
    console.error(`Failed to create/update header for tenant ${tenantData.name}:`, error)
    return false
  }
}

// Create tenant-specific footer
const createTenantFooter = async (payload: Payload, tenantId: string, tenantData: any) => {
  console.log(`Creating footer for tenant: ${tenantData.name} (${tenantId})`)
  
  // Get tier-specific footer navigation
  const footerLinks = getFooterLinks(tenantData.tier)
  
  try {
    // Check if footer exists for this tenant
    const existingFooters = await payload.find({
      collection: 'footers',
      where: {
        tenant: { equals: tenantId }
      }
    })
    
    const navItems = footerLinks.map(link => ({
      link: {
        type: 'custom' as const,
        url: link.url,
        label: link.label
      }
    }))
    
    if (existingFooters.docs.length > 0) {
      console.log(`Updating existing footer for tenant ${tenantData.name}`)
      await payload.update({
        collection: 'footers',
        id: existingFooters.docs[0].id,
        data: {
          name: `${tenantData.name} Footer`,
          navItems: navItems,
          tenant: tenantId
        }
      })
    } else {
      console.log(`Creating new footer for tenant ${tenantData.name}`)
      await payload.create({
        collection: 'footers',
        data: {
          name: `${tenantData.name} Footer`,
          navItems: navItems,
          tenant: tenantId
        }
      })
    }
    
    console.log(`Footer created/updated for tenant: ${tenantData.name}`)
    return true
  } catch (error) {
    console.error(`Failed to create/update footer for tenant ${tenantData.name}:`, error)
    return false
  }
}

// Create tenant-specific branding
const createTenantBranding = async (payload: Payload, tenantId: string, tenantData: any) => {
  console.log(`Creating branding for tenant: ${tenantData.name} (${tenantId})`)
  
  // Get tier-specific content
  const content = getTierSpecificContent(tenantData.tier, tenantData.name)
  
  // Get tier-specific navigation links
  const headerLinks = getHeaderLinks(tenantData.tier)
  const footerLinks = getFooterLinks(tenantData.tier)
  
  // Define tier-specific colors
  let primaryColor, accentColor, headerBgColor, footerBgColor
  
  switch (tenantData.tier) {
    case 'gold':
      primaryColor = '#D4AF37'  // Gold
      accentColor = '#FFD700'   // Bright gold
      headerBgColor = '#FFFFFF' // White
      footerBgColor = '#2A2A2A' // Dark gray
      break
    case 'silver':
      primaryColor = '#C0C0C0'  // Silver
      accentColor = '#A9A9A9'   // Dark silver
      headerBgColor = '#F0F0F0' // Light gray
      footerBgColor = '#333333' // Dark gray
      break
    case 'bronze':
      primaryColor = '#CD7F32'  // Bronze
      accentColor = '#B87333'   // Dark bronze
      headerBgColor = '#F5F5DC' // Beige
      footerBgColor = '#3D3D3D' // Dark gray
      break
    default:
      primaryColor = '#0C0C0C'  // Black
      accentColor = '#2D81FF'   // Blue
      headerBgColor = '#FFFFFF' // White
      footerBgColor = '#000000' // Black
  }
  
  try {
    // Try to find existing branding for tenant
    const existingBranding = await payload.find({
      collection: '_branding_' as any,
      where: {
        tenant: { equals: tenantId }
      }
    })
    
    // If branding exists, update it
    if (existingBranding.docs.length > 0) {
      console.log(`Updating existing branding for tenant ${tenantData.name}`)
      await payload.update({
        collection: '_branding_' as any,
        id: existingBranding.docs[0].id,
        data: {
          // Keep existing values for uploads/media
          name: tenantData.name,
          titleSuffix: ` - ${tenantData.name}`,
          metaDescription: `${content.tierDescription}`,
          ogDescription: `${content.tierDescription}`,
          ogTitle: `${tenantData.name} - ${content.tierName} Tier Platform`,
          primaryColor: primaryColor,
          accentColor: accentColor,
          headerBackgroundColor: headerBgColor,
          headerTextColor: primaryColor,
          headerLinks: headerLinks,
          footerBackgroundColor: footerBgColor,
          footerTextColor: '#FFFFFF',
          footerLinkColor: '#FFFFFF',
          copyrightText: `© ${new Date().getFullYear()} ${tenantData.name}. All rights reserved.`,
          footerLinks: footerLinks,
          tenant: tenantId // Ensure tenant is correctly assigned
        }
      })
    } else {
      // Otherwise create new branding
      console.log(`Creating new branding for tenant ${tenantData.name}`)
      
      // Create default media assets first
      const logo = await payload.create({
        collection: 'media',
        data: {
          alt: `${tenantData.name} Logo`,
          // Use placeholder images based on tier
          url: `/placeholder-logos/${tenantData.tier}-logo.svg`,
        },
      })
      
      const favicon = await payload.create({
        collection: 'media',
        data: {
          alt: `${tenantData.name} Favicon`,
          url: `/placeholder-logos/${tenantData.tier}-favicon.ico`,
        },
      })
      
      const icon = await payload.create({
        collection: 'media',
        data: {
          alt: `${tenantData.name} Icon`,
          url: `/placeholder-logos/${tenantData.tier}-icon.svg`,
        },
      })
      
      const ogImage = await payload.create({
        collection: 'media',
        data: {
          alt: `${tenantData.name} OG Image`,
          url: `/placeholder-logos/${tenantData.tier}-og.png`,
        },
      })
      
      // Create branding document with tenant association
      await payload.create({
        collection: '_branding_' as any,
        data: {
          name: tenantData.name,
          logo: logo.id,
          icon: icon.id,
          favicon: favicon.id,
          ogImage: ogImage.id,
          titleSuffix: ` - ${tenantData.name}`,
          metaDescription: `${content.tierDescription}`,
          ogDescription: `${content.tierDescription}`,
          ogTitle: `${tenantData.name} - ${content.tierName} Tier Platform`,
          primaryColor: primaryColor,
          accentColor: accentColor,
          headerBackgroundColor: headerBgColor,
          headerTextColor: primaryColor,
          headerLinks: headerLinks,
          footerBackgroundColor: footerBgColor,
          footerTextColor: '#FFFFFF',
          footerLinkColor: '#FFFFFF',
          copyrightText: `© ${new Date().getFullYear()} ${tenantData.name}. All rights reserved.`,
          footerLinks: footerLinks,
          tenant: tenantId // Ensure tenant is correctly assigned
        }
      })
    }
    
    console.log(`Branding created/updated for tenant: ${tenantData.name}`)
    return true
  } catch (error) {
    console.error(`Failed to create/update branding for tenant ${tenantData.name}:`, error)
    return false
  }
}

// Main seed function for multi-tenant setup
export const seedMultiTenantSetup = async (payload: Payload) => {
  console.log('Starting multi-tenant setup seeding...')
  
  try {
    // First, find existing tenants in the database
    const existingTenants = await payload.find({
      collection: 'tenants',
      limit: 100
    })
    
    // Process each tenant from our config
    for (const tenantData of tenants) {
      console.log(`Processing tenant: ${tenantData.name}`)
      
      // Find if tenant exists
      const existingTenant = existingTenants.docs.find(t => t.slug === tenantData.slug)
      
      let tenantId: string
      
      if (existingTenant) {
        console.log(`Tenant ${tenantData.name} already exists, updating...`)
        // Update existing tenant
        const updatedTenant = await payload.update({
          collection: 'tenants',
          id: existingTenant.id,
          data: {
            name: tenantData.name,
            slug: tenantData.slug,
            tier: tenantData.tier,
            allowPublicRead: tenantData.allowPublicRead,
            isActive: tenantData.isActive
          }
        })
        tenantId = typeof updatedTenant === 'object' && 'id' in updatedTenant ? updatedTenant.id : existingTenant.id
      } else {
        console.log(`Creating new tenant: ${tenantData.name}`)
        // Create new tenant
        const newTenant = await payload.create({
          collection: 'tenants',
          data: {
            name: tenantData.name,
            slug: tenantData.slug,
            tier: tenantData.tier,
            allowPublicRead: tenantData.allowPublicRead,
            isActive: tenantData.isActive
          }
        })
        tenantId = (newTenant as any).id
      }
      
      // Now create/update branding, header, and footer for this tenant
      await createTenantBranding(payload, tenantId, tenantData)
      await createTenantHeader(payload, tenantId, tenantData)
      await createTenantFooter(payload, tenantId, tenantData)
      
      // Create a domain mapping for the tenant
      try {
        // Check if domain mapping exists
        const existingDomains = await payload.find({
          collection: 'domains',
          where: {
            domain: { equals: tenantData.domain }
          }
        })
        
        if (existingDomains.docs.length === 0) {
          console.log(`Creating domain mapping for ${tenantData.domain}`)
          await payload.create({
            collection: 'domains',
            data: {
              domain: tenantData.domain,
              tenant: tenantId,
              isActive: true
            }
          })
        } else {
          console.log(`Domain mapping for ${tenantData.domain} already exists`)
          // Update the mapping
          await payload.update({
            collection: 'domains',
            id: existingDomains.docs[0].id,
            data: {
              tenant: tenantId,
              isActive: true
            }
          })
        }
      } catch (err) {
        console.error(`Error creating domain mapping for ${tenantData.domain}:`, err)
      }
    }
    
    console.log('Multi-tenant setup seeding completed successfully!')
    return true
  } catch (error) {
    console.error('Multi-tenant setup seeding failed:', error)
    throw error
  }
}
