import { withPayload } from '@payloadcms/next/withPayload'
import withPWA from 'next-pwa'

// Import environment configuration
import './next.config.env.mjs'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'https://clubsolve.netlify.com'

// Detect if running locally (Windows) or in Netlify (Linux)
const isLocalBuild = process.platform === 'win32';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use standalone output for deployments that need it (e.g. Netlify)
  // Vercel handles Next.js natively, so no need for standalone output there
  // This also avoids Windows symlink permission errors during local builds
  output: process.env.VERCEL ? undefined : isLocalBuild ? undefined : 'standalone',
  // Tenant routing is handled by middleware instead of rewrites
  // Add configurations from website template
  // Setting for improved compatibility
  trailingSlash: false,
  // Vercel will automatically detect the output directory
  
  // Experimental features to help with route groups and client components
  experimental: {
    // Helps with client component bundling in route groups
    optimizePackageImports: ['@payloadcms/ui'],
    // Better handling of route groups
    appDir: true,
  },
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
}

// Configure PWA
const pwaConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
        }
      }
    },
    {
      urlPattern: /^\/api\/media\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'media-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    },
    {
      urlPattern: /\.(js|css|html)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources'
      }
    }
  ]
})

export default withPayload(pwaConfig(nextConfig), { devBundleServerPackages: false })
