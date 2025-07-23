# Stripe Integration Setup Guide

## Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_ENDPOINT_SECRET=whsec_your_webhook_secret_here

# For Production
# STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
# STRIPE_WEBHOOK_ENDPOINT_SECRET=whsec_your_live_webhook_secret_here
```

## Getting Your Stripe Keys

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/
2. **Get API Keys**:
   - Navigate to "Developers" → "API keys"
   - Copy your "Publishable key" (starts with `pk_test_` or `pk_live_`)
   - Copy your "Secret key" (starts with `sk_test_` or `sk_live_`)

3. **Set up Webhooks**:
   - Navigate to "Developers" → "Webhooks"
   - Click "Add endpoint"
   - Set endpoint URL to: `https://yourdomain.com/api/stripe/tenant-webhooks`
   - Select events to listen to:
     - `payment_intent.succeeded`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment.succeeded`
     - `invoice.payment.failed`
   - Copy the "Signing secret" (starts with `whsec_`)

## Multi-Tenant Setup

Each tenant can have their own Stripe configuration in the CMS:
1. Go to Admin → Tenants
2. Edit your tenant
3. Configure Stripe settings:
   - Secret Key
   - Publishable Key  
   - Webhook Secret
   - Test Mode toggle

## Architecture

The system supports:
- **Global Stripe Config**: Environment variables as fallback
- **Per-Tenant Stripe Config**: Individual Stripe accounts per tenant
- **Automatic Fallback**: Uses global config if tenant config is missing

## API Endpoints Available

- `POST /api/stripe/create-tenant-checkout-session` - Create checkout session
- `POST /api/stripe/create-tenant-payment-intent` - Create payment intent
- `GET /api/stripe/tenant-publishable-key` - Get publishable key
- `POST /api/stripe/tenant-webhooks` - Handle webhooks

## Testing

1. Use Stripe test cards: https://stripe.com/docs/testing
2. Test card: `4242 4242 4242 4242`
3. Use any future expiry date and any 3-digit CVC

## Next Steps

1. Set up your environment variables
2. Create products in Stripe Dashboard with price IDs
3. Update your CMS products with the Stripe price IDs
4. Test the checkout flow
