'use client'

import React from 'react'
import type { Page } from '@/payload-types'
import RichText from '@/components/RichText'

type HighImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
      media?: Page['hero']['media']
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const HighImpactHero: React.FC<HighImpactHeroType> = ({ children, richText, media }) => {
  // Type guard for media object
  const hasMedia = media && typeof media === 'object' && 'url' in media
  
  return (
    <div className="relative">
      {hasMedia && (
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <img 
              src={media.url ?? undefined} 
              alt={typeof media.alt === 'string' ? media.alt : ''} 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </div>
      )}
      <div className="container relative z-10 py-24">
        <div className="max-w-[48rem] text-white">
          {children || (richText && <RichText data={richText} enableGutter={false} />)}
        </div>
      </div>
    </div>
  )
}
