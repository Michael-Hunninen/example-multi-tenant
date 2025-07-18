// Fix for dotenv TypeScript error by bypassing type checking for this import
// @ts-ignore
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import and initialize Payload
import { createLocalReq, getPayload } from 'payload'
import configPromise from '../payload.config.js'

// Import the JG Performance Horses seed script
// Must use .js extension for ESM imports, even though it's a .ts file
import { seedJGPerformanceHorses } from './jg-performance-horses.js'

const seed = async () => {
  console.log('Initializing Payload...')
  
  // Initialize Payload with the configuration
  // Removing 'local' property as it's not accepted in this version
  const payload = await getPayload({
    config: configPromise,
  })

  console.log('Starting JG Performance Horses seeding process...')
  
  try {
    // Create a local request for Payload transactions
    const payloadReq = await createLocalReq({}, payload)
    
    // Call the seed function with payload and request
    await seedJGPerformanceHorses({ payload, req: payloadReq })
    console.log('✅ Seeding complete!')
  } catch (error) {
    console.error('Error seeding JG Performance Horses tenant:')
    console.error(error)
  }

  process.exit(0)
}

seed()
