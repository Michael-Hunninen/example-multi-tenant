// Custom type definition for User to avoid payload-types import errors
type User = {
  id?: string;
  name?: string;
  [key: string]: any;
}

type PopulateArgs = {
  doc: {
    authors?: Array<string | { id: string }>;
    populatedAuthors?: Array<{ id: string; name: string }>;
    [key: string]: any;
  };
  req: {
    payload: {
      findByID: (args: {
        id: string;
        collection: string;
        depth: number;
      }) => Promise<User>;
    };
  };
}

// The `user` collection has access control locked so that users are not publicly accessible
// This means that we need to populate the authors manually here to protect user privacy
// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the user data, hidden from the admin UI
// Use type assertion to make this compatible with Payload's AfterReadHook type
export const populateAuthors = async ({ doc, req }: any) => {
  const { payload } = req;
  if (doc?.authors && doc?.authors?.length > 0) {
    const authorDocs: User[] = []

    for (const author of doc.authors) {
      try {
        const authorDoc = await payload.findByID({
          id: typeof author === 'object' ? author?.id : author,
          collection: 'users',
          depth: 0,
        })

        if (authorDoc) {
          authorDocs.push(authorDoc)
        }

        if (authorDocs.length > 0) {
          doc.populatedAuthors = authorDocs.map((authorDoc) => ({
            id: authorDoc.id ?? '', // Ensure id is always a string
            name: authorDoc.name ?? '', // Ensure name is always a string
          }))
        }
      } catch {
        // swallow error
      }
    }
  }

  return doc
}
