type AfterChangeArgs = {
  doc: Record<string, any>;
  req: {
    payload: {
      logger: {
        error: (message: string) => void;
      };
    };
  };
}

export const revalidateFooter = async ({ doc, req }: AfterChangeArgs) => {
  // Only run revalidation on the server side
  if (typeof window === 'undefined') {
    try {
      // Dynamic import to avoid client-side bundling issues
      const { revalidatePath } = await import('next/cache')
      // Revalidate all pages since footer is used globally within a tenant
      revalidatePath('/', 'layout')
    } catch (err: unknown) {
      req.payload.logger.error(`Error revalidating footer: ${err}`)
    }
  }

  return doc
}
