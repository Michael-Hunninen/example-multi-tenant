// netlify-build.js
const fs = require('fs');
const path = require('path');

// Create a temporary .env file specifically for Netlify build
// Check for environment variables from Netlify dashboard and exit with error if required ones are missing
if (!process.env.DATABASE_URI) {
  console.error('ERROR: DATABASE_URI environment variable is required but not set');
  process.exit(1);
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('ERROR: PAYLOAD_SECRET environment variable is required but not set');
  process.exit(1);
}

// Force correct server URL for Netlify deployment
const serverUrl = 'https://clubsolve.netlify.app';

const envContent = `# Environment variables for Netlify build
# Created by netlify-build.js
DATABASE_URI=${process.env.DATABASE_URI}
PAYLOAD_SECRET=${process.env.PAYLOAD_SECRET}
PAYLOAD_PUBLIC_SERVER_URL=${serverUrl}
NEXT_PUBLIC_SERVER_URL=${serverUrl}
`;

// Write the .env file
fs.writeFileSync(path.join(__dirname, '.env'), envContent);

console.log('Created .env file for Netlify build with the following config:');
console.log(`- DATABASE_URI: [secured]`);
console.log(`- PAYLOAD_PUBLIC_SERVER_URL: ${serverUrl}`);
console.log(`- NEXT_PUBLIC_SERVER_URL: ${serverUrl}`);

