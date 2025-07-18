import React from 'react'
import { RenderRichText } from '../../components/RichText'
import type { ContentBlock } from '../../payload-types'
import classes from './index.module.scss'

export const ContentBlock: React.FC<ContentBlock> = ({ columns }) => {
  return (
    <div className={classes.content}>
      <div className={classes.wrap}>
        {columns?.map((column, i) => {
          const { size, richText, enableLink, link } = column

          return (
            <div
              key={i}
              className={[classes.column, classes[`column--${size || 'oneThird'}`]].join(' ')}
            >
              <RenderRichText content={richText} />
              {enableLink && link?.label && (
                <div className={classes.linkWrap}>
                  {link.type === 'page' && link.page ? (
                    <a href={`/${typeof link.page === 'object' ? link.page.slug : link.page}`} className={classes.link}>
                      {link.label}
                    </a>
                  ) : (
                    link.url && (
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={classes.link}
                      >
                        {link.label}
                      </a>
                    )
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
