import { revalidatePath } from 'next/cache'

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

export const revalidateHeader = async ({ doc, req }: AfterChangeArgs) => {
  try {
    // Revalidate all pages since header is used globally within a tenant
    revalidatePath('/', 'layout')
  } catch (err: unknown) {
    req.payload.logger.error(`Error revalidating header: ${err}`)
  }

  return doc
}
