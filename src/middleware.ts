import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || 'localhost:3000'

  // Skip middleware for admin, API routes, and static files
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Clone the request headers and add tenant domain information
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-domain', hostname)

  // For development, set a default tenant
  if (hostname === 'localhost:3000' || hostname === 'localhost' || hostname === '127.0.0.1') {
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
