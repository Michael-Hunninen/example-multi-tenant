import React from 'react'

// Utility function to safely render Payload CMS rich text content
export function renderRichText(content: any): string {
  if (!content) return ''
  
  // If it's already a string, return it
  if (typeof content === 'string') return content
  
  // If it's a Payload rich text object with root
  if (content && typeof content === 'object' && content.root) {
    return extractTextFromRichText(content.root)
  }
  
  // If it's an array or other object, try to stringify safely
  if (Array.isArray(content)) {
    return content.map(item => renderRichText(item)).join(' ')
  }
  
  // Fallback to empty string for objects
  return ''
}

// Extract plain text from Payload rich text structure
function extractTextFromRichText(node: any): string {
  if (!node) return ''
  
  // If it's a text node
  if (node.text) {
    return node.text
  }
  
  // If it has children, recursively extract text
  if (node.children && Array.isArray(node.children)) {
    return node.children.map((child: any) => extractTextFromRichText(child)).join('')
  }
  
  return ''
}

// React component to safely render rich text (for future use if needed)
export function RichTextRenderer({ content }: { content: any }) {
  const text = renderRichText(content)
  return <span>{text}</span>
}
