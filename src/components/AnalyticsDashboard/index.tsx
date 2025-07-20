'use client'
import React, { useEffect, useState } from 'react'
import { Banner } from '@payloadcms/ui/elements/Banner'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'
import './index.scss'

const baseClass = 'analytics-dashboard'

interface CollectionStat {
  collection: string
  count: number
  label: string
  color: string
  error?: number | boolean
}

const AnalyticsDashboard: React.FC = () => {
  const tenantContext = useTenantSelection()
  const [stats, setStats] = useState<CollectionStat[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Get tenant data safely
  const tenant = tenantContext && typeof tenantContext === 'object' && 'tenant' in tenantContext ? tenantContext.tenant : null
  const tenantName = tenant && typeof tenant === 'object' && 'name' in tenant ? String(tenant.name) : ''

  // Collections to track
  const collectionsToTrack = [
    { name: 'tenants', label: 'Tenants', color: '#4d7cfe' },
    { name: 'users', label: 'Users', color: '#fe8a4d' },
    { name: 'pages', label: 'Pages', color: '#39b54a' },
    { name: 'headers', label: 'Headers', color: '#8549ba' },
    { name: 'footers', label: 'Footers', color: '#ff6b6b' },
    { name: 'branding', label: 'Branding', color: '#ffc74d' },
    { name: 'domains', label: 'Domains', color: '#4dc9ff' },
  ]

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Fetch counts for each collection
        const promises = collectionsToTrack.map(async (collection) => {
          try {
            const response = await fetch(`/api/collections/${collection.name}?limit=0`)
            
            // Check if response is OK
            if (!response.ok) {
              console.warn(`Collection ${collection.name} returned status ${response.status}`)
              return {
                collection: collection.name,
                count: 0,
                label: `${collection.label} (${response.status === 404 ? 'Not Found' : 'Access Denied'})`,
                color: '#cccccc', // Gray for unavailable collections
                error: response.status
              }
            }
            
            const data = await response.json()
            
            return {
              collection: collection.name,
              count: data.totalDocs || 0,
              label: collection.label,
              color: collection.color
            }
          } catch (err) {
            console.error(`Error fetching ${collection.name}:`, err)
            return {
              collection: collection.name,
              count: 0,
              label: `${collection.label} (Error)`,
              color: '#ff0000', // Red for error
              error: true
            }
          }
        })
        
        const results = await Promise.all(promises)
        setStats(results)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Failed to load analytics data')
        setLoading(false)
      }
    }

    fetchStats()
  }, [tenantContext])

  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="info">
        <>
          <h4>Analytics Dashboard</h4>
          {tenantName ? (
            <p>Showing data for tenant: <strong>{tenantName}</strong></p>
          ) : (
            <p>Showing data across all tenants</p>
          )}
        </>
      </Banner>

      {error && (
        <Banner type="error">
          <>{error}</>
        </Banner>
      )}

      {loading ? (
        <div className={`${baseClass}__loading`}>
          <p>Loading collection data...</p>
        </div>
      ) : (
        <div className={`${baseClass}__stats`}>
          {stats.map((stat) => (
            <div 
              key={stat.collection} 
              className={`${baseClass}__stat-card ${stat.error ? `${baseClass}__stat-card--error` : ''}`}
            >
              <div 
                className={`${baseClass}__stat-indicator`} 
                style={{ backgroundColor: stat.color }}
              />
              <div className={`${baseClass}__stat-content`}>
                <h3>{stat.count}</h3>
                <p>{stat.label}</p>
                {stat.error && (
                  <small className={`${baseClass}__stat-error`}>
                    {typeof stat.error === 'number' ? 
                      `Error ${stat.error}` : 
                      'Failed to fetch'}
                  </small>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AnalyticsDashboard
