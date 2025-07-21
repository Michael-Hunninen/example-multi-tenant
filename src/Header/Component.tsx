'use client';

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/Logo/Logo'
import { useBrandingContext } from '@/contexts/BrandingContext'

interface HeaderProps {
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

interface HeaderData {
  name: string
  navItems: NavItem[]
}

export function Header({ tenantId }: HeaderProps = {}) {
  const { branding, loading } = useBrandingContext();
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [customPagesEnabled, setCustomPagesEnabled] = useState<boolean | null>(null);
  const [domainLoading, setDomainLoading] = useState(true);
  const pathname = usePathname();
  
  // Check if this is a dashboard route
  const isDashboardRoute = pathname.startsWith('/dashboard');
  
  // Check if custom pages are enabled for this domain
  useEffect(() => {
    async function checkCustomPagesStatus() {
      try {
        const currentDomain = window.location.host;
        const response = await fetch(`/api/domain-info?domain=${currentDomain}`);
        if (response.ok) {
          const domainInfo = await response.json();
          setCustomPagesEnabled(domainInfo?.enableCustomPages === true);
        } else {
          setCustomPagesEnabled(false);
        }
      } catch (error) {
        console.error('Error checking custom pages status:', error);
        setCustomPagesEnabled(false);
      } finally {
        setDomainLoading(false);
      }
    }
    
    checkCustomPagesStatus();
  }, []);
  
  // Fetch tenant-specific header data
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        setHeaderLoading(true);
        const response = await fetch('/api/headers');
        if (response.ok) {
          const data = await response.json();
          // Get the first header document for this tenant
          if (data.docs && data.docs.length > 0) {
            setHeaderData(data.docs[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching header data:', error);
      } finally {
        setHeaderLoading(false);
      }
    };

    fetchHeaderData();
  }, [tenantId]);
  
  // Hide header if on dashboard route OR if custom pages are enabled
  const shouldHideHeader = isDashboardRoute || customPagesEnabled === true;
  
  // Don't render anything while we're checking domain status or if header should be hidden
  if (domainLoading || shouldHideHeader) {
    return null;
  }
  
  // Define dynamic styles based on branding
  const headerStyle = {
    backgroundColor: branding?.headerBackgroundColor || 'transparent',
    color: branding?.headerTextColor || 'inherit'
  };
  
  const linkStyle = {
    color: branding?.primaryColor || 'inherit',
    transition: 'color 0.2s ease'
  };
  
  const linkHoverStyle = {
    color: branding?.accentColor || 'inherit'
  };

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
    <header className="container relative z-20" style={headerStyle}>
      <div className="py-8 flex justify-between">
        <Link href="/">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>
        <nav className="flex gap-3 items-center">
          {headerLoading ? (
            // Show loading state or default links
            <>
              <Link href="/" className="hover:opacity-80" style={linkStyle}>
                Home
              </Link>
              <Link href="/posts" className="hover:opacity-80" style={linkStyle}>
                Posts
              </Link>
            </>
          ) : (
            // Show tenant-specific navigation
            headerData?.navItems?.map((navItem, index) => (
              <Link 
                key={index}
                href={getNavItemUrl(navItem)}
                className="hover:opacity-80"
                style={linkStyle}
                onMouseOver={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
                onMouseOut={(e) => Object.assign(e.currentTarget.style, linkStyle)}
              >
                {navItem.link.label}
              </Link>
            )) || (
              // Fallback to default links if no nav items
              <>
                <Link href="/" className="hover:opacity-80" style={linkStyle}>
                  Home
                </Link>
                <Link href="/posts" className="hover:opacity-80" style={linkStyle}>
                  Posts
                </Link>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
