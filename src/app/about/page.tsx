// Direct route to the About page
import AboutPage from '../(frontend)/_components/AboutPage'
import { headers } from 'next/headers'

// Export the AboutPage component directly
export default async function About() {
  // Set custom pages flag in headers to ensure layout hides global header/footer
  const headersList = await headers()
  
  return (
    <div className="custom-page-wrapper">
      <AboutPage />
    </div>
  )
}
