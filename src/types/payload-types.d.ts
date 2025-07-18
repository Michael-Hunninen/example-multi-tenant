import { PayloadRequest } from 'payload/types'

declare module 'payload/types' {
  interface PayloadRequest {
    tenant?: {
      slug?: string
      [key: string]: any
    }
  }
}
