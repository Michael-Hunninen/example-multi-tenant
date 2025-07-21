// Debug utility to test tenant validation logic
export function debugTenantValidation(userData: any, currentTenantId: string) {
  console.log('=== TENANT VALIDATION DEBUG ===')
  console.log('Current Tenant ID:', currentTenantId)
  console.log('Current Tenant ID Type:', typeof currentTenantId)
  console.log('User Data:', JSON.stringify(userData, null, 2))
  
  if (!userData.tenants) {
    console.log('❌ No tenants array found on user')
    return false
  }
  
  if (!Array.isArray(userData.tenants)) {
    console.log('❌ Tenants is not an array:', typeof userData.tenants)
    return false
  }
  
  console.log('✅ Found tenants array with', userData.tenants.length, 'items')
  
  let hasAccess = false
  
  userData.tenants.forEach((t: any, index: number) => {
    console.log(`--- Checking Tenant ${index} ---`)
    console.log('Raw tenant association:', JSON.stringify(t, null, 2))
    
    const tenantId = typeof t.tenant === 'string' ? t.tenant : t.tenant?.id
    console.log('Extracted tenant ID:', tenantId)
    console.log('Extracted tenant ID type:', typeof tenantId)
    
    const matches = tenantId === currentTenantId
    console.log('Strict equality (===):', matches)
    console.log('Loose equality (==):', tenantId == currentTenantId)
    
    if (matches) {
      hasAccess = true
      console.log('✅ MATCH FOUND! User has access to this tenant')
    } else {
      console.log('❌ No match for this tenant association')
    }
  })
  
  console.log('=== FINAL RESULT ===')
  console.log('Has Access:', hasAccess)
  console.log('========================')
  
  return hasAccess
}

// Test function you can call from browser console
export function testTenantValidation() {
  // Example test data - replace with actual data from your login attempt
  const mockUserData = {
    id: "user123",
    email: "test@example.com",
    tenants: [
      {
        tenant: "tenant123", // or could be { id: "tenant123", name: "Agency Owner" }
        roles: ["tenant-viewer"]
      }
    ]
  }
  
  const mockCurrentTenantId = "tenant123"
  
  return debugTenantValidation(mockUserData, mockCurrentTenantId)
}
