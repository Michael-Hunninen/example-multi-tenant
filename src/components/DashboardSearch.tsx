'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, Video, BookOpen, Users, Settings, CreditCard, User, Award, Bell, Shield, Play, Home, Folder, Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'video' | 'program' | 'lesson' | 'page' | 'setting'
  url: string
  thumbnail?: string
  category: string
}

interface SearchResponse {
  results: SearchResult[]
  query: string
  total: number
}

const getTypeIcon = (type: string, category: string) => {
  switch (type) {
    case 'video':
      return <Video className="w-4 h-4 text-teal-400" />
    case 'program':
      return <BookOpen className="w-4 h-4 text-purple-400" />
    case 'lesson':
      return <Clock className="w-4 h-4 text-blue-400" />
    case 'page':
      switch (category) {
        case 'Navigation':
          return <Home className="w-4 h-4 text-indigo-400" />
        case 'Content':
          return <Folder className="w-4 h-4 text-green-400" />
        case 'Account':
          return <User className="w-4 h-4 text-orange-400" />
        case 'Billing':
          return <CreditCard className="w-4 h-4 text-emerald-400" />
        case 'Progress':
          return <Award className="w-4 h-4 text-yellow-400" />
        default:
          return <Home className="w-4 h-4 text-indigo-400" />
      }
    case 'setting':
      switch (category) {
        case 'Billing':
          return <CreditCard className="w-4 h-4 text-emerald-400" />
        case 'Settings':
          return <Settings className="w-4 h-4 text-gray-400" />
        case 'Security':
          return <Shield className="w-4 h-4 text-red-400" />
        default:
          return <Settings className="w-4 h-4 text-gray-400" />
      }
    default:
      return <Search className="w-4 h-4 text-gray-400" />
  }
}

const getTypeBadge = (type: string, category: string) => {
  switch (type) {
    case 'video':
      return 'Video'
    case 'program':
      return 'Program'
    case 'lesson':
      return 'Lesson'
    case 'page':
      return category
    case 'setting':
      return 'Setting'
    default:
      return 'Content'
  }
}

export default function DashboardSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search function with debouncing
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length > 1) {
        performSearch(query)
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(searchTimeout)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/lms/search?q=${encodeURIComponent(searchQuery)}&limit=8`, {
        signal: abortControllerRef.current.signal
      })
      
      if (response.ok) {
        const data: SearchResponse = await response.json()
        setResults(data.results)
        setShowResults(true)
        setSelectedIndex(-1)
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Search error:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.trim().length === 0) {
      setShowResults(false)
      setResults([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => prev < results.length - 1 ? prev + 1 : prev)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          navigateToResult(results[selectedIndex])
        } else if (results.length > 0) {
          navigateToResult(results[0])
        }
        break
      case 'Escape':
        setShowResults(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const navigateToResult = (result: SearchResult) => {
    router.push(result.url)
    setQuery('')
    setShowResults(false)
    setSelectedIndex(-1)
    inputRef.current?.blur()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) {
      navigateToResult(results[0])
    }
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search videos, programs, lessons..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim().length > 1 && results.length > 0 && setShowResults(true)}
            className="w-full bg-gray-900/50 border border-gray-800/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-colors"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500"></div>
            </div>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border-gray-700 shadow-2xl z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {results.length > 0 ? (
              <div className="py-2">
                {query && (
                  <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-800">
                    {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                  </div>
                )}
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => navigateToResult(result)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-colors border-b border-gray-800/50 last:border-b-0 ${
                      index === selectedIndex ? 'bg-gray-800/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(result.type, result.category)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-sm truncate">
                            {result.title}
                          </span>
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full flex-shrink-0">
                            {getTypeBadge(result.type, result.category)}
                          </span>
                        </div>
                        {result.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {result.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {result.category}
                          </span>
                          <ChevronRight className="w-3 h-3 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.trim().length > 1 ? (
              <div className="px-4 py-6 text-center text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <p className="text-sm">No results found for "{query}"</p>
                <p className="text-xs mt-1">Try searching for videos, programs, or lessons</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
