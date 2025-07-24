import { withPayload } from '@payloadcms/next/withPayload'
// PWA disabled
// import withPWA from 'next-pwa'

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

// Add custom build step to ensure client reference manifest is created
nextConfig.webpack = (config, { isServer, dev }) => {
  // Keep existing webpack config
  const originalConfig = nextConfig.webpack ? nextConfig.webpack(config) : config;
  
  // Add custom handling for client reference manifest
  if (isServer && !dev) {
    // This will run during the build process
    console.log('Adding custom handling for (frontend) client reference manifest');
    
    // Original webpack config is preserved
  }
  
  return originalConfig;
};

export default withPayload(nextConfig, { devBundleServerPackages: false })
