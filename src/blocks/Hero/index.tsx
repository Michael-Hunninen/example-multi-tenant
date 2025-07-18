'use client'

import React from 'react'
import { Media } from '../../components/Media'
import RichText from '../../components/RichText'
import { CMSLink } from '../../components/Link'
import classes from './index.module.scss'

// Define our own type since it might not be in payload-types yet
type HeroBlockType = {
  type?: 'centered' | 'contentLeft' | 'contentRight'
  title?: string
  subtitle?: any // Rich text content
  media?: {
    id: string
    alt?: string
    url?: string
  }
  primaryButton?: {
    label?: string
    type?: 'page' | 'custom'
    page?: any
    url?: string
  }
  secondaryButton?: {
    label?: string
    type?: 'page' | 'custom'
    page?: any
    url?: string
  }
  overlayColor?: 'dark' | 'light' | 'none'
}

export const HeroBlock: React.FC<HeroBlockType> = ({
  type = 'centered',
  title,
  subtitle,
  media,
  primaryButton,
  secondaryButton,
  overlayColor = 'dark',
}) => {
  return (
    <section className={classes.hero}>
      <div className={[classes.wrapper, classes[`type--${type}`]].filter(Boolean).join(' ')}>
        {media && (
          <div className={classes.media}>
            <Media
              resource={typeof media === 'string' ? (media || null) : (media?.id ? media : null)}
              alt={media?.alt || ''}
              className={classes.mediaImage}
              fill
              priority
            />
            {overlayColor !== 'none' && (
              <div className={[classes.overlay, classes[`overlay--${overlayColor}`]].filter(Boolean).join(' ')} />
            )}
          </div>
        )}

        <div className={classes.contentWrapper}>
          <div className={classes.content}>
            {title && <h1 className={classes.title}>{title}</h1>}
            {subtitle && (
              <div className={classes.subtitle}>
                {typeof subtitle === 'object' ? (
                  <RichText data={subtitle} enableGutter={false} />
                ) : (
                  <p>{typeof subtitle === 'string' ? subtitle : ''}</p>
                )}
              </div>
            )}

            {(primaryButton?.label || secondaryButton?.label) && (
              <div className={classes.buttons}>
                {primaryButton?.label && (
                  <div className={classes.primaryButton}>
                    <CMSLink
                      label={primaryButton.label || ''}
                      type={primaryButton.type === 'page' ? 'reference' : 'custom'}
                      reference={primaryButton.page}
                      url={primaryButton.url}
                      appearance="default"
                      className={classes.button}
                    />
                  </div>
                )}
                {secondaryButton?.label && (
                  <div className={classes.secondaryButton}>
                    <CMSLink
                      label={secondaryButton.label || ''}
                      type={secondaryButton.type === 'page' ? 'reference' : 'custom'}
                      reference={secondaryButton.page}
                      url={secondaryButton.url}
                      appearance="default"
                      className={classes.button}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
