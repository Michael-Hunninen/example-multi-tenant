/**
 * Helper module for handling static generation during build phase
 */
import { isBuildPhase } from './buildPhase';

/**
 * A wrapper for generateStaticParams to safely handle build phase
 * This will return empty params during build to prevent DB connection attempts
 * 
 * @param originalFunction The original generateStaticParams function
 * @returns Either empty params during build or the result of the original function
 */
export function withSafeStaticGeneration<T>(originalFunction: () => Promise<T[]>): () => Promise<T[]> {
  return async () => {
    if (isBuildPhase()) {
      console.log('Build phase detected, skipping DB-dependent static generation');
      return [] as T[];
    }

    try {
      return await originalFunction();
    } catch (error) {
      console.error('Error in static generation:', error);
      return [] as T[];
    }
  };
}

/**
 * Wrapper for data fetching functions that should be skipped during build
 * 
 * @param originalFunction The original data fetching function
 * @param fallbackData Optional fallback data to use during build
 * @returns Either fallback data during build or the result of the original function
 */
export function withSafeDataFetch<T, Args extends any[]>(
  originalFunction: (...args: Args) => Promise<T>,
  fallbackData: T
): (...args: Args) => Promise<T> {
  return async (...args: Args) => {
    if (isBuildPhase()) {
      console.log('Build phase detected, skipping DB-dependent data fetch');
      return fallbackData;
    }

    try {
      return await originalFunction(...args);
    } catch (error) {
      console.error('Error in data fetch:', error);
      return fallbackData;
    }
  };
}
