'use client'

import React from 'react'
import type { Page } from '@/payload-types'
import RichText from '@/components/RichText'

type MediumImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
      media?: Page['hero']['media']
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const MediumImpactHero: React.FC<MediumImpactHeroType> = ({ children, richText, media }) => {
  // Type guard for media object
  const hasMedia = media && typeof media === 'object' && 'url' in media
  
  return (
    <div className="container mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          {children || (richText && <RichText data={richText} enableGutter={false} />)}
        </div>
        {hasMedia && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <img 
              src={media.url ?? undefined} 
              alt={typeof media.alt === 'string' ? media.alt : ''} 
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  )
}
