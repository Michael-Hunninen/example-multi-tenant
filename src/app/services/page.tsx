// Direct route to the Services page
import ServicesPage from '../(frontend)/_components/ServicesPage'
import { headers } from 'next/headers'

// Export the ServicesPage component directly
export default async function Services() {
  // Set custom pages flag in headers to ensure layout hides global header/footer
  const headersList = await headers()
  
  return (
    <div className="custom-page-wrapper">
      <ServicesPage />
    </div>
  )
}
