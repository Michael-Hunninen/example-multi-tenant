import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { seedMultiTenantSetup } from '@/endpoints/seed/multi-tenant-setup'

export async function POST() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Run the multi-tenant setup seed
    await seedMultiTenantSetup(payload)
    
    return Response.json({ 
      success: true, 
      message: 'Multi-tenant setup completed successfully!' 
    })
  } catch (error) {
    console.error('Multi-tenant setup failed:', error)
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
