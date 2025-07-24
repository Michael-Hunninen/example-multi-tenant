// Direct route to the Pricing page
import PricingPage from '../(frontend)/_components/PricingPage'
import { headers } from 'next/headers'

// Export the PricingPage component directly
export default async function Pricing() {
  // Set custom pages flag in headers to ensure layout hides global header/footer
  const headersList = await headers()
  
  return (
    <div className="custom-page-wrapper">
      <PricingPage />
    </div>
  )
}
