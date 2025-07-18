import type { Page } from '../../../payload-types'

import { draftMode } from 'next/headers'
import React from 'react'

import { RenderBlocks } from '../../../blocks/RenderBlocks'
import { RenderHero } from '../../../heros/RenderHero'
import { LivePreviewListener } from '../../../components/LivePreviewListener'

export const RenderPage = async ({ data }: { data: Page }) => {
  // Check if draft mode is enabled for LivePreview
  const { isEnabled: draft } = await draftMode()
  
  // Extract hero and layout from the page data
  const { hero, layout } = data
  
  return (
    <article className="pt-16 pb-24">
      {/* User control section */}
      <div className="mb-6 border-b pb-4">
        <form action="/api/users/logout" method="post" className="inline-block">
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">Logout</button>
        </form>
      </div>
      
      {/* Add LivePreviewListener when draft mode is enabled */}
      {draft && <LivePreviewListener />}
      
      {/* Render the page content using the website template components */}
      {hero && <RenderHero {...hero} />}
      {layout && <RenderBlocks blocks={layout} />}
    </article>
  )
}
