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

export const revalidateFooter = async ({ doc, req }: AfterChangeArgs) => {
  try {
    // Revalidate all pages since footer is used globally within a tenant
    revalidatePath('/', 'layout')
  } catch (err: unknown) {
    req.payload.logger.error(`Error revalidating footer: ${err}`)
  }

  return doc
}
