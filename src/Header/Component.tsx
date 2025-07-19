'use client';

import Link from 'next/link'
import React from 'react'
import { Logo } from '@/components/Logo/Logo'

interface HeaderProps {
  tenantId?: string
}

export function Header({ tenantId }: HeaderProps = {}) {
  return (
    <header className="container relative z-20">
      <div className="py-8 flex justify-between">
        <Link href="/">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>
        <nav className="flex gap-3 items-center">
          <Link href="/" className="text-primary hover:text-primary/80">Home</Link>
          <Link href="/posts" className="text-primary hover:text-primary/80">Posts</Link>
          <Link href="/search" className="text-primary hover:text-primary/80">Search</Link>
        </nav>
      </div>
    </header>
  )
}
