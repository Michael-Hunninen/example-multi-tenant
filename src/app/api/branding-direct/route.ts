import { NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET() {
  try {
    console.log('=== DIRECT BRANDING API ===')
    
    const payload = await getPayload({ config: configPromise })
    
    // Access the MongoDB collection directly to bypass multi-tenant filtering
    try {
      // @ts-ignore - Access internal MongoDB connection
      const db = payload.db.connection.db
      if (!db) {
        throw new Error('Database connection not available')
      }
      const collection = db.collection('_branding_')
      
      console.log('Accessing MongoDB collection directly...')
      
      // Find any branding document
      const brandingDoc = await collection.findOne({}, { 
        sort: { updatedAt: -1 } 
      })
      
      console.log('Direct MongoDB result:', brandingDoc)
      
      if (brandingDoc) {
        // Helper function to resolve media URLs
        const resolveMediaUrl = async (mediaId: any) => {
          if (!mediaId) return null
          try {
            const mediaDoc = await db.collection('media').findOne({ _id: mediaId })
            if (mediaDoc && mediaDoc.url) {
              return {
                url: mediaDoc.url,
                filename: mediaDoc.filename,
                mimeType: mediaDoc.mimeType,
                filesize: mediaDoc.filesize,
                width: mediaDoc.width,
                height: mediaDoc.height,
              }
            }
          } catch (error) {
            console.error('Error resolving media URL:', error)
          }
          return null
        }

        // Resolve all media references
        const [logo, icon, favicon, ogImage] = await Promise.all([
          resolveMediaUrl(brandingDoc.logo),
          resolveMediaUrl(brandingDoc.icon),
          resolveMediaUrl(brandingDoc.favicon),
          resolveMediaUrl(brandingDoc.ogImage),
        ])

        // Transform the document to match our expected format
        const result = {
          id: brandingDoc._id?.toString(),
          name: brandingDoc.name || 'Multi-Tenant Platform',
          logo,
          icon,
          favicon,
          ogImage,
          titleSuffix: brandingDoc.titleSuffix || '- Multi-Tenant Platform',
          metaDescription: brandingDoc.metaDescription || 'Multi-Tenant SaaS Platform',
          ogDescription: brandingDoc.ogDescription || 'Enterprise Multi-Tenant SaaS Platform',
          ogTitle: brandingDoc.ogTitle || 'Multi-Tenant Dashboard',
          primaryColor: brandingDoc.primaryColor || '#0C0C0C',
          accentColor: brandingDoc.accentColor || '#2D81FF',
        }
        
        console.log('Returning custom branding:', result)
        return NextResponse.json(result)
      }
      
    } catch (dbError) {
      console.error('Direct MongoDB access failed:', dbError)
    }
    
    console.log('No branding found, returning defaults')
    // Return default branding if none exists
    return NextResponse.json({
      name: 'Multi-Tenant Platform',
      titleSuffix: '- Multi-Tenant Platform',
      metaDescription: 'Multi-Tenant SaaS Platform',
      ogDescription: 'Enterprise Multi-Tenant SaaS Platform',
      ogTitle: 'Multi-Tenant Dashboard',
      primaryColor: '#0C0C0C',
      accentColor: '#2D81FF',
    })
    
  } catch (error) {
    console.error('Error in direct branding API:', error)
    return NextResponse.json({ error: 'Failed to fetch branding' }, { status: 500 })
  }
}
