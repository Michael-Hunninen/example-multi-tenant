"use client"

import React, { useState } from 'react'
import RichText, { RenderRichText } from '../RichText'
import { Media } from '../Media'

export type TrainingServiceType = {
  id: string
  title: string
  description: any // Rich text content
  image?: {
    id: string
    alt?: string
    url: string
    updatedAt: string
    createdAt: string
  }
  price?: string
  features?: string[]
  primaryColor?: string
}

export type TrainingServicesProps = {
  title?: string
  description?: string
  services: TrainingServiceType[]
  layout?: 'cards' | 'tabs'
}

export const TrainingServices: React.FC<TrainingServicesProps> = ({
  title = 'Our Training Services',
  description,
  services,
  layout = 'cards'
}) => {
  const [activeTab, setActiveTab] = useState(services[0]?.id || '')
  
  const activeService = services.find(service => service.id === activeTab)
  
  return (
    <div className="training-services py-12">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-3">{title}</h2>
        )}
        
        {description && (
          <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto">{description}</p>
        )}
        
        {layout === 'tabs' ? (
          <div className="tab-layout max-w-5xl mx-auto">
            <div className="tabs-header mb-6 border-b border-gray-200">
              <div className="flex flex-wrap -mb-px">
                {services.map(service => (
                  <button
                    key={service.id}
                    className={`inline-block py-4 px-6 font-medium text-lg border-b-2 ${
                      activeTab === service.id
                        ? `border-${service.primaryColor || 'blue'}-600 text-${service.primaryColor || 'blue'}-600`
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab(service.id)}
                  >
                    {service.title}
                  </button>
                ))}
              </div>
            </div>
            
            {activeService && (
              <div className="tab-content">
                <div className="flex flex-col md:flex-row gap-8">
                  {activeService.image && (
                    <div className="w-full md:w-1/3">
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <Media
                          resource={activeService.image.id}
                          alt={activeService.image.alt || activeService.title}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className={`w-full ${activeService.image ? 'md:w-2/3' : ''}`}>
                    <h3 className="text-2xl font-bold mb-4">{activeService.title}</h3>
                    
                    <div className="prose max-w-none mb-6">
                      {activeService.description && typeof activeService.description === 'object' ? (
                        <RenderRichText data={activeService.description} />
                      ) : (
                        <p>{typeof activeService.description === 'string' ? activeService.description : ''}</p>
                      )}
                    </div>
                    
                    {activeService.features && activeService.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">What's Included:</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {activeService.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {activeService.price && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">Investment:</h4>
                        <p className="text-2xl font-bold text-gray-800">{activeService.price}</p>
                      </div>
                    )}
                    
                    <a
                      href="#contact"
                      className={`inline-block px-6 py-3 rounded-md font-medium text-white bg-${activeService.primaryColor || 'blue'}-600 hover:bg-${activeService.primaryColor || 'blue'}-700`}
                    >
                      Request Information
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card-layout grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
              <div
                key={service.id}
                className="service-card bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 flex flex-col"
              >
                {service.image && (
                  <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                    <Media
                      resource={service.image.id}
                      alt={service.image.alt || service.title}
                      className="w-full h-48 object-cover object-center"
                    />
                  </div>
                )}
                
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  
                  <div className="prose prose-sm mb-4">
                    {service.description && typeof service.description === 'object' ? (
                      <RenderRichText data={service.description} />
                    ) : (
                      <p>{typeof service.description === 'string' ? service.description : ''}</p>
                    )}
                  </div>
                  
                  {service.features && service.features.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">What's Included:</h4>
                      <ul className="text-sm space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {service.price && (
                    <div className="mb-4">
                      <span className="text-sm text-gray-500 mb-1 block">Investment:</span>
                      <span className="text-xl font-bold text-gray-800">{service.price}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 pt-0 mt-auto">
                  <a
                    href="#contact"
                    className={`block w-full text-center px-4 py-2 rounded-md font-medium text-white bg-${service.primaryColor || 'blue'}-600 hover:bg-${service.primaryColor || 'blue'}-700`}
                  >
                    Request Information
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
