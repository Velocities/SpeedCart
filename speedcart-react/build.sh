#!/bin/bash

# Define the project root on your server
PROJECT_ROOT=/var/www/SpeedCart

# Navigate to the project directory
cd $PROJECT_ROOT/speedcart-react

# Install dependencies
npm install --force

# Build the project
npm run build

# Generate HTML
PROJECT_ROOT=$PROJECT_ROOT node generateHTML.js
