'use client'

import React from 'react'
import { Events as EventsComponent } from '../../components/Events'
import { Block } from 'payload/types'

type EventsBlockType = {
  title: string
  description?: any
  displayStyle?: 'list' | 'grid' | 'calendar'
  events: Array<{
    id?: string
    name: string
    date: string
    endDate?: string
    location?: string
    image?: {
      id: string
      alt?: string
      url?: string
      filename?: string
    } | string
    description?: any
    link?: {
      url?: string
      label?: string
      newTab?: boolean
    }
  }>
}

export const EventsBlock: React.FC<{
  blockType?: 'eventsBlock'
} & EventsBlockType> = (props) => {
  const { title, description, displayStyle = 'list', events = [] } = props

  // Convert block data to component props
  const adaptedEvents = events.map((event, index) => {
    // Generate a unique ID if none exists
    const id = event.id || `event-${index}`

    // Adapt image data
    let imageData = null
    if (event.image) {
      // Handle both string IDs and object references
      if (typeof event.image === 'string') {
        imageData = {
          id: event.image,
        }
      } else {
        imageData = {
          id: event.image.id,
          alt: event.image.alt,
          url: event.image.url || event.image.filename || '',
          updatedAt: '',
          createdAt: '',
        }
      }
    }

    // Map to component expected format
    return {
      id,
      title: event.name,
      description: event.description || null,
      startDate: event.date,
      endDate: event.endDate || undefined,
      location: event.location || 'TBD',
      image: imageData,
      eventType: 'other', // Default since config doesn't have eventType
      registrationUrl: event.link?.url,
      price: '', // Not in block config
    }
  })

  return (
    <EventsComponent
      title={title}
      description={description?.root?.children?.[0]?.children?.[0]?.text || description}
      events={adaptedEvents}
      viewType={displayStyle === 'grid' ? 'list' : displayStyle}
    />
  )
}
