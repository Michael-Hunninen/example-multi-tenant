import type { CollectionAfterChangeHook } from 'payload'

export const createCustomerOnSubscription: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  // Add debugging
  console.log('🔍 Subscription hook triggered:', {
    operation,
    status: doc.status,
    previousStatus: previousDoc?.status,
    userId: doc.user
  })

  // Run on any subscription creation or when subscription becomes active
  const shouldCreateCustomer = 
    operation === 'create' || // Any new subscription
    (operation === 'update' && doc.status === 'active' && previousDoc?.status !== 'active') // Becomes active

  if (!shouldCreateCustomer) {
    console.log('❌ Skipping customer creation - conditions not met')
    return doc
  }

  console.log('✅ Creating/updating customer for subscription')

  try {
    const { payload } = req

    // Check if customer already exists for this user
    const existingCustomer = await payload.find({
      collection: 'customers',
      where: {
        user: {
          equals: doc.user,
        },
      },
      limit: 1,
    })

    // If customer doesn't exist, create one
    if (existingCustomer.docs.length === 0) {
      // Get user details
      const user = await payload.findByID({
        collection: 'users',
        id: doc.user,
      })

      if (user) {
        const userId = doc.user
        const customerData: any = {
          user: userId,
          email: user.email,
          name: (user as any).name || user.email,
          currency: 'usd',
          metadata: {
            createdFrom: 'subscription-hook',
            subscriptionId: doc.id,
            createdAt: new Date().toISOString(),
          },
        }

        // Add tenant if available
        if (doc.tenant) {
          customerData.tenant = doc.tenant
          console.log('🏢 Adding tenant to customer data:', doc.tenant)
        }

        const newCustomer = await payload.create({
          collection: 'customers',
          data: customerData,
          overrideAccess: true, // Bypass access control
        })

        console.log(`Created customer record for user ${user.email} after active subscription`)
      }
    } else {
      // Update existing customer's subscription info
      const existingMetadata = existingCustomer.docs[0].metadata as Record<string, any> || {}
      await payload.update({
        collection: 'customers',
        id: existingCustomer.docs[0].id,
        data: {
          metadata: {
            ...existingMetadata,
            lastSubscriptionId: doc.id,
            lastSubscriptionActivatedAt: new Date().toISOString(),
          },
        },
      })

      console.log(`Updated customer record for subscription ${doc.id}`)
    }
  } catch (error) {
    console.error('Error creating/updating customer on subscription:', error)
    // Don't throw error to avoid breaking the subscription creation/update
  }

  return doc
}
