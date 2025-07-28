import { PayloadRequest } from 'payload'

declare module 'payload' {
  interface PayloadRequest {
    tenant?: {
      slug?: string
      [key: string]: any
    }
  }
}
