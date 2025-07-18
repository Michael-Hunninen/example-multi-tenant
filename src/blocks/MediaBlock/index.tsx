'use client'

import React from 'react'
import { Media } from '../../components/Media'
import { RenderRichText } from '../../components/RichText'
import { cn } from '@/utilities/ui'
import type { Media as MediaType } from '../../payload-types'

export type MediaBlockProps = {
  blockType: 'mediaBlock'
  blockName?: string
  media: MediaType | string | number | null
  caption?: any
  position?: 'default' | 'wide' | 'fullWidth'
}

export const MediaBlock: React.FC<MediaBlockProps> = ({ 
  media, 
  caption,
  position = 'default'
}) => {
  if (!media) return null
  
  // Determine width based on position prop
  const containerWidth = {
    default: 'container mx-auto max-w-4xl px-4',
    wide: 'container mx-auto max-w-6xl px-4',
    fullWidth: 'w-full'
  }
  
  return (
    <section className="media-block py-8 md:py-12">
      <div className={cn(containerWidth[position])}>
        <figure>
          <div className="w-full overflow-hidden rounded-lg shadow-md">
            <Media 
              resource={media}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {caption && (
            <figcaption className="mt-3 text-sm text-gray-600 italic">
              {typeof caption === 'object' ? (
                <RenderRichText data={caption} />
              ) : (
                <p>{caption}</p>
              )}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  )
}
