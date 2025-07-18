import Link from 'next/link'
import React from 'react'

export default function LandingPage() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Multi-Tenant Example with LivePreview</h1>
        
        <p className="mb-6 text-lg">
          This multi-tenant example allows you to explore multi-tenancy with domains and with slugs,
          now with LivePreview functionality for posts and pages.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold mb-4">Access by Domain</h2>
            <p className="mb-4">
              When you visit a tenant by domain, the domain is used to determine the tenant.
            </p>
            <p>
              For example, visiting{' '}
              <Link 
                href="http://gold.localhost:3000/tenant-domains/login"
                className="text-blue-600 hover:underline"
              >
                http://gold.localhost:3000/tenant-domains/login
              </Link>{' '}
              will show the tenant with the domain "gold.localhost".
            </p>
          </div>

          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <h2 className="text-xl font-semibold mb-4">Access by Slug</h2>
            <p className="mb-4">
              When you visit a tenant by slug, the slug is used to determine the tenant.
            </p>
            <p>
              For example, visiting{' '}
              <Link 
                href="http://localhost:3000/tenant-slugs/silver/login"
                className="text-indigo-600 hover:underline"
              >
                http://localhost:3000/tenant-slugs/silver/login
              </Link>{' '}
              will show the tenant with the slug "silver".
            </p>
          </div>
        </div>

        <div className="mt-10 bg-green-50 p-6 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold mb-4">LivePreview Functionality</h2>
          <p className="mb-2">
            The LivePreview functionality has been integrated with the multi-tenant setup.
            To test it:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Log in to a tenant</li>
            <li>Navigate to a page or post in the admin panel</li>
            <li>Click the LivePreview button</li>
            <li>Make changes and see them update in real-time</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
