import { Payload } from 'payload'

export const seedAchievements = async (payload: Payload, tenantId: string) => {
  const achievements = [
    {
      title: 'Welcome to JG Performance Horses!',
      description: 'Complete your first login and explore the platform',
      type: 'first_login',
      points: 25,
      status: 'active',
      rarity: 'common',
      tenant: tenantId,
    },
    {
      title: 'First Steps',
      description: 'Watch your first training video',
      type: 'video_completion',
      points: 10,
      criteria: {
        videosToComplete: 1,
      },
      status: 'active',
      rarity: 'common',
      tenant: tenantId,
    },
    {
      title: 'Getting Started',
      description: 'Complete 5 training videos',
      type: 'video_completion',
      points: 50,
      criteria: {
        videosToComplete: 5,
      },
      status: 'active',
      rarity: 'common',
      tenant: tenantId,
    },
    {
      title: 'Dedicated Learner',
      description: 'Complete 10 training videos',
      type: 'video_completion',
      points: 100,
      criteria: {
        videosToComplete: 10,
      },
      status: 'active',
      rarity: 'uncommon',
      tenant: tenantId,
    },
    {
      title: 'Video Master',
      description: 'Complete 25 training videos',
      type: 'video_completion',
      points: 250,
      criteria: {
        videosToComplete: 25,
      },
      status: 'active',
      rarity: 'rare',
      tenant: tenantId,
    },
    {
      title: 'Program Graduate',
      description: 'Complete your first training program',
      type: 'program_completion',
      points: 200,
      criteria: {
        programsToComplete: 1,
      },
      status: 'active',
      rarity: 'uncommon',
      tenant: tenantId,
    },
    {
      title: 'Consistent Rider',
      description: 'Login for 7 consecutive days',
      type: 'streak',
      points: 150,
      criteria: {
        streakDays: 7,
      },
      status: 'active',
      rarity: 'uncommon',
      tenant: tenantId,
    },
    {
      title: 'Committed Trainer',
      description: 'Login for 30 consecutive days',
      type: 'streak',
      points: 500,
      criteria: {
        streakDays: 30,
      },
      status: 'active',
      rarity: 'epic',
      tenant: tenantId,
    },
    {
      title: 'Time Investment',
      description: 'Spend 10 hours learning',
      type: 'time_spent',
      points: 300,
      criteria: {
        timeSpentHours: 10,
      },
      status: 'active',
      rarity: 'uncommon',
      tenant: tenantId,
    },
    {
      title: 'Community Member',
      description: 'Leave your first comment on a video',
      type: 'comment',
      points: 25,
      status: 'active',
      rarity: 'common',
      tenant: tenantId,
    },
    {
      title: 'JG Performance Horses Champion',
      description: 'Complete all available training programs',
      type: 'special',
      points: 1000,
      status: 'active',
      rarity: 'legendary',
      tenant: tenantId,
    },
  ]

  console.log(`🏆 Creating ${achievements.length} achievements for tenant ${tenantId}...`)

  for (const achievement of achievements) {
    try {
      const existing = await payload.find({
        collection: 'achievements',
        where: {
          and: [
            { tenant: { equals: tenantId } },
            { title: { equals: achievement.title } }
          ]
        },
        limit: 1
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'achievements',
          data: achievement
        })
        console.log(`✅ Created achievement: ${achievement.title}`)
      } else {
        console.log(`⏭️  Achievement already exists: ${achievement.title}`)
      }
    } catch (error) {
      console.error(`❌ Error creating achievement ${achievement.title}:`, error)
    }
  }

  console.log('🎉 Achievements seeding completed!')
}
