import { Payload } from 'payload'
import Stripe from 'stripe'
import type { PayloadRequest } from 'payload/types'
import type { User } from '../payload-types'

interface TenantStripeConfig {
  secretKey: string | null
  publishableKey: string | null
  webhookSecret: string | null
  isTestMode: boolean
  enabled: boolean
}

// Default empty config for when no tenant is found or Stripe is disabled
const emptyConfig: TenantStripeConfig = {
  secretKey: null,
  publishableKey: null,
  webhookSecret: null,
  isTestMode: true,
  enabled: false,
}

/**
 * Get Stripe configuration for the current tenant
 * Falls back to environment variables if not set in tenant config
 */
export const getTenantStripeConfig = async (
  req: PayloadRequest,
  payload: Payload,
): Promise<TenantStripeConfig> => {
  try {
    // Get current tenant from request
    // The multi-tenant plugin sets req.tenant when it processes the request
    const tenant = req.tenant

    // If no tenant found, return empty config
    if (!tenant) {
      return {
        ...emptyConfig,
        // Fall back to environment variables
        secretKey: process.env.STRIPE_SECRET_KEY || null,
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null,
        webhookSecret: process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET || null,
        isTestMode: Boolean(process.env.STRIPE_SECRET_KEY?.includes('sk_test')),
        enabled: Boolean(process.env.STRIPE_SECRET_KEY),
      }
    }

    // Check if tenant has Stripe enabled
    if (!tenant.stripe?.enabled) {
      return emptyConfig
    }

    // Return tenant-specific configuration
    return {
      secretKey: tenant.stripe.secretKey || process.env.STRIPE_SECRET_KEY || null,
      publishableKey: 
        tenant.stripe.publishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null,
      webhookSecret: 
        tenant.stripe.webhookSecret || process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET || null,
      isTestMode: tenant.stripe.isTestMode ?? Boolean(tenant.stripe.secretKey?.includes('sk_test')),
      enabled: Boolean(tenant.stripe.secretKey),
    }
  } catch (error) {
    console.error('Error getting tenant Stripe config:', error)
    // Fall back to environment variables
    return {
      secretKey: process.env.STRIPE_SECRET_KEY || null,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null,
      webhookSecret: process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET || null,
      isTestMode: Boolean(process.env.STRIPE_SECRET_KEY?.includes('sk_test')),
      enabled: Boolean(process.env.STRIPE_SECRET_KEY),
    }
  }
}

/**
 * Initialize a Stripe instance with tenant-specific API key
 */
export const initTenantStripe = async (
  req: PayloadRequest,
  payload: Payload,
): Promise<Stripe | null> => {
  const config = await getTenantStripeConfig(req, payload)
  
  if (!config.secretKey || !config.enabled) {
    return null
  }
  
  return new Stripe(config.secretKey, {
    apiVersion: '2022-08-01', // Match Payload Stripe plugin version
  })
}
