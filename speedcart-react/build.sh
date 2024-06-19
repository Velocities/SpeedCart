#!/bin/bash

# Define the project root on your server
PROJECT_ROOT=/var/www/SpeedCart/speedcart-react

# Navigate to the project directory
cd $PROJECT_ROOT

# Install dependencies
npm install --force

# Build the project
npm run build

# Move to the build directory
cd build

# Generate HTML
node ../generateHTML.js
