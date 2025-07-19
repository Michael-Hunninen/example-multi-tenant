import { NextResponse } from 'next/server'
import payload from 'payload'
import { getGlobalBranding } from '../../../utilities/getBranding'

export async function GET(request: Request) {
  try {
    console.log('=== BRANDING API DEBUG ===')
    
    // Get tenant from query params or cookies
    const url = new URL(request.url)
    const tenantParam = url.searchParams.get('tenant')
    
    console.log('Tenant param:', tenantParam)
    
    // Try to get tenant from cookies if not in params
    let tenantId = tenantParam
    if (!tenantId) {
      const cookieHeader = request.headers.get('cookie')
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=')
          acc[key] = value
          return acc
        }, {} as Record<string, string>)
        tenantId = cookies['payload-tenant']
      }
    }
    
    console.log('Using tenant ID:', tenantId)
    
    // Try multiple approaches to get branding
    let brandingDoc = null
    
    // 1. Try with tenant filter if we have a tenant
    if (tenantId) {
      try {
        console.log('Trying tenant-specific branding...')
        const tenantResult = await payload.find({
          collection: '_branding_' as any,
          where: {
            tenant: { equals: tenantId }
          },
          limit: 1,
          depth: 2,
        })
        
        if (tenantResult?.docs?.length > 0) {
          brandingDoc = tenantResult.docs[0]
          console.log('Found tenant-specific branding:', brandingDoc)
        }
      } catch (error) {
        console.error('Tenant-specific query failed:', error)
      }
    }
    
    // 2. If no tenant-specific branding, try without tenant filter
    if (!brandingDoc) {
      try {
        console.log('Trying any branding document...')
        const anyResult = await payload.find({
          collection: '_branding_' as any,
          limit: 1,
          depth: 2,
          sort: '-updatedAt',
          // Bypass tenant filtering by using local API
          req: {
            user: {
              // Mock a super admin user to bypass tenant restrictions
              roles: ['super-admin']
            }
          } as any
        })
        
        if (anyResult?.docs?.length > 0) {
          brandingDoc = anyResult.docs[0]
          console.log('Found any branding document:', brandingDoc)
        }
      } catch (error) {
        console.error('Any branding query failed:', error)
      }
    }
    
    // 3. If we found a branding document, return it
    if (brandingDoc) {
      console.log('Returning custom branding')
      return NextResponse.json({
        id: brandingDoc.id,
        name: brandingDoc.name || 'Multi-Tenant Platform',
        logo: brandingDoc.logo,
        icon: brandingDoc.icon,
        favicon: brandingDoc.favicon,
        ogImage: brandingDoc.ogImage,
        titleSuffix: brandingDoc.titleSuffix || '- Multi-Tenant Platform',
        metaDescription: brandingDoc.metaDescription || 'Multi-Tenant SaaS Platform',
        ogDescription: brandingDoc.ogDescription || 'Enterprise Multi-Tenant SaaS Platform',
        ogTitle: brandingDoc.ogTitle || 'Multi-Tenant Dashboard',
        primaryColor: brandingDoc.primaryColor || '#0C0C0C',
        accentColor: brandingDoc.accentColor || '#2D81FF',
      })
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
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error fetching branding:', error)
    return NextResponse.json({ error: 'Failed to fetch branding' }, { status: 500 })
  }
}

// POST handler for creating new branding documents
export async function POST(request: Request) {
  try {
    // Get the request URL parameters
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const depth = searchParams.get('depth') || '0'
    
    // Check content type to determine how to parse the body
    const contentType = request.headers.get('content-type') || ''
    let body: any
    
    if (contentType.includes('application/json')) {
      // For JSON content type, get raw text first to check for issues
      const text = await request.text()
      console.log('Raw request body:', text.substring(0, 100)) // Log the first 100 chars for debugging
      
      try {
        body = JSON.parse(text)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        return NextResponse.json(
          { error: 'Invalid JSON payload. Check content-type and format.' },
          { status: 400 }
        )
      }
    } else {
      // For non-JSON requests, try to get form data
      try {
        const formData = await request.formData()
        body = Object.fromEntries(formData)
      } catch (formError) {
        console.error('Form data parse error:', formError)
        // Create an empty branding document as fallback
        body = {
          name: 'Multi-Tenant Platform',
          titleSuffix: '- Multi-Tenant Platform',
          metaDescription: 'Multi-Tenant SaaS Platform',
          ogDescription: 'Enterprise Multi-Tenant SaaS Platform',
          ogTitle: 'Multi-Tenant Dashboard',
          primaryColor: '#0C0C0C',
          accentColor: '#2D81FF',
        }
      }
    }
    
    // Check if we have an existing branding document
    const existingBranding = await getGlobalBranding(payload)
    
    // Always attempt to create/update through Payload's admin endpoint first
    try {
      // If admin endpoint works, use that (this is what the admin UI expects)
      if (existingBranding && existingBranding.id) {
        // Try to update via admin endpoint
        const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/collections/branding/${existingBranding.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        
        if (result.ok) {
          const data = await result.json()
          return NextResponse.json(data)
        }
      } 
    } catch (adminError) {
      console.error('Admin endpoint update failed, falling back to direct API:', adminError)
    }
    
    // Fallback to direct API if admin endpoint fails
    if (existingBranding && existingBranding.id) {
      // Update existing document
      try {
        const result = await payload.update({
          collection: 'branding',
          id: existingBranding.id,
          data: body,
          depth: parseInt(depth as string, 10),
        })
        return NextResponse.json(result)
      } catch (updateError) {
        console.error('First update attempt failed:', updateError)
        // Try alternative collection name
        try {
          // Using type assertion to bypass TypeScript collection name validation
          // This allows us to try alternative collection names that might work at runtime
          const result = await payload.update({
            collection: 'branding' as any, // Try with type assertion instead of literal name
            id: existingBranding.id,
            data: body,
            depth: parseInt(depth as string, 10),
          })
          return NextResponse.json(result)
        } catch (altError) {
          console.error('Alternative update also failed:', altError)
        }
      }
    }
    
    // If no existing document or updates failed, try to create new
    try {
      const result = await payload.create({
        collection: '_branding_' as any, // Use correct collection slug
        data: body,
        depth: parseInt(depth as string, 10),
      })
      return NextResponse.json(result)
    } catch (createError) {
      console.error('Create attempt failed:', createError)
      return NextResponse.json(
        { error: 'Failed to create branding settings', details: createError },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Error in branding POST:', error)
    return NextResponse.json(
      { error: 'Failed to create branding settings', details: error },
      { status: 500 }
    )
  }
}

// PUT handler for updating existing branding documents
export async function PUT(request: Request) {
  try {
    // Get the request URL parameters
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const depth = searchParams.get('depth') || '0'
    const id = searchParams.get('id')
    
    // Check content type to determine how to parse the body
    const contentType = request.headers.get('content-type') || ''
    let body: any
    
    if (contentType.includes('application/json')) {
      // For JSON content type, get raw text first to check for issues
      const text = await request.text()
      console.log('Raw PUT request body:', text.substring(0, 100)) // Log the first 100 chars for debugging
      
      try {
        body = JSON.parse(text)
      } catch (parseError) {
        console.error('JSON parse error in PUT:', parseError)
        return NextResponse.json(
          { error: 'Invalid JSON payload in PUT request. Check content-type and format.' },
          { status: 400 }
        )
      }
    } else {
      // For non-JSON requests (likely from admin UI forms)
      return NextResponse.json({
        message: 'Use Payload API endpoint for non-JSON updates',
        id: id || 'unknown'
      })
    }
    
    // Check if we have an ID in the query parameters
    if (!id) {
      // If no ID provided, try to find existing branding
      const existingBranding = await getGlobalBranding(payload)
      
      if (existingBranding && existingBranding.id) {
        // Update the existing document
        const result = await payload.update({
          collection: 'branding',
          id: existingBranding.id,
          data: body,
          depth: parseInt(depth as string, 10),
        })
        
        return NextResponse.json(result)
      } else {
        return NextResponse.json(
          { error: 'No existing branding document found to update' },
          { status: 404 }
        )
      }
    }
    
    // Update with the provided ID
    const result = await payload.update({
      collection: '_branding_' as any,
      id,
      data: body,
      depth: parseInt(depth as string, 10),
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in branding PUT:', error)
    return NextResponse.json(
      { error: 'Failed to update branding settings' },
      { status: 500 }
    )
  }
}
