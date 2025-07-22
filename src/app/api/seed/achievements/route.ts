import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import { seedAchievements } from '@/seed/achievements'

export async function POST(request: NextRequest) {
  try {
    // Get tenant from domain
    const domain = request.headers.get('host') || 'localhost:3000'
    const tenant = await getTenantByDomain(domain)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const payload = await getPayload({ config })
    
    // Seed achievements for this tenant
    await seedAchievements(payload, tenant.id)
    
    return NextResponse.json({ 
      success: true, 
      message: `Achievements seeded successfully for tenant: ${tenant.name}`,
      tenantId: tenant.id 
    })

  } catch (error) {
    console.error('Error seeding achievements:', error)
    return NextResponse.json({ error: 'Failed to seed achievements' }, { status: 500 })
  }
}
