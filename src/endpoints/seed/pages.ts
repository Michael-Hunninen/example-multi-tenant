import { Payload } from 'payload'
import { heroRichText, contentRichText } from './rich-text'

// Create homepage for a tenant
export async function createHomepage(
  payload: Payload,
  tenantId: string,
  tenantName: string,
  heroImageId: string,
  contentImageId: string,
  tierSpecificContent: any,
) {
  const { welcomeMessage, tierDescription, featureTitle, featureDescription } = tierSpecificContent

  return await payload.create({
    collection: 'pages',
    data: {
      title: `${tenantName} Homepage`,
      slug: 'home',
      tenant: tenantId,
      hero: {
        type: 'highImpact',
        media: heroImageId,
        richText: heroRichText(welcomeMessage, tierDescription),
      },
      layout: [
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: contentRichText(featureTitle, featureDescription),
            },
          ],
        },
      ],
      meta: {
        title: `${tenantName} | Homepage`,
        description: `Welcome to the ${tierSpecificContent.tierName.toLowerCase()} tier tenant homepage.`,
        image: contentImageId,
      }
    } as any, // Type assertion for the entire data object
  })
}

// Create about page for a tenant
export async function createAboutPage(
  payload: Payload,
  tenantId: string,
  tenantName: string,
  heroImageId: string,
  contentImageId: string,
  tierSpecificContent: any,
) {
  const { aboutTitle, aboutDescription, storyTitle, storyDescription } = tierSpecificContent

  return await payload.create({
    collection: 'pages',
    data: {
      title: `About ${tenantName}`,
      slug: 'about',
      tenant: tenantId,
      hero: {
        type: 'lowImpact',
        media: heroImageId,
        richText: heroRichText(aboutTitle, aboutDescription),
      },
      layout: [
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: contentRichText(storyTitle, storyDescription),
            },
          ],
        },
      ],
      meta: {
        title: `About ${tenantName}`,
        description: `Learn about our ${tierSpecificContent.tierName.toLowerCase()} tier services`,
        image: contentImageId,
      },
    } as any, // Type assertion for the entire data object
  })
}
