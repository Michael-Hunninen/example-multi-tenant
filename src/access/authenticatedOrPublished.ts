import type { Access } from 'payload'

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  // If there's a user, allow access
  if (user) {
    return true
  }
  
  // If no user, only allow access to published documents
  return {
    _status: {
      equals: 'published',
    },
  }
}
