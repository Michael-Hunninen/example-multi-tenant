// Helper to create consistent rich text content
export const createRichTextContent = (elements: Array<{type?: string, text?: string, children?: any[]}>) => {
  return {
    root: {
      children: elements.map(el => {
        if (el.type) {
          return {
            type: el.type,
            children: el.children || [{ text: el.text || '', type: 'text', version: 1 }],
            version: 1,
          }
        }
        return { text: el.text || '', type: 'text', version: 1 }
      }),
      direction: 'ltr' as 'ltr' | 'rtl' | null,
      format: 'left' as '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify',
      indent: 0,
      version: 1,
      type: 'root',
    }
  }
}

// Pre-defined rich text content for different sections
export const heroRichText = (title: string, description: string) => createRichTextContent([
  { text: '' },
  { type: 'h1', text: title },
  { text: '' },
  { type: 'paragraph', text: description },
  { text: '' },
])

export const contentRichText = (title: string, description: string) => createRichTextContent([
  { text: '' },
  { type: 'h2', text: title },
  { text: '' },
  { type: 'paragraph', text: description },
  { text: '' },
])
