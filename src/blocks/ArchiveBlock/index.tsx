'use client'

import React, { useState, useCallback } from 'react'
import { RenderRichText } from '../../components/RichText'
import { Card } from '../../components/Card'
import { CMSLink } from '../../components/Link'
import { cn } from '@/utilities/ui'

type AllowedRelations = 'posts' | 'media';

export type ArchiveBlockProps = {
  blockType: 'archive'
  blockName?: string
  relationTo: AllowedRelations
  populateBy: 'collection' | 'selection'
  limit: number
  selectedDocs?: string[]
  categories?: string[]
  populatedDocs?: any[]
  populatedDocsTotal?: number
  loading?: boolean
  introContent?: any
  showPageButtons?: boolean
  layout?: 'grid' | 'list'
  title?: string
  showThumbnails?: boolean
  enableFeaturedItems?: boolean
  featuredItems?: number
  callToAction?: {
    text?: string
    url?: string
    type?: 'reference' | 'custom'
    reference?: {
      value: string | number
      relationTo: AllowedRelations
    }
    newTab?: boolean
  }
}

export const ArchiveBlock: React.FC<ArchiveBlockProps> = (props) => {
  const { 
    populatedDocs = [],
    introContent,
    categories,
    relationTo = 'posts',
    blockName,
    layout = 'grid',
    title,
    showThumbnails = true,
    enableFeaturedItems = false,
    featuredItems = 0,
    limit = 9,
    callToAction,
    showPageButtons = true,
    loading = false
  } = props
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  
  // Calculate items per page based on layout and limit
  const itemsPerPage = Math.min(limit, 12)
  
  // Convert populatedDocs to the expected format
  const posts = Array.isArray(populatedDocs) ? populatedDocs.map(doc => ({
    ...doc,
    title: doc.title || '',
    slug: doc.slug || '',
  })) : []
  
  // Filter posts by active category if one is selected
  const filteredPosts = activeCategory 
    ? posts.filter(post => {
        return post.categories?.some((category: any) => 
          typeof category === 'object' && 
          category?.title === activeCategory
        )
      })
    : posts
  
  // Extract unique category names from posts
  const uniqueCategories = Array.from(new Set(
    posts
      .flatMap(post => post.categories || [])
      .filter((category): category is { title: string } => 
        typeof category === 'object' && category !== null && 'title' in category)
      .map(category => category.title)
      .filter(Boolean)
  ))
  
  // Pagination logic
  const totalItems = filteredPosts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const currentItems = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  // Pagination handlers
  const goToPage = useCallback((pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)))
    // Scroll to top of archive section
    const archiveSection = document.getElementById(blockName ? slugify(blockName) : 'archive-block')
    if (archiveSection) {
      archiveSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [blockName, totalPages])
  
  // Extract featured items if enabled
  const featuredContentItems = enableFeaturedItems && featuredItems > 0
    ? filteredPosts
      .filter(post => post.featured === true)
      .slice(0, featuredItems)
    : []
  
  // Define layout classes based on layout prop
  const getLayoutClasses = () => {
    switch(layout) {
      case 'list':
        return 'flex flex-col gap-6'
      case 'grid':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
    }
  }
  
  return (
    <section 
      className="archive-block py-16 bg-white" 
      id={blockName ? slugify(blockName) : 'archive-block'}
    >
      <div className="container mx-auto px-4">
        {/* Title */}
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{title}</h2>
        )}
        
        {/* Intro content */}
        {introContent && (
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <div className="prose prose-lg mx-auto">
              {typeof introContent === 'object' ? (
                <RenderRichText data={introContent} />
              ) : null}
            </div>
          </div>
        )}
        
        {/* Featured Items Section */}
        {enableFeaturedItems && featuredContentItems.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-6 border-b pb-2">Featured</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredContentItems.map((doc, index) => (
                <CMSLink
                  key={`featured-${doc.id}-${index}`}
                  url={`/${relationTo}/${doc.slug}`}
                  className="block group-hover:underline font-medium text-lg"
                >
                  <Card 
                    doc={doc} 
                    relationTo={relationTo}
                    showCategories
                    featured
                    size="large"
                  />
                </CMSLink>
              ))}
            </div>
          </div>
        )}
        
        {/* Category filters */}
        {uniqueCategories.length > 0 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            <button
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                activeCategory === null
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              )}
              onClick={() => {
                setActiveCategory(null)
                setCurrentPage(1) // Reset to first page when changing category
              }}
            >
              All
            </button>
            
            {uniqueCategories.map((category) => (
              <button
                key={category}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  activeCategory === category
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                )}
                onClick={() => {
                  setActiveCategory(category)
                  setCurrentPage(1) // Reset to first page when changing category
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        
        {/* Content grid */}
        <div className={getLayoutClasses()}>
          {currentItems.map((card, index) => (
            <div key={`card-${card.id || index}`} className="relative">
              <Card
                doc={card}
                relationTo={relationTo}
                showCategories
                showThumbnail={showThumbnails}
              />
              <CMSLink
                url={`/${relationTo}/${card.slug}`}
                className="absolute inset-0 w-full h-full z-10"
                aria-label={`View ${card.title || 'post'}`}
              />
            </div>
          ))}
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="text-center py-16 px-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-gray-300 border-r-transparent align-[-0.125em]" />
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && currentItems.length === 0 && (
          <div className="text-center py-16 px-4">
            <h3 className="text-xl font-medium text-gray-700">No Posts Found</h3>
            <p className="mt-2 text-gray-500">
              There are no posts to display at this time.
            </p>
            <button
              className="mt-4 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-blue-600 text-white"
              onClick={() => {
                setActiveCategory(null)
                setCurrentPage(1)
              }}
            >
              View All Posts
            </button>
          </div>
        )}
        
        {/* Pagination controls */}
        {totalPages > 1 && showPageButtons && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                'px-3 py-1 rounded border border-gray-300 flex items-center justify-center',
                currentPage === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100 transition-colors'
              )}
              aria-label="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10 12.77 13.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            
            {totalPages <= 5 ? (
              // Show all page numbers if 5 or fewer pages
              [...Array(totalPages)].map((_, i) => (
                <button
                  key={`page-${i + 1}`}
                  onClick={() => goToPage(i + 1)}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-full',
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100 transition-colors'
                  )}
                >
                  {i + 1}
                </button>
              ))
            ) : (
              // Show limited page numbers with ellipsis for more than 5 pages
              <>
                {[...Array(Math.min(3, totalPages))].map((_, i) => (
                  <button
                    key={`page-${i + 1}`}
                    onClick={() => goToPage(i + 1)}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-full',
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 transition-colors'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                
                {currentPage > 3 && (
                  <span className="px-2">...</span>
                )}
                
                {currentPage > 3 && currentPage < totalPages - 2 && (
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white"
                  >
                    {currentPage}
                  </button>
                )}
                
                {currentPage < totalPages - 2 && (
                  <span className="px-2">...</span>
                )}
                
                {totalPages > 3 && (
                  <button
                    onClick={() => goToPage(totalPages)}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-full',
                      currentPage === totalPages
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 transition-colors'
                    )}
                  >
                    {totalPages}
                  </button>
                )}
              </>
            )}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                'px-3 py-1 rounded border border-gray-300 flex items-center justify-center',
                currentPage === totalPages 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100 transition-colors'
              )}
              aria-label="Next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Call to action */}
        {callToAction?.text && (
          <div className="mt-12 flex justify-center">
            <CMSLink
              type={callToAction.type || 'custom'}
              url={callToAction.url || ''}
              reference={callToAction.reference && {
                relationTo: callToAction.reference.relationTo as "pages" | "posts",
                value: callToAction.reference.value
              }}
              newTab={callToAction.newTab}
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {callToAction.text}
            </CMSLink>
          </div>
        )}
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
