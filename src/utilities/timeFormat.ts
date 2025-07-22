/**
 * Format seconds into a readable time string with hours, minutes, and seconds
 * @param totalSeconds - Total seconds to format
 * @returns Formatted time string (e.g., "2h 15m 30s", "45m 12s", "30s")
 */
export function formatWatchTime(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 0) {
    return '0s'
  }

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  const parts: string[] = []

  if (hours > 0) {
    parts.push(`${hours}h`)
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`)
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`)
  }

  return parts.join(' ')
}

/**
 * Format streak count with proper pluralization
 * @param days - Number of days in streak
 * @returns Formatted streak string (e.g., "1 day", "7 days")
 */
export function formatStreak(days: number): string {
  if (days === 0) {
    return '0 days'
  }
  
  return days === 1 ? '1 day' : `${days} days`
}
