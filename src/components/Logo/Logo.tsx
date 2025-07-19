import clsx from 'clsx'
import React from 'react'
import { useBranding } from '../../hooks/useBranding'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  fallbackSrc?: string
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, fallbackSrc } = props
  const { branding, loading: brandingLoading } = useBranding()

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  // Use branding logo if available, otherwise fallback
  const logoSrc = branding?.logo?.url || fallbackSrc || 'https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg'
  const logoAlt = branding?.name ? `${branding.name} Logo` : 'Logo'
  const logoWidth = branding?.logo?.width || 193
  const logoHeight = branding?.logo?.height || 34

  // Show loading state or placeholder while branding is loading
  if (brandingLoading) {
    return (
      <div className={clsx('max-w-[9.375rem] w-full h-[34px] bg-gray-200 animate-pulse rounded', className)} />
    )
  }

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt={logoAlt}
      width={logoWidth}
      height={logoHeight}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px] object-contain', className)}
      src={logoSrc}
      onError={(e) => {
        // Fallback to default logo if branding logo fails to load
        const target = e.target as HTMLImageElement
        if (target.src !== fallbackSrc && fallbackSrc) {
          target.src = fallbackSrc
        } else if (!fallbackSrc) {
          target.src = 'https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg'
        }
      }}
    />
  )
}
