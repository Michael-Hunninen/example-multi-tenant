'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, Users, BookOpen, Play, ChevronRight, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { LMSHeroBlock } from '@/payload-types'
import { Button } from '@/components/ui/button'

type Props = {
  className?: string
} & LMSHeroBlock

const iconMap = {
  award: Award,
  users: Users,
  'book-open': BookOpen,
  play: Play,
  'chevron-right': ChevronRight,
  shield: Shield,
}

export const LMSHeroBlockComponent: React.FC<Props> = ({
  className,
  type = 'default',
  title,
  subtitle,
  backgroundImage,
  primaryButton,
  secondaryButton,
  features,
}) => {
  const getButtonVariant = (style: string) => {
    switch (style) {
      case 'primary':
        return 'default'
      case 'secondary':
        return 'secondary'
      case 'outline':
        return 'outline'
      default:
        return 'default'
    }
  }

  const getButtonClasses = (style: string) => {
    switch (style) {
      case 'primary':
        return 'bg-teal hover:bg-teal/90 text-black text-lg px-8 py-6'
      case 'outline':
        return 'border-teal text-teal hover:bg-teal/10 text-lg px-8 py-6'
      default:
        return 'text-lg px-8 py-6'
    }
  }

  return (
    <section className={`py-16 md:py-24 text-center bg-gradient-to-b from-black to-gray-900 relative overflow-hidden ${className || ''}`}>
      {backgroundImage && typeof backgroundImage === 'object' && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={backgroundImage.url || '/placeholder.svg?height=1080&width=1920'}
            alt={backgroundImage.alt || 'Background'}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
          
          {(primaryButton?.text || secondaryButton?.text) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {primaryButton?.text && primaryButton?.url && (
                <Button
                  asChild
                  size="lg"
                  variant={getButtonVariant(primaryButton.style || 'primary')}
                  className={getButtonClasses(primaryButton.style || 'primary')}
                >
                  <Link href={primaryButton.url}>{primaryButton.text}</Link>
                </Button>
              )}
              
              {secondaryButton?.text && secondaryButton?.url && (
                <Button
                  asChild
                  size="lg"
                  variant={getButtonVariant(secondaryButton.style || 'outline')}
                  className={getButtonClasses(secondaryButton.style || 'outline')}
                >
                  <Link href={secondaryButton.url}>{secondaryButton.text}</Link>
                </Button>
              )}
            </div>
          )}
          
          {features && features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {features.map((feature, index) => {
                const IconComponent = feature.icon ? iconMap[feature.icon as keyof typeof iconMap] : null
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    {IconComponent && (
                      <div className="w-16 h-16 mx-auto mb-4 bg-teal/10 rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-teal" />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    {feature.description && (
                      <p className="text-gray-300">
                        {feature.description}
                      </p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
