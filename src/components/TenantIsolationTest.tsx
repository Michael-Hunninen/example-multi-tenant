'use client'

import React, { useState, useEffect } from 'react'
import { getTenantFromClient } from '@/utilities/getTenantFromClient'

interface TestResult {
  tenantId: string | null
  pages: any[]
  posts: any[]
  media: any[]
  domain: string
  cookie: string
}

export const TenantIsolationTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Fix hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const runIsolationTest = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const currentTenant = getTenantFromClient()
      
      // Test fetching pages using tenant-aware API
      const pagesResponse = await fetch('/api/collections/pages')
      const pagesData = await pagesResponse.json()
      
      // Test fetching posts using tenant-aware API
      const postsResponse = await fetch('/api/collections/posts')
      const postsData = await postsResponse.json()
      
      // Test fetching media using tenant-aware API
      const mediaResponse = await fetch('/api/collections/media')
      const mediaData = await mediaResponse.json()
      
      setTestResults({
        tenantId: currentTenant,
        pages: pagesData.docs || [],
        posts: postsData.docs || [],
        media: mediaData.docs || [],
        domain: typeof window !== 'undefined' ? window.location.hostname : '',
        cookie: typeof document !== 'undefined' ? 
          document.cookie.split(';').find(c => c.trim().startsWith('payload-tenant='))?.split('=')[1] || 'None'
          : 'None'
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted) {
      runIsolationTest()
    }
  }, [mounted])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="p-4 border rounded">Loading tenant isolation test...</div>
  }

  if (loading) {
    return <div className="p-4 border rounded">Testing tenant isolation...</div>
  }

  if (error) {
    return <div className="p-4 border rounded text-red-600">Error: {error}</div>
  }

  return (
    <div className="p-4 border rounded space-y-4 bg-yellow-50">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Tenant Isolation Test</h3>
        <button 
          onClick={runIsolationTest}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Refresh Test
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold">Current Context</h4>
          <div className="text-sm space-y-1">
            <div>Detected Tenant: <span className="font-mono">{testResults?.tenantId || 'None'}</span></div>
            <div>Domain: <span className="font-mono">{testResults?.domain || 'N/A'}</span></div>
            <div>Cookie: <span className="font-mono text-xs">{testResults?.cookie || 'N/A'}</span></div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold">Content Counts</h4>
          <div className="text-sm space-y-1">
            <div>Pages: <span className="font-mono">{testResults?.pages.length || 0}</span></div>
            <div>Posts: <span className="font-mono">{testResults?.posts.length || 0}</span></div>
            <div>Media: <span className="font-mono">{testResults?.media.length || 0}</span></div>
          </div>
        </div>
      </div>
      
      {testResults && testResults.pages.length > 0 && (
        <div>
          <h4 className="font-semibold">Sample Pages (First 3)</h4>
          <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
            {testResults.pages.slice(0, 3).map((page, index) => (
              <div key={index} className="p-2 bg-white border rounded">
                <div>Title: {page.title || 'No title'}</div>
                <div>ID: <span className="font-mono">{page.id || 'No ID'}</span></div>
                <div>Tenant: <span className="font-mono">
                  {typeof page.tenant === 'object' ? 
                    (page.tenant?.id || page.tenant?.name || JSON.stringify(page.tenant)) : 
                    (page.tenant || 'No tenant field!')}
                </span></div>
                <div>Status: {page._status || 'No status'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-600 bg-white p-2 rounded">
        <strong>Expected Behavior:</strong> Each tenant should only see their own content. 
        If you see content from other tenants or no tenant field, the isolation is not working correctly.
        <br />
        <strong>Debug:</strong> Check if pages have a 'tenant' field. If not, the multi-tenant plugin isn't injecting tenant fields properly.
      </div>
    </div>
  )
}
