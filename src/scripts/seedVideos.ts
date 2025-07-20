import { getPayload } from 'payload'
import config from '../payload.config'

async function seedVideos() {
  const payload = await getPayload({ config })

  try {
    // Get the first tenant (you can modify this to use a specific tenant)
    const tenants = await payload.find({
      collection: 'tenants',
      limit: 1
    })

    if (tenants.docs.length === 0) {
      console.log('No tenants found. Please create a tenant first.')
      return
    }

    const tenant = tenants.docs[0]
    console.log(`Creating videos for tenant: ${tenant.name}`)

    // Sample videos to create
    const sampleVideos = [
      {
        title: 'Advanced Barrel Racing Techniques',
        slug: 'advanced-barrel-racing-techniques',
        description: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Master the fundamentals of barrel racing with professional techniques and tips. This comprehensive video covers everything from approach angles to exit strategies.',
                    type: 'text',
                    version: 1
                  }
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1
          }
        },
        duration: 1125, // 18:45 in seconds
        difficulty: 'advanced',
        status: 'published',
        featured: true,
        accessLevel: 'free',
        tenant: tenant.id,
        tags: [
          { tag: 'barrel racing' },
          { tag: 'advanced' },
          { tag: 'competition' }
        ]
      },
      {
        title: 'Horse Conditioning Fundamentals',
        slug: 'horse-conditioning-fundamentals',
        description: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Learn the essential principles of horse conditioning for optimal performance and health.',
                    type: 'text',
                    version: 1
                  }
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1
          }
        },
        duration: 900, // 15:00 in seconds
        difficulty: 'beginner',
        status: 'published',
        featured: true,
        accessLevel: 'free',
        tenant: tenant.id,
        tags: [
          { tag: 'conditioning' },
          { tag: 'health' },
          { tag: 'fundamentals' }
        ]
      },
      {
        title: 'Western Pleasure Training',
        slug: 'western-pleasure-training',
        description: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Comprehensive guide to western pleasure training techniques and show ring preparation.',
                    type: 'text',
                    version: 1
                  }
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1
          }
        },
        duration: 1350, // 22:30 in seconds
        difficulty: 'intermediate',
        status: 'published',
        featured: false,
        accessLevel: 'basic',
        tenant: tenant.id,
        tags: [
          { tag: 'western pleasure' },
          { tag: 'training' },
          { tag: 'show ring' }
        ]
      }
    ]

    // Create the videos
    for (const videoData of sampleVideos) {
      try {
        const video = await payload.create({
          collection: 'videos',
          data: videoData
        })
        console.log(`✅ Created video: ${video.title}`)
      } catch (error) {
        console.error(`❌ Failed to create video: ${videoData.title}`, error)
      }
    }

    console.log('\n🎉 Video seeding completed!')
    console.log('You should now see videos in your admin panel.')

  } catch (error) {
    console.error('Error seeding videos:', error)
  }

  process.exit(0)
}

seedVideos()
