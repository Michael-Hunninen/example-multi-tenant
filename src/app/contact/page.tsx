// Direct route to the Contact page
import ContactPage from '../(frontend)/_components/ContactPage'
import { headers } from 'next/headers'

// Export the ContactPage component directly
export default async function Contact() {
  // Set custom pages flag in headers to ensure layout hides global header/footer
  const headersList = await headers()
  
  return (
    <div className="custom-page-wrapper">
      <ContactPage />
    </div>
  )
}
