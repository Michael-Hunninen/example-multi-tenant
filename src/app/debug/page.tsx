import React from 'react'

// Simple debug page that doesn't rely on database or API calls
export default function DebugPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Netlify Debug Page</h1>
      
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Environment Information</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          {JSON.stringify(
            {
              NODE_ENV: process.env.NODE_ENV,
              NEXT_RUNTIME: process.env.NEXT_RUNTIME,
              SERVER_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'Not set',
              VERCEL: process.env.VERCEL ? 'true' : 'false',
              NETLIFY: process.env.NETLIFY ? 'true' : 'false',
            }, 
            null, 
            2
          )}
        </pre>
      </div>
      
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Build Information</h2>
        <p className="mb-2">This is a static debug page that doesn't rely on database connections.</p>
        <p className="mb-2">If you're seeing this page but other pages return 404, it means:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>Your Next.js application is building successfully</li>
          <li>Static pages work correctly</li>
          <li>The issue may be with dynamic routes or API routes</li>
        </ul>
      </div>
      
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold mb-3">Next Steps</h2>
        <ol className="list-decimal pl-5">
          <li className="mb-2">Check that all required environment variables are set in Netlify dashboard</li>
          <li className="mb-2">Verify MongoDB connection is working correctly</li>
          <li className="mb-2">Ensure Next.js API routes are correctly configured in netlify.toml</li>
          <li className="mb-2">Check for any tenant-related errors in the deployment logs</li>
        </ol>
      </div>
    </div>
  )
}
