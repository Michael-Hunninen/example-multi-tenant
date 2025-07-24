import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || 'localhost:3000'

  // Handle admin route access control
  if (pathname.startsWith('/admin')) {
    try {
      // Check if user has admin access by examining the payload-token cookie
      const payloadToken = request.cookies.get('payload-token')?.value
      
      if (!payloadToken) {
        // No token, redirect to login
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      // For now, we'll let the admin panel handle the detailed auth check
      // The AdminBar component will hide for regular users
      // Additional server-side validation can be added here if needed
      return NextResponse.next()
    } catch (error) {
      console.error('Admin access check error:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // Handle legacy (frontend) route group access - redirect to new /frontend/* structure
  // This ensures all links from the old route group structure work with the new one
  if (pathname.startsWith('/(frontend)')) {
    const newPath = pathname.replace('/(frontend)', '/frontend')
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Clone the request headers and add tenant domain, pathname, and URL information
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-domain', hostname)
  requestHeaders.set('x-pathname', pathname)
  requestHeaders.set('x-url', request.url)

  // For development, set a default tenant
  if (hostname === 'localhost:3000' || hostname === 'localhost' || hostname === '127.0.0.1') {
    requestHeaders.set('x-tenant-slug', 'agency-owner')
  } else if (hostname.includes('clubsolve.netlify.app') || hostname.includes('vercel.app')) {
    // For Netlify/Vercel deployments, use default tenant
    requestHeaders.set('x-tenant-slug', 'agency-owner')
  } else {
    // For production, extract tenant from domain
    // This could be a subdomain (tenant.domain.com) or custom domain (tenant-domain.com)
    const subdomain = hostname.split('.')[0]
    if (subdomain && subdomain !== hostname) {
      requestHeaders.set('x-tenant-slug', subdomain)
    } else {
      // Custom domain - will be resolved by server-side utilities
      requestHeaders.set('x-tenant-slug', hostname)
    }
  }

  // Continue with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
