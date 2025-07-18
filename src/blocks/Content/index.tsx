'use client'

import React from 'react'
import { RenderRichText } from '../../components/RichText'
import { CMSLink } from '../../components/Link'
import { cn } from '@/utilities/ui'
import type { ContentBlock as ContentBlockType } from '../../payload-types'

export type ContentBlockProps = ContentBlockType & {
  blockType: 'content'
  blockName?: string
  columns: Array<{
    size?: 'oneThird' | 'oneHalf' | 'twoThirds' | 'full' | 'oneFourth' | 'threeFourths'
    richText?: any
    enableLink?: boolean
    link?: {
      type?: 'page' | 'custom'
      label?: string
      reference?: {
        relationTo: 'pages' | 'posts'
        value: string | number
      }
      url?: string
      newTab?: boolean
    }
  }>
}

export const ContentBlock: React.FC<ContentBlockProps> = ({ columns, blockName }) => {
  // Check if columns exist and are an array
  if (!columns || !Array.isArray(columns) || columns.length === 0) {
    return null
  }
  
  // Calculate column width class based on the size property
  const getColumnClass = (size: string | undefined) => {
    switch (size) {
      case 'oneHalf':
        return 'w-full md:w-1/2'
      case 'oneThird':
        return 'w-full md:w-1/3'
      case 'twoThirds':
        return 'w-full md:w-2/3'
      case 'oneFourth':
        return 'w-full md:w-1/4'
      case 'threeFourths':
        return 'w-full md:w-3/4'
      case 'full':
        return 'w-full'
      default:
        return 'w-full md:w-1/3'
    }
  }
  
  return (
    <section className="content-block py-16" id={blockName ? slugify(blockName) : undefined}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          {columns.map((column, i) => {
            const { size, richText, enableLink, link } = column

            return (
              <div
                key={i}
                className={cn(
                  "px-4 mb-6",
                  getColumnClass(size)
                )}
              >
                <div className="prose prose-lg max-w-none">
                  {richText && typeof richText === 'object' ? (
                    <RenderRichText data={richText} />
                  ) : (
                    richText && typeof richText === 'string' ? <p>{richText}</p> : null
                  )}
                </div>
                
                {enableLink && link?.label && (
                  <div className="mt-6">
                    <CMSLink
                      type={link.type || 'custom'}
                      reference={link.reference && {
                        relationTo: link.reference.relationTo,
                        value: link.reference.value
                      }}
                      url={link.url}
                      label={link.label}
                      newTab={link.newTab}
                      appearance="primary"
                      className="inline-block px-6 py-3 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Helper function to create URL-friendly IDs from block names
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}
