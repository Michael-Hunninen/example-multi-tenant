'use client'

import React, { Fragment, useEffect, useState } from 'react'
import type { Page } from '../payload-types'
import { ContentBlock } from './Content'

// Import the default blocks properly
import { HeroBlock } from './Hero'
import { MediaBlock } from './MediaBlock'
import { CallToAction } from './CallToAction'
import { FormBlock } from './Form'
import { ArchiveBlock } from './ArchiveBlock'

// Import business-specific components
import { HorseShowcase } from '../components/HorseShowcase'
import { TrainerProfile } from '../components/TrainerProfile'
import { TrainingServices } from '../components/TrainingServices'
import { Testimonials } from '../components/Testimonials'
import { EventsBlock } from './Events'

// Import LMS-specific components
import { LMSHeroBlockComponent } from './LMSHero/Component'
import { VideoPlayerBlockComponent } from './VideoPlayer/Component'
import { CourseGridBlockComponent } from './CourseGrid/Component'
import { DashboardLayoutBlockComponent } from './DashboardLayout/Component'

// Define types for custom blocks
type CustomBlockType = 
  | 'hero'
  | 'archive'
  | 'horseShowcaseBlock' 
  | 'trainerProfileBlock' 
  | 'trainingServicesBlock' 
  | 'testimonialsBlock' 
  | 'eventsBlock'
  | 'lmsHero'
  | 'videoPlayer'
  | 'courseGrid'
  | 'dashboardLayout'

// Extended block type that includes our custom types
type ExtendedBlockType = Page['layout'][0]['blockType'] | CustomBlockType

// Extended layout block type
interface ExtendedLayoutBlock extends Omit<Page['layout'][0], 'blockType'> {
  blockType: ExtendedBlockType
}


// This is a simplified version of RenderBlocks for multi-tenant LivePreview
// You can extend this with actual block implementations as needed
// Helper to fetch collection data for archive blocks
const useCollectionFetch = (block: any) => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  useEffect(() => {
    const fetchCollectionData = async () => {
      if (block.blockType !== 'archive' || block.populateBy !== 'collection') {
        setLoading(false)
        return
      }
      
      try {
        // Fetch the collection data based on relationTo
        const response = await fetch(`/api/collections/${block.relationTo}?limit=${block.limit || 10}`)
        if (response.ok) {
          const result = await response.json()
          setData(result.docs || [])
        } else {
          console.error('Failed to fetch collection data')
        }
      } catch (error) {
        console.error('Error fetching collection data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCollectionData()
  }, [block])
  
  return { data, loading }
}

export const RenderBlocks: React.FC<{
  blocks: (Page['layout'][0] | ExtendedLayoutBlock)[]
}> = (props) => {
  const { blocks } = props
  
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          // Switch statement to render different block types
          switch (blockType) {
            case 'hero':
              return <HeroBlock key={index} {...(block as any)} />

            case 'content':
              return <ContentBlock key={index} {...(block as any)} />
            
            case 'mediaBlock':
              return <MediaBlock key={index} {...(block as any)} />
              
            case 'cta':
              return <CallToAction key={index} {...(block as any)} />
              
            case 'formBlock':
              return <FormBlock key={index} {...(block as any)} />
              
            case 'archive':
              {
                const { data, loading } = useCollectionFetch(block)
                return <ArchiveBlock 
                  key={index} 
                  {...(block as any)} 
                  populatedDocs={data} 
                  loading={loading} 
                />
              }
            
            // Business-specific components for JG Performance Horses
            case 'horseShowcaseBlock':
              return <HorseShowcase key={index} {...(block as any)} />
              
            case 'trainerProfileBlock':
              return <TrainerProfile key={index} {...(block as any)} />
              
            case 'trainingServicesBlock':
              return <TrainingServices key={index} {...(block as any)} />
              
            case 'testimonialsBlock':
              return <Testimonials key={index} {...(block as any)} />
              
            case 'eventsBlock':
              return <EventsBlock key={index} {...(block as any)} />
              
            // LMS-specific components
            case 'lmsHero':
              return <LMSHeroBlockComponent key={index} {...(block as any)} />
              
            case 'videoPlayer':
              return <VideoPlayerBlockComponent key={index} {...(block as any)} />
              
            case 'courseGrid':
              return <CourseGridBlockComponent key={index} {...(block as any)} />
              
            case 'dashboardLayout':
              return <DashboardLayoutBlockComponent key={index} {...(block as any)} />
              
            default:
              // Fallback for unimplemented block types
              return (
                <div 
                  key={index} 
                  className="my-8 p-4 border rounded-lg"
                  style={{ backgroundColor: '#f9fafb' }}
                >
                  <h3 className="text-lg font-medium mb-2">Block: {blockType}</h3>
                  <pre className="text-sm overflow-auto bg-white p-3 rounded">
                    {JSON.stringify(block, null, 2)}
                  </pre>
                </div>
              )
          }
        })}
      </Fragment>
    )
  }

  return null
}
