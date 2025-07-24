// next.config.env.mjs
// This file sets default environment variables for the build process

// Set default environment variables if they're not already set
if (!process.env.DATABASE_URI) {
  process.env.DATABASE_URI = 'mongodb+srv://demo:demo@cluster0.mongodb.net/payload-multi-tenant?retryWrites=true&w=majority';
}

if (!process.env.PAYLOAD_SECRET) {
  process.env.PAYLOAD_SECRET = 'your_secure_random_payload_secret_key_here_min_32_chars';
}

if (!process.env.PAYLOAD_PUBLIC_SERVER_URL) {
  process.env.PAYLOAD_PUBLIC_SERVER_URL = 'https://your-site.netlify.app';
}

export {};
