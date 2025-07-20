'use client';

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Logo } from '@/components/Logo/Logo'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { useBrandingContext } from '@/contexts/BrandingContext'

interface FooterProps {
  tenantId?: string
}

interface NavItem {
  link: {
    type: 'reference' | 'custom'
    url?: string
    reference?: {
      value: string
      relationTo: string
    }
    label: string
  }
}

interface FooterData {
  name: string
  navItems: NavItem[]
}

export function Footer({ tenantId }: FooterProps = {}) {
  const { branding, loading } = useBrandingContext();
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [footerLoading, setFooterLoading] = useState(true);
  
  // Fetch tenant-specific footer data
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setFooterLoading(true);
        const response = await fetch('/api/footers');
        if (response.ok) {
          const data = await response.json();
          // Get the first footer document for this tenant
          if (data.docs && data.docs.length > 0) {
            setFooterData(data.docs[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setFooterLoading(false);
      }
    };

    fetchFooterData();
  }, [tenantId]);
  
  // Define dynamic styles based on branding
  const footerStyle = {
    backgroundColor: branding?.footerBackgroundColor || '#000000',
    color: branding?.footerTextColor || '#ffffff',
    borderTop: `1px solid ${branding?.accentColor || '#333333'}`
  };
  
  const footerLinkStyle = {
    color: branding?.footerLinkColor || '#ffffff',
    transition: 'color 0.2s ease'
  };
  
  const footerLinkHoverStyle = {
    color: branding?.accentColor || 'rgba(255,255,255,0.8)'
  };
  
  const copyrightText = branding?.copyrightText || '© ' + new Date().getFullYear() + ' ' + (branding?.name || 'PayloadCMS') + '. All rights reserved.';
  
  // Helper function to get the URL from a nav item
  const getNavItemUrl = (navItem: NavItem) => {
    if (navItem.link.type === 'custom') {
      return navItem.link.url || '/';
    }
    // For reference type, you might need to resolve the reference
    // For now, default to home
    return '/';
  };

  return (
    <footer style={footerStyle} className="mt-auto border-t border-border dark:bg-card">
      <div className="container relative py-8">
        <div className="flex flex-col-reverse md:flex-row justify-between gap-6 md:gap-8">
          <div className="mt-6 md:mt-0">
            <Link href="/">
              <Logo className="dark:invert" />
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-wrap gap-6 md:gap-8">
              {footerLoading ? (
                // Show loading state or default links
                <>
                  <Link href="/" className="hover:opacity-80" style={footerLinkStyle}>
                    Home
                  </Link>
                  <Link href="/posts" className="hover:opacity-80" style={footerLinkStyle}>
                    Posts
                  </Link>
                </>
              ) : (
                // Show tenant-specific navigation
                footerData?.navItems?.map((navItem, index) => (
                  <Link 
                    key={index}
                    href={getNavItemUrl(navItem)}
                    className="hover:opacity-80"
                    style={footerLinkStyle}
                    onMouseOver={(e) => Object.assign(e.currentTarget.style, footerLinkHoverStyle)}
                    onMouseOut={(e) => Object.assign(e.currentTarget.style, footerLinkStyle)}
                  >
                    {navItem.link.label}
                  </Link>
                )) || (
                  // Fallback to default links if no nav items
                  <>
                    <Link href="/" className="hover:opacity-80" style={footerLinkStyle}>
                      Home
                    </Link>
                    <Link href="/posts" className="hover:opacity-80" style={footerLinkStyle}>
                      Posts
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between mt-6 gap-6">
          <small className="text-xs" style={{ color: branding?.footerTextColor || 'inherit' }}>
            {copyrightText}
          </small>
          <div className="flex items-center gap-2">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </footer>
  )
}
