# Vercel Deployment Guide

This guide will help you deploy your multi-tenant Payload CMS app to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. Your project's MongoDB database URI (or PostgreSQL connection string)
3. GitHub repository with your project code

## Deployment Steps

### 1. Push Your Code to GitHub

Make sure all your code is committed and pushed to GitHub.

### 2. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Select the repository containing your multi-tenant app

### 3. Configure Environment Variables

Add the following environment variables from your `.env.vercel` file:

- `DATABASE_URI` (or `POSTGRES_URL`)
- `PAYLOAD_SECRET`
- `PAYLOAD_PUBLIC_SERVER_URL` (set to your Vercel deployment URL)
- `NEXT_PUBLIC_SERVER_URL` (same as above)
- `NEXT_PHASE=phase-production-build`
- Any other variables your app needs (Stripe keys, etc.)

### 4. Configure Build Settings

The default settings should work correctly with the configurations we've added:

- Framework Preset: Next.js
- Build Command: `pnpm build`
- Output Directory: `.next`
- Node.js Version: 18.x (or 20.x)

### 5. Deploy

Click "Deploy" and wait for the build to complete.

### 6. Verify Custom Pages

After deployment, verify that the following pages work correctly:
- Home page (root) - JG Performance custom homepage
- `/about` - About page
- `/services` - Services page
- `/pricing` - Pricing page
- `/contact` - Contact page

### Troubleshooting

If you encounter 404 errors on any pages:

1. **Check Environment Variables**: Make sure all required environment variables are set correctly in Vercel.
2. **Review Build Logs**: Check for any errors during the build process.
3. **Middleware Issues**: Verify the middleware.ts file correctly handles tenant resolution.
4. **Domain Configuration**: Make sure the domain is properly configured in your tenant settings.

## Monitoring and Logs

Use Vercel's logging and monitoring tools to track performance and errors after deployment:

1. Go to your project in the Vercel dashboard
2. Navigate to "Logs" to see runtime errors and logs
3. Check "Functions" to see serverless function performance

## Updating Your Deployment

Any changes pushed to your main branch will automatically trigger a new deployment on Vercel.
