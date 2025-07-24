const fs = require('fs');
const path = require('path');

// Ensure the directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Copy the client reference manifest file
function copyClientReferenceManifest() {
  const sourceFile = path.join(process.cwd(), 'src', 'app', '(frontend)', 'page_client-reference-manifest.js');
  const targetDir = path.join(process.cwd(), '.next', 'server', 'app', '(frontend)');
  const targetFile = path.join(targetDir, 'page_client-reference-manifest.js');

  try {
    // Ensure the target directory exists
    ensureDirectoryExists(targetDir);

    // Check if source file exists
    if (!fs.existsSync(sourceFile)) {
      console.error(`Source file does not exist: ${sourceFile}`);
      return;
    }

    // Copy the file
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`Successfully copied client reference manifest to: ${targetFile}`);
  } catch (error) {
    console.error('Error copying client reference manifest:', error);
  }
}

// Execute the copy function
copyClientReferenceManifest();
