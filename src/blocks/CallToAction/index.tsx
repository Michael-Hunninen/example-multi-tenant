'use client'

import React from 'react'
import { RenderRichText } from '../../components/RichText'
import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'
import { cn } from '@/utilities/ui'

export type CallToActionProps = {
  blockType: 'cta'
  blockName?: string
  content?: any
  backgroundType?: 'color' | 'image'
  backgroundColor?: 'blue' | 'gray' | 'white'
  backgroundImage?: any
  textColor?: 'light' | 'dark'
  textAlignment?: 'left' | 'center' | 'right'
  fullHeight?: boolean
  buttons?: Array<{
    label: string
    type: 'primary' | 'secondary'
    link: {
      type?: 'reference' | 'custom'
      label?: string
      reference?: {
        value: string | number
        relationTo: 'pages' | 'posts'
      }
      url?: string
      newTab?: boolean
    }
  }>
}

export const CallToAction: React.FC<CallToActionProps> = (props) => {
  const { 
    content, 
    buttons, 
    blockName,
    backgroundType = 'color',
    backgroundColor = 'blue',
    backgroundImage,
    textColor = 'light',
    textAlignment = 'center',
    fullHeight = false
  } = props

  // Background style logic
  let backgroundClasses = '';
  let overlayClasses = '';
  let inlineBackgroundStyle = {};

  if (backgroundType === 'color') {
    const backgroundColors = {
      blue: 'bg-gradient-to-br from-blue-600 to-blue-700',
      gray: 'bg-gray-100',
      white: 'bg-white border border-gray-100'
    };
    backgroundClasses = backgroundColors[backgroundColor] || backgroundColors.blue;
  } 
  
  if (backgroundType === 'image' && backgroundImage) {
    overlayClasses = 'after:absolute after:inset-0 after:bg-black after:opacity-40 after:z-0';
    inlineBackgroundStyle = {
      backgroundImage: `url(${typeof backgroundImage === 'object' && backgroundImage.url ? backgroundImage.url : ''})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  // Text style logic
  const textClasses = {
    color: textColor === 'light' ? 'text-white' : 'text-gray-800',
    alignment: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }[textAlignment]
  };
  
  // Height logic
  const heightClasses = fullHeight ? 'min-h-[70vh] flex items-center' : 'py-16';
  
  // Prose classes for content
  const proseClasses = cn(
    'prose prose-lg max-w-none',
    textColor === 'light' && 'prose-invert'
  );
  
  return (
    <section 
      className={cn(
        'cta-block relative overflow-hidden',
        heightClasses,
        backgroundClasses,
        overlayClasses,
        textClasses.color
      )}
      id={blockName ? slugify(blockName) : undefined}
      style={backgroundType === 'image' ? inlineBackgroundStyle : {}}
    >
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className={cn(
          'max-w-4xl mx-auto',
          textClasses.alignment
        )}>
          {content && (
            <div className="mb-10">
              {typeof content === 'object' ? (
                <div className={proseClasses}>
                  <RenderRichText data={content} />
                </div>
              ) : (
                <p className="text-xl md:text-2xl font-medium">
                  {content}
                </p>
              )}
            </div>
          )}
          
          {buttons && buttons.length > 0 && (
            <div className={cn(
              'flex flex-wrap gap-4 md:gap-6',
              textAlignment === 'center' && 'justify-center',
              textAlignment === 'right' && 'justify-end'
            )}>
              {buttons.map((button, index) => {
                const { label, type = 'primary', link } = button;
                
                if (!link || !label) return null;
                
                // Button styles based on type and text color context
                const buttonClasses = {
                  primary: textColor === 'light' 
                    ? 'bg-white hover:bg-gray-100 text-blue-600 hover:text-blue-700 shadow-md hover:shadow-lg border border-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg border border-blue-600',
                  secondary: textColor === 'light'
                    ? 'bg-transparent hover:bg-white/10 text-white border-2 border-white'
                    : 'bg-transparent hover:bg-blue-50 text-blue-600 border-2 border-blue-600'
                };
                
                return (
                  <CMSLink
                    key={index}
                    type={link.type || 'custom'}
                    url={link.url || ''}
                    reference={link.reference && {
                      relationTo: link.reference.relationTo as 'pages' | 'posts',
                      value: link.reference.value
                    }}
                    newTab={typeof link.newTab === 'boolean' ? link.newTab : false}
                    className={cn(
                      'inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-all', 
                      buttonClasses[type]
                    )}
                  >
                    {label}
                  </CMSLink>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Background image with overlay when using image background */}
      {backgroundType === 'image' && backgroundImage && (
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full">
            <Media
              resource={backgroundImage}
              fill
              imgClassName="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>
        </div>
      )}
    </section>
  );
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
