const fs = require('fs');
const path = require('path');

// Read the root package.json file
const packageJson = require('./package.json');
const version = packageJson.version;

// Define the paths to the .env files
const envFilePath = path.join(__dirname, '', '.env'); // Adjust the path as needed
const envTestFilePath = path.join(__dirname, '', '.env.test'); // Adjust the path as needed

// Write the version to the .env file
fs.writeFileSync(envFilePath, `REACT_APP_VERSION=${version}\n`, 'utf8');

// Write the version to the .env.test file
fs.writeFileSync(envTestFilePath, `REACT_APP_VERSION=${version}\n`, 'utf8');

console.log(`Version ${version} written to .env and .env.test files`);
