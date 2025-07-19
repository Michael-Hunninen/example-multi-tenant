import { Payload } from 'payload'

export type BrandingSettings = {
  id?: string
  name: string
  logo: {
    url: string
    filename: string
    mimeType: string
    filesize: number
    width: number
    height: number
  }
  icon: {
    url: string
    filename: string
    mimeType: string
    filesize: number
    width: number
    height: number
  }
  favicon: {
    url: string
    filename: string
    mimeType: string
    filesize: number
    width: number
    height: number
  }
  ogImage: {
    url: string
    filename: string
    mimeType: string
    filesize: number
    width: number
    height: number
  }
  titleSuffix: string
  metaDescription: string
  ogDescription: string
  ogTitle: string
  primaryColor: string
  accentColor: string
}

export const getGlobalBranding = async (
  payload: Payload
): Promise<BrandingSettings | null> => {
  try {
    // First, try to find the agency owner tenant
    let agencyOwnerTenantId: string | null = null;
    
    try {
      console.log('Looking for agency owner tenant...')
      const tenantResult = await payload.find({
        collection: 'tenants',
        limit: 1,
        where: {
          isAgencyOwner: { equals: true }
        }
      })

      if (tenantResult?.docs?.length > 0) {
        agencyOwnerTenantId = tenantResult.docs[0].id;
        console.log(`Found agency owner tenant: ${agencyOwnerTenantId}`)
      } else {
        console.log('No agency owner tenant found')
      }
    } catch (err: any) {
      console.error('Error finding agency owner tenant:', err?.message || String(err))
    }

    // If we found the agency owner tenant, try to get its branding
    if (agencyOwnerTenantId) {
      try {
        // Try to find branding for the agency owner tenant
        const agencyBrandingResult = await payload.find({
          collection: '_branding_' as any,
          limit: 1,
          depth: 2,
          where: {
            tenant: { equals: agencyOwnerTenantId }
          }
        })

        if (agencyBrandingResult?.docs?.length > 0) {
          console.log('Found agency owner branding document')
          return agencyBrandingResult.docs[0] as unknown as BrandingSettings
        }
      } catch (err: any) {
        console.error('Failed to fetch agency owner branding:', err?.message || String(err))
      }

      // Try alternative field formats for agency owner tenant
      try {
        const agencyBrandingResult = await payload.find({
          collection: '_branding_' as any,
          limit: 1,
          depth: 2,
          where: {
            _tenant: { equals: agencyOwnerTenantId }
          } as any
        })

        if (agencyBrandingResult?.docs?.length > 0) {
          console.log('Found agency owner branding with _tenant field')
          return agencyBrandingResult.docs[0] as unknown as BrandingSettings
        }
      } catch (err) {
        // Continue to next attempt
      }
    }
    
    // Fallback to any branding document if we can't find the agency owner's
    try {
      console.log('Falling back to any available branding document')
      const brandingResult = await payload.find({
        collection: '_branding_' as any,
        limit: 1,
        depth: 2,
        sort: '-updatedAt', // Get the most recently updated one
      })

      if (brandingResult?.docs?.length > 0) {
        console.log('Found fallback branding document')
        return brandingResult.docs[0] as unknown as BrandingSettings
      }
    } catch (err: any) {
      console.error('Failed to fetch any branding document:', err?.message || String(err))
    }
    
    // Try direct database access as last resort
    try {
      console.log('Attempting direct DB access for default branding')
      // @ts-ignore - Accessing internal MongoDB connection
      const db = payload.db.connection
      if (db) {
        const doc = await db.collection('_branding_').findOne({})
        if (doc) {
          console.log('Found branding document via direct DB access')
          return doc as unknown as BrandingSettings
        }
        
        // Try alternative collection name
        const altDoc = await db.collection('branding').findOne({})
        if (altDoc) {
          console.log('Found branding document via direct DB access in alternate collection')
          return altDoc as unknown as BrandingSettings
        }
      }
    } catch (dbErr: any) {
      console.error('Direct DB access failed:', dbErr?.message || dbErr)
    }
    
    console.log('No branding document found at all')
    return null
  } catch (error: any) {
    console.error('Error fetching branding settings:', error?.message || String(error))
    return null
  }
}

export const getBrandingByTenantId = async (
  payload: Payload,
  tenantId: string
): Promise<BrandingSettings | null> => {
  try {
    // DIRECT DATABASE DEBUG - Print all branding documents
    try {
      console.log('\n======= DIRECT MONGODB DEBUGGING =======')
      // @ts-ignore - Accessing internal MongoDB connection
      const db = payload.db.connection
      if (db) {
        console.log(`Tenant ID we're looking for: ${tenantId}`)
        
        // Get ALL branding documents to see what's available
        const allBranding = await db.collection('_branding_').find({}).toArray()
        console.log(`Found ${allBranding.length} raw branding documents in MongoDB:`)
        
        allBranding.forEach((doc, idx) => {
          console.log(`\nDocument #${idx + 1}:`)
          console.log(`_id: ${doc._id}`)
          console.log(`name: ${doc.name || 'unnamed'}`)
          
          // Print all field keys
          console.log('Fields:', Object.keys(doc).join(', '))
          
          // Look specifically for tenant-related fields
          if (doc.tenant) console.log(`tenant field: ${JSON.stringify(doc.tenant)}`)
          if (doc._tenant) console.log(`_tenant field: ${JSON.stringify(doc._tenant)}`)
          if (doc.tenantId) console.log(`tenantId field: ${JSON.stringify(doc.tenantId)}`)
        })
        
        // Try to find a document matching our tenant ID directly
        const directMatch = allBranding.find(doc => 
          (doc.tenant && (doc.tenant.toString() === tenantId || 
                        (typeof doc.tenant === 'object' && doc.tenant.id === tenantId))) ||
          (doc._tenant && (doc._tenant.toString() === tenantId || 
                         (typeof doc._tenant === 'object' && doc._tenant.id === tenantId)))
        )
        
        if (directMatch) {
          console.log('\nFOUND DIRECT MATCH in raw MongoDB:')
          console.log(`ID: ${directMatch._id}, Name: ${directMatch.name}`)
        } else {
          console.log('\nNO DIRECT MATCH found in raw MongoDB documents')
        }
      }
    } catch (err) {
      console.log('MongoDB direct debug error:', err)
    }
    console.log('======= END DIRECT MONGODB DEBUGGING =======\n')
    // In multi-tenant plugin with global collections, tenant field is managed by the plugin
    console.log(`=== TENANT-AWARE BRANDING API ===`)
    console.log(`Fetching branding document for tenant: ${tenantId}`)
    
    // COMPREHENSIVE APPROACH: First, let's check if we can get ALL branding documents
    // and filter them manually to find the right tenant document
    try {
      // Get all branding documents (should be a small number)
      const allBranding = await payload.find({
        collection: '_branding_' as any,
        limit: 20,
        depth: 2,
      })

      if (allBranding?.docs?.length > 0) {
        console.log(`Total branding documents found: ${allBranding.docs.length}`)
        
        // Log every branding document's structure for debugging
        allBranding.docs.forEach((doc, idx) => {
          const docObj = doc as any
          console.log(`\nBRANDING DOCUMENT #${idx + 1}:`)
          console.log(`ID: ${docObj.id}`)
          console.log(`Name: ${docObj.name}`)
          console.log(`tenant field: ${JSON.stringify(docObj.tenant)}`)
          console.log(`_tenant field: ${JSON.stringify(docObj._tenant)}`)
          console.log(`tenantId field: ${JSON.stringify(docObj.tenantId)}`)
          
          // Print ALL key-value pairs to find where tenant ID might be stored
          console.log('ALL FIELDS:')
          Object.keys(docObj).forEach(key => {
            const value = docObj[key]
            if (typeof value === 'string') {
              console.log(`  ${key}: ${value}`)
            } else if (value !== null && typeof value === 'object') {
              console.log(`  ${key}: ${JSON.stringify(value).substring(0, 100)}`)
            }
          })
          
          // Check if this document belongs to our tenant using ANY possible field
          const belongsToTenant = (
            // Direct ID match
            docObj.tenant === tenantId ||
            docObj._tenant === tenantId ||
            docObj.tenantId === tenantId ||
            // Object with ID match
            (docObj.tenant && docObj.tenant.id === tenantId) ||
            (docObj._tenant && docObj._tenant.id === tenantId) ||
            (docObj.tenantId && docObj.tenantId.id === tenantId) ||
            // Object with equals
            (docObj.tenant && docObj.tenant.equals === tenantId) ||
            (docObj._tenant && docObj._tenant.equals === tenantId) ||
            // Nested object with ID
            (docObj.tenant && typeof docObj.tenant === 'object' && docObj.tenant._id === tenantId) ||
            (docObj._tenant && typeof docObj._tenant === 'object' && docObj._tenant._id === tenantId) ||
            // Check in raw properties
            Object.keys(docObj).some(key => {
              // Look for any property that contains the tenant ID string
              if (typeof docObj[key] === 'string' && docObj[key] === tenantId) {
                console.log(`Found tenant ID in field: ${key}`)
                return true
              }
              return false
            })
          )
          
          if (belongsToTenant) {
            console.log(`FOUND MATCHING TENANT DOCUMENT! Document #${idx + 1} matches tenant ${tenantId}`)
            console.log(`Returning branding for tenant ${tenantId}`)
            return doc as unknown as BrandingSettings
          }
        })
      }
    } catch (err: any) {
      console.log('Error searching all branding documents:', err?.message || String(err))
    }

    // Try direct database access to check EVERY document
    try {
      console.log('\nATTEMPTING DIRECT DATABASE ACCESS')
      // @ts-ignore - Accessing internal MongoDB connection
      const db = payload.db.connection
      if (db) {
        const collections = ['_branding_', 'branding']
        
        for (const collectionName of collections) {
          try {
            console.log(`Checking collection: ${collectionName}`)
            const allDocs = await db.collection(collectionName).find({}).toArray()
            console.log(`Found ${allDocs.length} documents in ${collectionName}`)
            
            // Check each document in raw form
            for (const doc of allDocs) {
              console.log(`Checking document ID: ${doc._id}`)
              console.log(`Document keys: ${Object.keys(doc).join(', ')}`)
              
              // Get a flattened representation of the document
              const flattenedDoc = flattenObject(doc)
              console.log('Flattened doc keys:', Object.keys(flattenedDoc).join(', '))
              
              // Check if any field in the flattened document equals our tenant ID
              let foundMatch = false
              for (const [key, value] of Object.entries(flattenedDoc)) {
                if (value === tenantId || 
                   (typeof value === 'object' && value !== null && 
                    ((value.id === tenantId) || (value._id === tenantId) || (value.equals === tenantId)))) {
                  console.log(`MATCH FOUND! Field ${key} matches tenant ${tenantId}`)
                  foundMatch = true
                  break
                }
              }
              
              if (foundMatch) {
                console.log('Returning matching branding document from direct DB access')
                return doc as unknown as BrandingSettings
              }
            }
          } catch (err: any) {
            console.log(`Error accessing ${collectionName}:`, err?.message || String(err))
          }
        }
      }
    } catch (dbErr: any) {
      console.log('DB access error:', dbErr?.message || String(dbErr))
    }
    
    // If all else fails, use the original approaches
    // Standard tenant field
    try {
      console.log('\nTrying standard tenant field lookup')
      const brandingResult = await payload.find({
        collection: '_branding_' as any,
        limit: 1,
        depth: 2,
        where: { tenant: { equals: tenantId } } as any,
      })

      if (brandingResult?.docs?.length > 0) {
        console.log('Found branding with standard tenant field')
        return brandingResult.docs[0] as unknown as BrandingSettings
      }
    } catch (err: any) {}
    
    // Alternative tenant field name
    try {
      console.log('Trying _tenant field lookup')
      const brandingResult = await payload.find({
        collection: '_branding_' as any,
        limit: 1,
        depth: 2,
        where: { _tenant: { equals: tenantId } } as any,
      })

      if (brandingResult?.docs?.length > 0) {
        console.log('Found branding with _tenant field')
        return brandingResult.docs[0] as unknown as BrandingSettings
      }
    } catch (err: any) {}
    
    // Fall back to global branding
    console.log(`\nNo tenant-specific branding found, looking for default...`)
    const globalBranding = await getGlobalBranding(payload)
    
    if (globalBranding) {
      // Add tenant ID to returned branding for debugging
      (globalBranding as any).tenantId = tenantId
      console.log(`Found branding document: default fallback`)
      console.log(`Returning branding:`, JSON.stringify(globalBranding, null, 2))
    } else {
      console.log(`No branding found at all, not even default!`)
    }
    
    return globalBranding
  } catch (error: any) {
    console.error('Error fetching tenant branding settings:', error?.message || String(error))
    return getGlobalBranding(payload) // Fallback to global branding on error
  }
}

// Helper function to flatten nested objects
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc: Record<string, any>, k: string) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], `${pre}${k}`))
    } else {
      acc[`${pre}${k}`] = obj[k]
    }
    return acc
  }, {})
}
