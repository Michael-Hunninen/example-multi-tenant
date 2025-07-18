import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { seedJGPerformanceHorses } from '@/seed/jg-performance-horses'

export const maxDuration = 120 // This function can run for a maximum of 120 seconds

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  // Authenticate by passing request headers
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    // Create a Payload request object to pass to the Local API for transactions
    const payloadReq = await createLocalReq({ user }, payload)

    // Call the JG Performance Horses seed function
    await seedJGPerformanceHorses({ payload, req: payloadReq })

    return Response.json({ 
      success: true,
      message: 'JG Performance Horses tenant created successfully!'
    })
  } catch (e) {
    console.error('Error seeding JG Performance Horses tenant:', e)
    payload.logger.error({ err: e, message: 'Error seeding JG Performance Horses tenant' })
    return new Response('Error seeding JG Performance Horses tenant.', { status: 500 })
  }
}
