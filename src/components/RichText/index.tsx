'use client'

import {
  DefaultNodeTypes,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import { cn } from '@/utilities/ui'

type NodeTypes = DefaultNodeTypes

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  className?: string
}

const RichText: React.FC<Props> = ({ data, enableGutter = true, enableProse = true, className }) => {
  if (!data) return null

  const classNames = cn({
    'grid grid-cols-layout': enableGutter,
    'col-start-2': enableGutter,
    prose: enableProse,
  }, className)

  return (
    <div className={classNames}>
      <ConvertRichText
        data={data}
        converters={jsxConverters}
      />
    </div>
  )
}

export default RichText
export { RichText as RenderRichText }
