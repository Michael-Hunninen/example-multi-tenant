import { NextRequest, NextResponse } from 'next/server'
import { getTenantFromRequest } from '@/utilities/getTenantFromRequest'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  try {
    // Get tenant ID from request
    const tenantId = await getTenantFromRequest()
    
    // Default values
    let tenantName = 'JG Performance Horses'
    let tenantSlug = 'default'
    
    // Get tenant data if available
    if (tenantId) {
      try {
        const payload = await getPayload({ config: configPromise })
        const tenant = await payload.findByID({
          collection: 'tenants',
          id: tenantId
        })
        if (tenant?.name) {
          tenantName = tenant.name
        }
        if (tenant?.slug) {
          tenantSlug = tenant.slug
        }
      } catch (error) {
        console.error('Error fetching tenant for service worker:', error)
      }
    }

    // Get the current origin
    const origin = new URL(request.url).origin

    // Generate tenant-specific service worker
    const serviceWorkerContent = `
// Tenant-aware Service Worker for ${tenantName}
// Generated dynamically for tenant: ${tenantSlug}

const CACHE_NAME = 'pwa-cache-${tenantSlug}-v1';
const TENANT_CACHE_NAME = 'tenant-assets-${tenantSlug}-v1';
const API_CACHE_NAME = 'api-cache-${tenantSlug}-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/offline',
  '/api/manifest',
  '/api/pwa/icon/192',
  '/api/pwa/icon/512',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main-app.js',
];

// Tenant-specific assets to cache
const TENANT_ASSETS = [
  '/api/pwa/icon/32',
  '/api/pwa/icon/152',
  '/api/pwa/icon/180',
  '/api/pwa/screenshot/mobile',
  '/api/pwa/screenshot/desktop',
];

// API routes to cache with network-first strategy
const API_ROUTES = [
  '/api/lms/',
  '/api/auth/',
  '/api/domain-info',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing for tenant: ${tenantSlug}');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache tenant-specific assets
      caches.open(TENANT_CACHE_NAME).then((cache) => {
        return cache.addAll(TENANT_ASSETS);
      })
    ]).then(() => {
      // Force activation of new service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating for tenant: ${tenantSlug}');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches for this tenant
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete caches that don't match current tenant or are outdated
            if ((cacheName.includes('${tenantSlug}') && 
                 !cacheName.includes('v1')) ||
                (cacheName.includes('pwa-cache-') && 
                 !cacheName.includes('${tenantSlug}'))) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - handle network requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(handleFetchRequest(request, url));
});

async function handleFetchRequest(request, url) {
  try {
    // Handle different types of requests with appropriate caching strategies
    
    // 1. Tenant-specific assets (cache-first)
    if (TENANT_ASSETS.some(asset => url.pathname.includes(asset))) {
      return await cacheFirst(request, TENANT_CACHE_NAME);
    }
    
    // 2. API routes (network-first with short cache)
    if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
      return await networkFirst(request, API_CACHE_NAME, 5000); // 5 second timeout
    }
    
    // 3. Static assets (cache-first)
    if (url.pathname.startsWith('/_next/') || 
        url.pathname.startsWith('/static/') ||
        STATIC_ASSETS.includes(url.pathname)) {
      return await cacheFirst(request, CACHE_NAME);
    }
    
    // 4. Navigation requests (network-first with offline fallback)
    if (request.mode === 'navigate') {
      return await navigationHandler(request);
    }
    
    // 5. Default: network-first
    return await networkFirst(request, CACHE_NAME);
    
  } catch (error) {
    console.error('Fetch handler error:', error);
    return fetch(request);
  }
}

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {});
    
    return cached;
  }
  
  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

// Network-first strategy
async function networkFirst(request, cacheName, timeout = 3000) {
  const cache = await caches.open(cacheName);
  
  try {
    // Try network first with timeout
    const networkPromise = fetch(request);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Network timeout')), timeout)
    );
    
    const response = await Promise.race([networkPromise, timeoutPromise]);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
    
  } catch (error) {
    // Fallback to cache
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Navigation handler with offline fallback
async function navigationHandler(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful navigation responses
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
    
  } catch (error) {
    // Try to serve from cache
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Fallback to offline page if available
    const offlinePage = await cache.match('/offline');
    if (offlinePage) {
      return offlinePage;
    }
    
    // Last resort: generic offline response
    return new Response(
      \`<!DOCTYPE html>
      <html>
        <head>
          <title>Offline - ${tenantName}</title>
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: #f5f5f5;
            }
            .container { 
              max-width: 400px; 
              margin: 0 auto; 
              background: white; 
              padding: 40px; 
              border-radius: 8px; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .icon { 
              font-size: 48px; 
              margin-bottom: 20px;
            }
            h1 { 
              color: #333; 
              margin-bottom: 16px;
            }
            p { 
              color: #666; 
              line-height: 1.5;
            }
            .retry-btn {
              background: #14b8a6;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              margin-top: 20px;
              font-size: 14px;
            }
            .retry-btn:hover {
              background: #0d9488;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📱</div>
            <h1>You're offline</h1>
            <p>It looks like you've lost your internet connection. Don't worry, you can still use some features of ${tenantName} while offline.</p>
            <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>\`,
      {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.includes('${tenantSlug}')) {
            return caches.delete(cacheName);
          }
        })
      );
    });
  }
});

console.log('Tenant-aware Service Worker loaded for: ${tenantName} (${tenantSlug})');
`;

    return new NextResponse(serviceWorkerContent, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=0', // Don't cache service worker
        'Service-Worker-Allowed': '/' // Allow service worker to control entire site
      }
    })
  } catch (error) {
    console.error('Error generating service worker:', error)
    
    // Return a basic fallback service worker
    const fallbackSW = `
console.log('Fallback service worker loaded');
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
`;
    
    return new NextResponse(fallbackSW, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=0'
      }
    })
  }
}
