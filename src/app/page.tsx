// Import metadata from the new frontend directory
import { generateMetadata } from './frontend/page'
import { redirect } from 'next/navigation'

// Set the JG Performance homepage as the root page
export default function RootPage() {
  // Redirect to the new frontend route instead of frontend
  redirect('/frontend')
}

// Re-export metadata from frontend
export { generateMetadata }
