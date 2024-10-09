const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

const config = {
  API_DOMAIN: process.env.API_DOMAIN,
  API_PORT: process.env.API_PORT,
};

// Write the config to a file in the shared directory
fs.writeFileSync(path.resolve(__dirname, './src/constants/config.json'), JSON.stringify(config, null, 2));
console.log('Config file generated successfully.');
