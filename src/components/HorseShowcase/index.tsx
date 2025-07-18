"use client"

import React, { useState } from 'react'
import { Media } from '../Media'

export type HorseProfileType = {
  id: string
  name: string
  breed: string
  age?: number
  description: string
  forSale?: boolean
  price?: string
  images: {
    id: string
    alt?: string
    url: string
    updatedAt: string
    createdAt: string
  }[]
  disciplines?: string[]
  achievements?: string[]
}

export type HorseShowcaseProps = {
  title?: string
  description?: string
  horses: HorseProfileType[]
  showFilters?: boolean
}

export const HorseShowcase: React.FC<HorseShowcaseProps> = ({
  title = 'Our Horses',
  description,
  horses,
  showFilters = true
}) => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedHorse, setExpandedHorse] = useState<string | null>(null)
  
  // Get unique disciplines for filtering
  const allDisciplines = horses
    .flatMap(horse => horse.disciplines || [])
    .filter((value, index, self) => self.indexOf(value) === index)
    
  const filteredHorses = activeFilter === 'all' 
    ? horses
    : activeFilter === 'for-sale' 
      ? horses.filter(horse => horse.forSale)
      : horses.filter(horse => horse.disciplines?.includes(activeFilter))
      
  const toggleHorseExpanded = (horseId: string) => {
    setExpandedHorse(expandedHorse === horseId ? null : horseId)
  }
      
  return (
    <div className="horse-showcase py-12">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-3">{title}</h2>
        )}
        
        {description && (
          <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto">{description}</p>
        )}
        
        {showFilters && (
          <div className="filters mb-8 flex flex-wrap justify-center gap-2">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === 'for-sale' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('for-sale')}
            >
              For Sale
            </button>
            
            {allDisciplines.map(discipline => (
              <button
                key={discipline}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === discipline 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setActiveFilter(discipline)}
              >
                {discipline}
              </button>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHorses.map(horse => (
            <div 
              key={horse.id}
              className="horse-card bg-white rounded-lg overflow-hidden shadow-md border border-gray-100"
            >
              {horse.images && horse.images.length > 0 && (
                <div className="aspect-w-4 aspect-h-3 relative overflow-hidden">
                  <Media 
                    resource={horse.images[0].id} 
                    alt={horse.images[0].alt || horse.name}
                    className="w-full h-64 object-cover object-center"
                  />
                  {horse.forSale && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      For Sale
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-5">
                <h3 className="text-xl font-bold mb-1">{horse.name}</h3>
                
                <div className="text-gray-600 mb-3">
                  {horse.breed}
                  {horse.age && <span> • {horse.age} years old</span>}
                </div>
                
                <p className="text-gray-700 mb-4">
                  {expandedHorse === horse.id 
                    ? horse.description 
                    : `${horse.description.substring(0, 100)}${horse.description.length > 100 ? '...' : ''}`
                  }
                </p>
                
                {horse.description.length > 100 && (
                  <button 
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-3"
                    onClick={() => toggleHorseExpanded(horse.id)}
                  >
                    {expandedHorse === horse.id ? 'Read Less' : 'Read More'}
                  </button>
                )}
                
                {horse.disciplines && horse.disciplines.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-semibold mb-1">Disciplines:</div>
                    <div className="flex flex-wrap gap-1">
                      {horse.disciplines.map((discipline, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {discipline}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {expandedHorse === horse.id && horse.achievements && horse.achievements.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-semibold mb-1">Achievements:</div>
                    <ul className="list-disc pl-5 text-sm">
                      {horse.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {horse.forSale && horse.price && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-500">Price:</span>
                      <span className="text-xl font-bold text-green-600">{horse.price}</span>
                    </div>
                    
                    <a 
                      href="#contact"
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mt-3 transition-colors"
                    >
                      Inquire About This Horse
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredHorses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No horses match your current filter criteria.</p>
            <button
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
              onClick={() => setActiveFilter('all')}
            >
              View All Horses
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
