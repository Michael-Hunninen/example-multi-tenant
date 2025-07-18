"use client"

import React, { useState } from 'react'
import { Media } from '../Media'
import RichText, { RenderRichText } from '../RichText'
import { CMSLink } from '../Link'

export type EventType = {
  id: string
  title: string
  description: any // Rich text content
  startDate: string
  endDate?: string
  location: string
  image?: {
    id: string
    alt?: string
    url: string
    updatedAt: string
    createdAt: string
  }
  eventType: 'competition' | 'clinic' | 'training' | 'seminar' | 'other'
  registrationUrl?: string
  price?: string
  tags?: string[]
}

export type EventsProps = {
  title?: string
  description?: string
  events: EventType[]
  showFilters?: boolean
  viewType?: 'list' | 'calendar'
}

export const Events: React.FC<EventsProps> = ({
  title = 'Upcoming Events',
  description,
  events,
  showFilters = true,
  viewType = 'list'
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  
  // Sort events by date (ascending)
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })
  
  // Get all event types for filtering
  const eventTypes = ['all', ...Array.from(new Set(events.filter(event => event.eventType).map(event => event.eventType)))]
  
  // Filter events by type
  const filteredEvents = activeFilter === 'all' 
    ? sortedEvents 
    : sortedEvents.filter(event => event.eventType && event.eventType === activeFilter)
    
  // Filter events by month/year if in calendar view
  const calendarFilteredEvents = viewType === 'calendar'
    ? filteredEvents.filter(event => {
        const eventDate = new Date(event.startDate)
        return eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear
      })
    : filteredEvents
  
  // Format date nicely
  const formatEventDate = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    
    const formatOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    }
    
    let dateString = start.toLocaleDateString('en-US', formatOptions)
    
    if (endDate) {
      const end = new Date(endDate)
      
      // Check if it's the same day
      if (start.toDateString() === end.toDateString()) {
        return dateString
      }
      
      // Check if it's the same month
      if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `${start.toLocaleDateString('en-US', { day: 'numeric' })} - ${end.toLocaleDateString('en-US', formatOptions)}`
      }
      
      // Different months
      return `${dateString} - ${end.toLocaleDateString('en-US', formatOptions)}`
    }
    
    return dateString
  }
  
  // Get event type badge styles
  const getEventTypeBadgeStyles = (type: string) => {
    switch (type) {
      case 'competition':
        return 'bg-red-100 text-red-800'
      case 'clinic':
        return 'bg-blue-100 text-blue-800'
      case 'training':
        return 'bg-green-100 text-green-800'
      case 'seminar':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }
  
  const getNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  return (
    <div className="events-component py-12">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-3">{title}</h2>
        )}
        
        {description && (
          <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto">{description}</p>
        )}
        
        <div className="mb-8 flex flex-wrap justify-between items-center">
          {showFilters && (
            <div className="filters mb-4 sm:mb-0 flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeFilter === type 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          )}
          
          <div className="view-toggle flex">
            {viewType === 'calendar' && (
              <div className="flex items-center">
                <button
                  onClick={getPreviousMonth}
                  className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <span className="mx-4 font-medium">
                  {monthNames[selectedMonth]} {selectedYear}
                </span>
                
                <button
                  onClick={getNextMonth}
                  className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {calendarFilteredEvents.length > 0 ? (
          <div className={viewType === 'list' ? 'space-y-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
            {calendarFilteredEvents.map(event => (
              <div 
                key={event.id}
                className={`event-card bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 ${
                  viewType === 'list' ? 'flex flex-col md:flex-row' : ''
                }`}
              >
                {event.image && (
                  <div className={viewType === 'list' ? 'md:w-1/3' : ''}>
                    <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                      <Media
                        resource={event.image.id}
                        alt={event.image.alt || event.title}
                        className={`w-full ${viewType === 'list' ? 'h-48 md:h-full' : 'h-48'} object-cover object-center`}
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getEventTypeBadgeStyles(event.eventType || 'other')}`}>
                          {event.eventType ? (event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)) : 'Other'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className={`p-6 ${viewType === 'list' ? 'md:w-2/3' : ''}`}>
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {formatEventDate(event.startDate, event.endDate)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  
                  <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">{event.location}</span>
                  </div>
                  
                  <div className="prose prose-sm mb-4">
                    {event.description && typeof event.description === 'object' ? (
                      <RenderRichText data={event.description} />
                    ) : (
                      <p>{typeof event.description === 'string' ? event.description : ''}</p>
                    )}
                  </div>
                  
                  {event.tags && event.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
                      {event.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {event.price && (
                    <div className="mb-4">
                      <span className="text-sm text-gray-500 block">Price:</span>
                      <span className="text-lg font-bold text-gray-800">{event.price}</span>
                    </div>
                  )}
                  
                  {event.registrationUrl && (
                    <div className="mt-4">
                      <CMSLink
                        url={event.registrationUrl}
                        newTab={true}
                        type="custom"
                        label="Register Now"
                        appearance="default"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {activeFilter === 'all' 
                ? viewType === 'calendar' 
                  ? `No events found for ${monthNames[selectedMonth]} ${selectedYear}.` 
                  : 'No upcoming events at this time.'
                : `No ${activeFilter} events found.`
              }
            </p>
            
            {activeFilter !== 'all' && (
              <button
                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                onClick={() => setActiveFilter('all')}
              >
                View All Events
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
