import type { CollectionAfterLoginHook } from 'payload'

import { mergeHeaders, generateCookie, getCookieExpiration } from 'payload'

export const setCookieBasedOnDomain: CollectionAfterLoginHook = async ({ req, user }) => {
  // Find the domain mapping first
  const domainResult = await req.payload.find({
    collection: 'domains',
    depth: 1, // Include tenant data
    limit: 1,
    where: {
      domain: {
        equals: req.headers.get('host'),
      },
      isActive: {
        equals: true,
      },
    },
  })

  let relatedOrg = null
  if (domainResult && domainResult.docs.length > 0) {
    const domainDoc = domainResult.docs[0]
    // Extract tenant from domain document
    if (domainDoc.tenant) {
      relatedOrg = {
        docs: [typeof domainDoc.tenant === 'object' ? domainDoc.tenant : { id: domainDoc.tenant }]
      }
    }
  }

  // If a matching tenant is found, set the 'payload-tenant' cookie
  if (relatedOrg && relatedOrg.docs.length > 0) {
    const tenantCookie = generateCookie({
      name: 'payload-tenant',
      expires: getCookieExpiration({ seconds: 7200 }),
      path: '/',
      returnCookieAsObject: false,
      value: String(relatedOrg.docs[0].id),
    })

    // Merge existing responseHeaders with the new Set-Cookie header
    const newHeaders = new Headers({
      'Set-Cookie': tenantCookie as string,
    })

    // Ensure you merge existing response headers if they already exist
    req.responseHeaders = req.responseHeaders
      ? mergeHeaders(req.responseHeaders, newHeaders)
      : newHeaders
  }

  return user
}
