import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] })
    }

    // Get tenant from domain
    const domain = request.headers.get('host') || 'localhost:3000'
    const tenant = await getTenantByDomain(domain)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const payload = await getPayload({ config })
    const results: any[] = []

    // Search Videos
    try {
      const videos = await payload.find({
        collection: 'videos',
        where: {
          and: [
            { tenant: { equals: tenant.id } },
            { status: { equals: 'published' } },
            {
              or: [
                { title: { contains: query } },
                { 'tags.tag': { contains: query } }
              ]
            }
          ]
        },
        limit: Math.min(limit, 5),
        depth: 2
      })

      videos.docs.forEach(video => {
        const videoData = video as any
        results.push({
          id: video.id,
          title: videoData.title || 'Untitled Video',
          description: videoData.description ? (typeof videoData.description === 'string' ? videoData.description : 'No description') : 'No description',
          type: 'video',
          url: `/dashboard/videos/${video.id}`,
          thumbnail: videoData.thumbnail,
          category: videoData.category?.name || 'Videos'
        })
      })
    } catch (error) {
      console.log('Error searching videos:', error)
    }

    // Search Programs
    try {
      const programs = await payload.find({
        collection: 'programs',
        where: {
          and: [
            { tenant: { equals: tenant.id } },
            { status: { equals: 'published' } },
            {
              or: [
                { title: { contains: query } },
                { shortDescription: { contains: query } },
                { 'tags.tag': { contains: query } }
              ]
            }
          ]
        },
        limit: Math.min(limit, 5),
        depth: 2
      })

      programs.docs.forEach(program => {
        const programData = program as any
        results.push({
          id: program.id,
          title: programData.title || 'Untitled Program',
          description: programData.shortDescription || programData.description || 'No description',
          type: 'program',
          url: `/dashboard/programs/${program.id}`,
          thumbnail: programData.thumbnail,
          category: 'Programs'
        })
      })
    } catch (error) {
      console.log('Error searching programs:', error)
    }

    // Search Dashboard Sections & Navigation
    const dashboardSections = [
      {
        id: 'dashboard-home',
        title: 'Dashboard',
        description: 'Main dashboard overview with stats and activity',
        type: 'page',
        url: '/dashboard',
        category: 'Navigation',
        keywords: ['home', 'overview', 'stats', 'main', 'dashboard']
      },
      {
        id: 'videos-library',
        title: 'Video Library',
        description: 'Browse and watch training videos',
        type: 'page',
        url: '/dashboard/videos',
        category: 'Content',
        keywords: ['videos', 'library', 'watch', 'training', 'lessons']
      },
      {
        id: 'programs-page',
        title: 'Programs',
        description: 'View and enroll in training programs',
        type: 'page',
        url: '/dashboard/programs',
        category: 'Content',
        keywords: ['programs', 'courses', 'enroll', 'training']
      },
      {
        id: 'profile-page',
        title: 'Profile',
        description: 'Manage your profile and learning stats',
        type: 'page',
        url: '/dashboard/profile',
        category: 'Account',
        keywords: ['profile', 'account', 'stats', 'achievements', 'learning', 'progress']
      },
      {
        id: 'settings-page',
        title: 'Settings',
        description: 'Manage notifications, privacy, and account settings',
        type: 'page',
        url: '/dashboard/settings',
        category: 'Account',
        keywords: ['settings', 'preferences', 'notifications', 'privacy', 'account', 'password', 'security']
      },
      {
        id: 'billing-settings',
        title: 'Billing & Subscription',
        description: 'Manage your subscription and billing information',
        type: 'setting',
        url: '/dashboard/settings?tab=billing',
        category: 'Billing',
        keywords: ['billing', 'subscription', 'payment', 'invoice', 'plan', 'upgrade', 'cancel']
      },
      {
        id: 'pricing-plans',
        title: 'Pricing Plans',
        description: 'View and upgrade your subscription plan',
        type: 'page',
        url: '/dashboard/pricing',
        category: 'Billing',
        keywords: ['pricing', 'plans', 'upgrade', 'subscription', 'premium', 'vip', 'basic']
      },
      {
        id: 'achievements-page',
        title: 'Achievements',
        description: 'View your learning achievements and badges',
        type: 'page',
        url: '/dashboard/achievements',
        category: 'Progress',
        keywords: ['achievements', 'badges', 'rewards', 'progress', 'milestones']
      },
      {
        id: 'notification-settings',
        title: 'Notification Settings',
        description: 'Control email and push notifications',
        type: 'setting',
        url: '/dashboard/settings?tab=notifications',
        category: 'Settings',
        keywords: ['notifications', 'email', 'alerts', 'reminders', 'push']
      },
      {
        id: 'privacy-settings',
        title: 'Privacy Settings',
        description: 'Manage your privacy and data preferences',
        type: 'setting',
        url: '/dashboard/settings?tab=privacy',
        category: 'Settings',
        keywords: ['privacy', 'data', 'sharing', 'visibility', 'security']
      },
      {
        id: 'playback-settings',
        title: 'Playback Settings',
        description: 'Customize video playback preferences',
        type: 'setting',
        url: '/dashboard/settings?tab=playback',
        category: 'Settings',
        keywords: ['playback', 'video', 'quality', 'speed', 'captions', 'autoplay']
      },
      {
        id: 'account-security',
        title: 'Account Security',
        description: 'Manage password and security settings',
        type: 'setting',
        url: '/dashboard/settings?tab=account',
        category: 'Security',
        keywords: ['security', 'password', 'account', 'login', 'authentication', '2fa']
      }
    ]

    // Filter dashboard sections based on search query
    const matchingSections = dashboardSections.filter(section => {
      const searchLower = query.toLowerCase()
      return (
        section.title.toLowerCase().includes(searchLower) ||
        section.description.toLowerCase().includes(searchLower) ||
        section.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
      )
    })

    // Add matching sections to results
    matchingSections.slice(0, Math.min(limit - results.length, 4)).forEach(section => {
      results.push({
        id: section.id,
        title: section.title,
        description: section.description,
        type: section.type,
        url: section.url,
        category: section.category,
        thumbnail: null
      })
    })

    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase().includes(query.toLowerCase())
      const bExact = b.title.toLowerCase().includes(query.toLowerCase())
      
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      
      return a.title.localeCompare(b.title)
    })

    return NextResponse.json({
      results: results.slice(0, limit),
      query,
      total: results.length
    })

  } catch (error) {
    console.error('Error in search API:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
