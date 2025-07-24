// netlify-build.js
const fs = require('fs');
const path = require('path');

// Create a temporary .env file specifically for Netlify build
const envContent = `DATABASE_URI=mongodb+srv://username:password@example-multi-tenant.mongodb.net/?retryWrites=true&w=majority&appName=example-multi-tenant
PAYLOAD_SECRET=your_secure_secret_key_here
PAYLOAD_PUBLIC_SERVER_URL=https://your-site.netlify.app
`;

// Write the .env file
fs.writeFileSync(path.join(__dirname, '.env'), envContent);

console.log('Created .env file for Netlify build with valid MongoDB connection string.');
