import type { Payload } from 'payload'

/**
 * Seeds the multi-tenant system with basic test data:
 * - Sample Bronze tenant
 * - Basic test page for Bronze tenant
 * - Domain mapping for Bronze tenant
 * 
 * Note: Agency Owner tenant should be created manually through admin interface
 */
export const seedMultiTenantSetup = async (payload: Payload): Promise<void> => {
  try {
    console.log('🌱 Starting multi-tenant setup seed...')
    console.log('ℹ️  Note: Agency Owner should be created manually through admin interface')
    console.log('ℹ️  Note: Multi-tenant plugin will automatically assign tenant fields')

    // 1. Create Sample Bronze Tenant
    console.log('Creating Bronze tenant...')
    const bronzeTenant = await payload.create({
      collection: 'tenants',
      data: {
        name: 'Bronze Tenant',
        slug: 'bronze-tenant',
        isAgencyOwner: false,
        description: 'Sample bronze tier tenant for testing',
        status: 'active',
        allowPublicRead: true,
        settings: {
          maxUsers: 10,
          maxPages: 50,
        },
      },
    })
    console.log(`✅ Created Bronze tenant: ${bronzeTenant.id}`)

    // 2. Create a simple test page for Bronze tenant
    // Note: The multi-tenant plugin will automatically assign the tenant field
    console.log('Creating Bronze tenant test page...')
    const bronzeTestPage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Welcome to Bronze Tenant',
        slug: 'home',
        _status: 'published',
      },
    })
    console.log(`✅ Created Bronze tenant test page: ${bronzeTestPage.id}`)

    // 3. Create domain mapping for Bronze tenant
    console.log('Creating Bronze domain mapping...')
    const bronzeDomain = await payload.create({
      collection: 'domains',
      data: {
        domain: 'bronze.localhost:3000',
        tenant: bronzeTenant.id,
        landingPage: bronzeTestPage.id,
        isActive: true,
        isDefault: true,
      },
    })
    console.log(`✅ Created Bronze domain mapping: ${bronzeDomain.id}`)

    console.log('🎉 Multi-tenant setup completed successfully!')
    console.log('')
    console.log('📋 Summary:')
    console.log(`   • Bronze Tenant: ${bronzeTenant.id}`)
    console.log(`   • Bronze Domain (bronze.localhost:3000) → Bronze Tenant`)
    console.log('')
    console.log('🔧 Next steps:')
    console.log('   1. Create Agency Owner tenant manually through admin interface')
    console.log('   2. Create domain mapping for localhost:3000 → Agency Owner')
    console.log('   3. Test tenant isolation by visiting different domains')
    console.log('   4. Check admin panel tenant selector functionality')

  } catch (error) {
    console.error('❌ Error during multi-tenant setup:', error)
    throw error
  }
}
