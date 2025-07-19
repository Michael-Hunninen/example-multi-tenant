import { NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getTenantFromRequest } from '@/utilities/getTenantFromRequest'

export async function GET(request: Request) {
  try {
    console.log('=== TENANT-AWARE BRANDING API ===')
    
    // Get URL parameters (for direct document access)
    const url = new URL(request.url);
    const directBrandingId = url.searchParams.get('brandingId');
    const forceTenantId = url.searchParams.get('tenantId');
    
    // Get current tenant from request (domain/cookie) if not directly specified
    const tenantId = forceTenantId || await getTenantFromRequest();
    console.log('Current tenant ID:', tenantId);
    console.log('Direct branding ID override:', directBrandingId || 'none');
    
    const payload = await getPayload({ config: configPromise })
    
    // Access MongoDB directly for reliable data retrieval
    try {
      // @ts-ignore - Access internal MongoDB connection
      const db = payload.db.connection.db
      if (!db) {
        throw new Error('Database connection not available')
      }
      
      console.log('Fetching branding document for tenant:', tenantId)
      
      // MONGODB DEBUG - Show all branding docs to understand structure
      console.log('\n===== DEBUG: ALL BRANDING DOCS IN MONGODB =====');
      const allBrandingDocs = await db.collection('_branding_').find({}).toArray();
      console.log(`Found ${allBrandingDocs.length} branding documents:`);
      
      allBrandingDocs.forEach((doc, i) => {
        console.log(`\nDoc #${i+1} ID: ${doc._id}`);
        console.log('Name:', doc.name);
        console.log('Fields:', Object.keys(doc).join(', '));
        
        // Check all possible tenant field variations
        if (doc.tenant) console.log('tenant field:', JSON.stringify(doc.tenant));
        if (doc._tenant) console.log('_tenant field:', JSON.stringify(doc._tenant));
        if (doc.tenantId) console.log('tenantId field:', JSON.stringify(doc.tenantId));
      });
      
      // Direct document lookup if brandingId is provided
      if (directBrandingId) {
        console.log('\n===== DIRECT BRANDING DOCUMENT LOOKUP =====');
        console.log('Looking for branding document with ID:', directBrandingId);
        
        try {
          // Create ObjectId from string ID
          // @ts-ignore - MongoDB direct access
          const ObjectId = payload.db.connection.db.collection('').constructor.ObjectID;
          const brandingObjectId = new ObjectId(directBrandingId);
          
          const directBrandingDoc = await db.collection('_branding_').findOne({ 
            _id: brandingObjectId 
          });
          
          if (directBrandingDoc) {
            console.log('Found direct branding document by ID!');
            
            // Use this as our final branding document
            console.log('Using direct branding document, skipping tenant lookup');
            
            // Process and return this document directly
            // Helper function to resolve media URL
            const resolveMediaUrl = async (mediaId: any) => {
              // ... media resolution logic ...
              if (!mediaId) return null;
              try {
                const mediaDoc = await db.collection('media').findOne({ _id: mediaId });
                if (mediaDoc && mediaDoc.filename) {
                  return {
                    url: `${baseUrl}/media/${mediaDoc.filename}`,
                    id: mediaId.toString(),
                    filename: mediaDoc.filename,
                    mimeType: mediaDoc.mimeType,
                    filesize: mediaDoc.filesize,
                    width: mediaDoc.width,
                    height: mediaDoc.height
                  };
                }
              } catch (error) {
                console.error('Error resolving media:', error);
              }
              return null;
            };
            
            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
            
            const result = {
              id: directBrandingDoc._id?.toString(),
              tenantId: tenantId,
              name: directBrandingDoc.name || 'Multi-Tenant Platform',
              logo: await resolveMediaUrl(directBrandingDoc.logo),
              icon: await resolveMediaUrl(directBrandingDoc.icon),
              favicon: await resolveMediaUrl(directBrandingDoc.favicon),
              ogImage: await resolveMediaUrl(directBrandingDoc.ogImage),
              titleSuffix: directBrandingDoc.titleSuffix || '- Multi-Tenant Platform',
              metaDescription: directBrandingDoc.metaDescription || 'Multi-Tenant SaaS Platform',
              ogDescription: directBrandingDoc.ogDescription || 'Enterprise Multi-Tenant SaaS Platform',
              ogTitle: directBrandingDoc.ogTitle || 'Multi-Tenant Dashboard',
              primaryColor: directBrandingDoc.primaryColor || '#0C0C0C',
              accentColor: directBrandingDoc.accentColor || '#2D81FF',
            };
            
            console.log('Returning direct branding document result');
            return NextResponse.json(result);
          } else {
            console.log('Direct branding document not found, continuing with tenant lookup');
          }
        } catch (err) {
          console.error('Error in direct branding document lookup:', err);
        }
      }
      
      // DYNAMIC TENANT-SPECIFIC BRANDING LOOKUP
      console.log('\n===== DYNAMIC TENANT BRANDING LOOKUP =====');
      
      // The tenant ID is correct but lookup is failing, try direct collection scan
      console.log('Looking for any document with tenant = ' + tenantId);
      
      try {
        // Get all branding docs and find one matching the current tenant ID
        const allDocs = await db.collection('_branding_').find({}).toArray();
        
        // Debug info about all docs
        console.log(`Found ${allDocs.length} total branding documents`);
        allDocs.forEach((doc, index) => {
          console.log(`Doc ${index}: ID=${doc._id}, Name=${doc.name}, Tenant=${doc.tenant}`);
        });
        
        // Find document matching the current tenant ID - dynamic, not hard-coded
        console.log('\n=== DETAILED COMPARISON DEBUG ===');
        console.log('Looking for tenant ID:', tenantId);
        console.log('Tenant ID type:', typeof tenantId);
        
        allDocs.forEach((doc, index) => {
          console.log(`\nDoc ${index} comparison:`);
          console.log('  doc.tenant:', doc.tenant);
          console.log('  doc.tenant type:', typeof doc.tenant);
          console.log('  tenantId:', tenantId);
          console.log('  tenantId type:', typeof tenantId);
          console.log('  Strict equality (===):', doc.tenant === tenantId);
          console.log('  Loose equality (==):', doc.tenant == tenantId);
          console.log('  String comparison:', String(doc.tenant) === String(tenantId));
        });
        
        const matchingDoc = allDocs.find(doc => {
          const match = doc.tenant && (doc.tenant === tenantId || String(doc.tenant) === String(tenantId));
          console.log(`\nTesting doc ${doc.name}: tenant=${doc.tenant}, match=${match}`);
          return match;
        });
        
        if (matchingDoc) {
          console.log('FOUND MATCHING DOCUMENT BY MANUAL SCAN!');
          console.log('Document ID:', matchingDoc._id);
          console.log('Document name:', matchingDoc.name);
          console.log('Tenant field:', matchingDoc.tenant);
          
          // TEMPORARY FIX - USE THIS DOCUMENT AS THE BRANDING FOR THIS REQUEST
          console.log('\n*** USING DIRECT DOCUMENT MATCH FOR TENANT BRANDING ***\n');
          
          // Process and return this document directly
          const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
          
          // Helper function to resolve media URL (simplified version)
          const resolveMediaUrl = async (mediaId: string | any) => {
            if (!mediaId) return null;
            try {
              // Use string ID for media lookup
              const mediaDoc = await db.collection('media').findOne({ 
                $or: [
                  { _id: mediaId },
                  { _id: mediaId.toString() }
                ]
              });
              if (mediaDoc && mediaDoc.filename) {
                return {
                  url: `${baseUrl}/media/${mediaDoc.filename}`,
                  id: mediaId.toString(),
                  filename: mediaDoc.filename,
                  mimeType: mediaDoc.mimeType,
                  filesize: mediaDoc.filesize,
                  width: mediaDoc.width,
                  height: mediaDoc.height
                };
              }
            } catch (error) {
              console.error('Error resolving media:', error);
            }
            return null;
          };
          
          const result = {
            id: matchingDoc._id?.toString(),
            tenantId: tenantId,
            name: matchingDoc.name || 'Bronze Tenant',
            logo: await resolveMediaUrl(matchingDoc.logo),
            icon: await resolveMediaUrl(matchingDoc.icon),
            favicon: await resolveMediaUrl(matchingDoc.favicon),
            ogImage: await resolveMediaUrl(matchingDoc.ogImage),
            titleSuffix: matchingDoc.titleSuffix || '- Bronze Tenant',
            metaDescription: matchingDoc.metaDescription || 'Bronze Tenant Site',
            ogDescription: matchingDoc.ogDescription || 'Bronze Tenant Description',
            ogTitle: matchingDoc.ogTitle || 'Bronze Tenant',
            primaryColor: matchingDoc.primaryColor || '#0C0C0C',
            accentColor: matchingDoc.accentColor || '#2D81FF',
          };
          
          console.log('Returning direct document match result');
          return NextResponse.json(result);
        } else {
          console.log('NO DIRECT DOCUMENT MATCH FOUND - continuing with regular lookup');
        }
      } catch (err) {
        console.error('Error in direct database lookup:', err);
      }
      
      // Simple string-based query (fallback)
      console.log('Fallback to simple string query');
      let query: any = {};
      if (tenantId) {
        query = {
          $or: [
            { tenant: tenantId },
            { '_tenant': tenantId },
            { 'tenantId': tenantId }
          ]
        };
      }
      
      console.log('Using enhanced tenant query:', JSON.stringify(query, null, 2));
      const brandingDoc = await db.collection('_branding_').findOne(query, { 
        sort: { updatedAt: -1 } 
      })
      
      console.log('Query result:', brandingDoc ? 'Found matching doc' : 'No matching doc');
      if (brandingDoc) {
        console.log('Matched doc ID:', brandingDoc._id, 'Name:', brandingDoc.name);
      }
      
      // If no tenant-specific branding found, try to get default branding
      let fallbackDoc = null
      if (!brandingDoc && tenantId) {
        console.log('No tenant-specific branding found, looking for default...')
        fallbackDoc = await db.collection('_branding_').findOne({}, { 
          sort: { updatedAt: -1 } 
        })
      }
      
      const finalDoc = brandingDoc || fallbackDoc
      
      if (finalDoc) {
        console.log('Found branding document:', brandingDoc ? 'tenant-specific' : 'default fallback')
        
        // Resolve media URLs by fetching actual media documents
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        
        // Helper function to resolve media URL
        const resolveMediaUrl = async (mediaId: any) => {
          if (!mediaId) return null
          try {
            const mediaDoc = await db.collection('media').findOne({ _id: mediaId })
            if (mediaDoc && mediaDoc.filename) {
              return {
                url: `${baseUrl}/media/${mediaDoc.filename}`,
                id: mediaId.toString(),
                filename: mediaDoc.filename,
                mimeType: mediaDoc.mimeType,
                filesize: mediaDoc.filesize,
                width: mediaDoc.width,
                height: mediaDoc.height
              }
            }
          } catch (error) {
            console.error('Error resolving media:', error)
          }
          return null
        }
        
        const result = {
          id: finalDoc._id?.toString(),
          tenantId: tenantId,
          name: finalDoc.name || 'Multi-Tenant Platform',
          logo: await resolveMediaUrl(finalDoc.logo),
          icon: await resolveMediaUrl(finalDoc.icon),
          favicon: await resolveMediaUrl(finalDoc.favicon),
          ogImage: await resolveMediaUrl(finalDoc.ogImage),
          titleSuffix: finalDoc.titleSuffix || '- Multi-Tenant Platform',
          metaDescription: finalDoc.metaDescription || 'Multi-Tenant SaaS Platform',
          ogDescription: finalDoc.ogDescription || 'Enterprise Multi-Tenant SaaS Platform',
          ogTitle: finalDoc.ogTitle || 'Multi-Tenant Dashboard',
          primaryColor: finalDoc.primaryColor || '#0C0C0C',
          accentColor: finalDoc.accentColor || '#2D81FF',
        }
        
        console.log('Returning branding:', result)
        return NextResponse.json(result)
      }
      
    } catch (dbError) {
      console.error('Database access failed:', dbError)
    }
    
    console.log('No branding found, returning defaults for tenant:', tenantId)
    return NextResponse.json({
      tenantId: tenantId,
      name: 'Multi-Tenant Platform',
      logo: null,
      icon: null,
      favicon: null,
      ogImage: null,
      titleSuffix: '- Multi-Tenant Platform',
      metaDescription: 'Multi-Tenant SaaS Platform',
      ogDescription: 'Enterprise Multi-Tenant SaaS Platform',
      ogTitle: 'Multi-Tenant Dashboard',
      primaryColor: '#0C0C0C',
      accentColor: '#2D81FF',
    })
    
  } catch (error) {
    console.error('Error in simple branding API:', error)
    return NextResponse.json({ error: 'Failed to fetch branding' }, { status: 500 })
  }
}
