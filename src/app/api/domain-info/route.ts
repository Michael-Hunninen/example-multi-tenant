import { NextRequest, NextResponse } from 'next/server'
import { getDomainInfo } from '@/utilities/getDomainInfo'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 })
    }
    
    // Get domain info including enableCustomPages setting
    const domainInfo = await getDomainInfo(domain)
    
    if (!domainInfo) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      enableCustomPages: domainInfo.enableCustomPages || false,
      landingPageType: domainInfo.landingPageType || 'default',
      domain: domainInfo.domain
    })
  } catch (error) {
    console.error('Error fetching domain info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
