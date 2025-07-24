// Import the CustomHomepage component directly
import CustomHomepage from './(frontend)/_components/CustomHomepage'
import { generateMetadata } from './(frontend)/page'
import { headers } from 'next/headers'

// Set the JG Performance homepage as the root page
export default async function RootPage() {
  // Set custom pages flag in headers to ensure layout hides global header/footer
  const headersList = await headers()
  
  return (
    <div className="custom-homepage-wrapper">
      <CustomHomepage />
    </div>
  )
}

// Re-export metadata from frontend
export { generateMetadata }
