import { withPayload } from '@payloadcms/next/withPayload'
<<<<<<< HEAD
=======
// PWA disabled
// import withPWA from 'next-pwa'

// Import environment configuration
import './next.config.env.mjs'
>>>>>>> 8243ae26ebd3fc87813dd7ee4a3fd846a43acaee

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'https://clubsolve.netlify.com'

// Detect if running locally (Windows) or in Netlify (Linux)
const isLocalBuild = process.platform === 'win32';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for production builds
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Tenant routing is handled by middleware instead of rewrites
  // Add configurations from website template
  // Setting for improved compatibility
  trailingSlash: false,

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

<<<<<<< HEAD
// PWA configuration removed

=======
// PWA configuration has been disabled
// const pwaConfig = withPWA({
//   dest: 'public',
//   disable: process.env.NODE_ENV === 'development',
//   register: true,
//   skipWaiting: true,
//   runtimeCaching: [
//     {
//       urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'google-fonts',
//         expiration: {
//           maxEntries: 4,
//           maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
//         }
//       }
//     },
//     {
//       urlPattern: /^\/api\/media\/.*/i,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'media-cache',
//         expiration: {
//           maxEntries: 100,
//           maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
//         }
//       }
//     },
//     {
//       urlPattern: /\.(js|css|html)$/i,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'static-resources'
//       }
//     }
//   ]
// })

// Simplify the approach - we'll rely on the copy script instead of webpack customization
// This avoids the destructuring error with { isServer, dev }

>>>>>>> 8243ae26ebd3fc87813dd7ee4a3fd846a43acaee
export default withPayload(nextConfig, { devBundleServerPackages: false })
