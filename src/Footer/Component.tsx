'use client';

import Link from 'next/link'
import React from 'react'
import { Logo } from '@/components/Logo/Logo'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

export function Footer() {

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container relative py-8">
        <div className="flex flex-col-reverse md:flex-row justify-between gap-6 md:gap-8">
          <div className="mt-6 md:mt-0">
            <Link href="/">
              <Logo className="dark:invert" />
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-wrap gap-6 md:gap-8">
              <Link href="/" className="text-white hover:text-white/80">Home</Link>
              <Link href="/posts" className="text-white hover:text-white/80">Blog</Link>
              <Link href="/search" className="text-white hover:text-white/80">Search</Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between mt-6 gap-6">
          <small className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PayloadCMS. All rights reserved.
          </small>
          <div className="flex items-center gap-2">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </footer>
  )
}
