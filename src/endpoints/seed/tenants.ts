import type { File } from 'payload'

// Define tenant data structure
export type TenantData = {
  name: string
  slug: string
  domain: string
  tier: 'gold' | 'silver' | 'bronze'
  allowPublicRead: boolean
  isActive: boolean
}

// Define each tenant's data
export const tenants: TenantData[] = [
  {
    name: 'Gold Tenant',
    slug: 'gold',
    domain: 'gold.localhost:3000',
    tier: 'gold',
    allowPublicRead: true,
    isActive: true,
  },
  {
    name: 'Silver Tenant',
    slug: 'silver',
    domain: 'silver.localhost:3000',
    tier: 'silver',
    allowPublicRead: true,
    isActive: true,
  },
  {
    name: 'Bronze Tenant',
    slug: 'bronze',
    domain: 'bronze.localhost:3000',
    tier: 'bronze',
    allowPublicRead: true,
    isActive: true,
  },
]

// Helper function to create tier-specific content
export const getTierSpecificContent = (tier: 'gold' | 'silver' | 'bronze', tenantName: string) => {
  const tierName = tier.charAt(0).toUpperCase() + tier.slice(1)
  
  return {
    tierName,
    welcomeMessage: `Welcome to ${tenantName}`,
    tierDescription: `This is the ${tier} tier experience.`,
    featureTitle: `${tierName} Features`,
    featureDescription: `Enjoy all the features available in the ${tier} tier.`,
    aboutTitle: `About ${tenantName}`,
    aboutDescription: `Learn about our ${tier} tier services.`,
    storyTitle: `Our ${tierName} Tier Story`,
    storyDescription: `Learn more about our ${tier} tier services and offerings.`,
    postTitles: [
      `${tierName} Tier Announcement`,
      `${tierName} Feature Spotlight`,
    ],
    postDescriptions: [
      `Read about our latest ${tier} tier announcement`,
      `Discover the best features of our ${tier} tier`,
    ],
  }
}
