"use client"

import React, { useState } from 'react'
import { Media } from '../Media'

export type TestimonialType = {
  id: string
  quote: string
  author: string
  role?: string
  location?: string
  image?: {
    id: string
    alt?: string
    url: string
    updatedAt: string
    createdAt: string
  }
  rating?: number
}

export type TestimonialsProps = {
  title?: string
  description?: string
  testimonials: TestimonialType[]
  style?: 'carousel' | 'grid'
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  title = 'What Our Clients Say',
  description,
  testimonials,
  style = 'carousel'
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const nextTestimonial = () => {
    setActiveIndex((activeIndex + 1) % testimonials.length)
  }
  
  const prevTestimonial = () => {
    setActiveIndex((activeIndex - 1 + testimonials.length) % testimonials.length)
  }
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }
  
  return (
    <div className="testimonials py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-3">{title}</h2>
        )}
        
        {description && (
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">{description}</p>
        )}
        
        {style === 'carousel' ? (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={`testimonial-slide transition-opacity duration-300 ${
                    index === activeIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                      <svg 
                        className="w-12 h-12 text-blue-600 opacity-25 mx-auto mb-4" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      
                      <p className="text-lg text-gray-700 italic">{testimonial.quote}</p>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      {testimonial.image && (
                        <div className="mr-4">
                          <Media 
                            resource={testimonial.image.id} 
                            alt={testimonial.image.alt || testimonial.author}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="text-left">
                        <h4 className="font-bold text-lg">{testimonial.author}</h4>
                        
                        {(testimonial.role || testimonial.location) && (
                          <p className="text-gray-600">
                            {testimonial.role && <span>{testimonial.role}</span>}
                            {testimonial.role && testimonial.location && <span> • </span>}
                            {testimonial.location && <span>{testimonial.location}</span>}
                          </p>
                        )}
                        
                        {testimonial.rating && (
                          <div className="mt-1">
                            {renderStars(testimonial.rating)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {testimonials.length > 1 && (
              <div className="flex justify-center mt-8 space-x-4">
                <button 
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-100 shadow"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-100 shadow"
                  aria-label="Next testimonial"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
            
            {testimonials.length > 1 && (
              <div className="flex justify-center mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 mx-1 rounded-full ${
                      index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                {testimonial.rating && (
                  <div className="mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                )}
                
                <p className="text-gray-700 italic mb-6">{testimonial.quote}</p>
                
                <div className="flex items-center">
                  {testimonial.image && (
                    <div className="mr-4">
                      <Media 
                        resource={testimonial.image.id} 
                        alt={testimonial.image.alt || testimonial.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-bold">{testimonial.author}</h4>
                    
                    {(testimonial.role || testimonial.location) && (
                      <p className="text-gray-600 text-sm">
                        {testimonial.role && <span>{testimonial.role}</span>}
                        {testimonial.role && testimonial.location && <span> • </span>}
                        {testimonial.location && <span>{testimonial.location}</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
