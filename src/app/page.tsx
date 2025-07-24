// Import the CustomHomepage component directly
import CustomHomepage from './(frontend)/_components/CustomHomepage'
import { generateMetadata } from './(frontend)/page'

// Set the JG Performance homepage as the root page
export default function RootPage() {
  return <CustomHomepage />
}

// Re-export metadata from frontend
export { generateMetadata }
