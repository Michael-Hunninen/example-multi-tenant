import { revalidatePath, revalidateTag } from 'next/cache'

// Custom type definitions to avoid payload-types import errors
type Post = {
  _status?: string;
  slug?: string;
  [key: string]: any;
}

type RevalidateArgs = {
  doc: Post;
  previousDoc?: Post;
  req: {
    payload: {
      logger: {
        info: (message: string) => void;
      };
    };
    context: {
      disableRevalidate?: boolean;
    };
  };
}

type DeleteArgs = {
  doc?: Post;
  req: {
    context: {
      disableRevalidate?: boolean;
    };
  };
}

export const revalidatePost = ({
  doc,
  previousDoc,
  req: { payload, context },
}: RevalidateArgs) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateTag('posts-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('posts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete = ({ doc, req: { context } }: DeleteArgs) => {
  if (!context.disableRevalidate) {
    const path = `/posts/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('posts-sitemap')
  }

  return doc
}
