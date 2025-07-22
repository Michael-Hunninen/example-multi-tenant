import type { CollectionAfterChangeHook } from 'payload'

export const createCustomerOnTransaction: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  // Add debugging
  console.log('🔍 Transaction hook triggered:', {
    operation,
    status: doc.status,
    userId: doc.user
  })

  // Only run on create operations for successful transactions
  if (operation !== 'create' || doc.status !== 'succeeded') {
    console.log('❌ Skipping customer creation - transaction not successful or not create operation')
    return doc
  }

  console.log('✅ Creating/updating customer for transaction')

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
          currency: doc.currency || 'usd',
          metadata: {
            createdFrom: 'transaction-hook',
            transactionId: doc.id,
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

        console.log(`Created customer record for user ${user.email} after successful transaction`)
      }
    } else {
      // Update existing customer's last transaction info
      const existingMetadata = existingCustomer.docs[0].metadata as Record<string, any> || {}
      await payload.update({
        collection: 'customers',
        id: existingCustomer.docs[0].id,
        data: {
          metadata: {
            ...existingMetadata,
            lastTransactionId: doc.id,
            lastTransactionAt: new Date().toISOString(),
          },
        },
      })

      console.log(`Updated customer record for transaction ${doc.id}`)
    }
  } catch (error) {
    console.error('Error creating/updating customer on transaction:', error)
    // Don't throw error to avoid breaking the transaction creation
  }

  return doc
}
