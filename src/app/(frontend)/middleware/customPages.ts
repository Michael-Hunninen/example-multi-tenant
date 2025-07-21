import { NextRequest, NextResponse } from 'next/server'
import { getDomainInfo } from '@/utilities/getDomainInfo'

/**
 * Middleware to handle custom pages routing
 * Checks if custom pages are enabled for the domain and routes accordingly
 */
export async function customPagesMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const domain = request.headers.get('host') || 'localhost:3000'
  
  // Get domain information to check if custom pages are enabled
  const domainInfo = await getDomainInfo(domain)
  const customPagesEnabled = domainInfo?.enableCustomPages === true
  
  // List of custom pages that should only be accessible when custom pages are enabled
  const customPageRoutes = ['/about', '/services', '/pricing', '/contact']
  
  // If trying to access a custom page but custom pages are disabled, redirect to 404
  if (customPageRoutes.includes(pathname) && !customPagesEnabled) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }
  
  // If custom pages are enabled and accessing root, show custom homepage
  if (pathname === '/' && customPagesEnabled) {
    // The custom homepage will be handled by the existing routing logic
    // We just need to ensure the layout doesn't show header/footer/adminBar
    return NextResponse.next()
  }
  
  return NextResponse.next()
}
