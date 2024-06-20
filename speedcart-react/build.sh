#!/bin/bash

# Define PROJECT_ROOT if not already defined
PROJECT_ROOT="${PROJECT_ROOT:-/var/www/SpeedCart}"

# Remove old build contents
rm -rf "${PROJECT_ROOT}/speedcart-react/build"

# Rebuild React app
npm run build

# Debug: Check if generateHTML.js exists
if [ -f "${PROJECT_ROOT}/speedcart-react/generateHTML.js" ]; then
  echo "generateHTML.js found at ${PROJECT_ROOT}/speedcart-react"
else
  echo "generateHTML.js not found at ${PROJECT_ROOT}/speedcart-react"
  exit 1
fi

# Rebuild HTML for ToS and Privacy Policy files
node "${PROJECT_ROOT}/speedcart-react/generateHTML.js"

# Go to build directory for any user needs (e.g., check on build files, permissions, etc.)
cd "${PROJECT_ROOT}/speedcart-react/build"
