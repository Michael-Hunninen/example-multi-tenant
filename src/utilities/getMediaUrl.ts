import { getClientSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  // Handle already absolute URLs (with http/https)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }
  
  // Ensure URL starts with a slash
  const formattedUrl = url.startsWith('/') ? url : `/${url}`
  
  // For relative URLs, add the base URL to make them absolute
  // This ensures consistent behavior between server and client
  const baseUrl = getClientSideURL()
  return cacheTag 
    ? `${baseUrl}${formattedUrl}?${cacheTag}` 
    : `${baseUrl}${formattedUrl}`
}
