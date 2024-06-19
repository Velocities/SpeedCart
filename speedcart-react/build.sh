#!/bin/bash

# Define the React project root on your server
PROJECT_ROOT=/var/www/SpeedCart/speedcart-react

# Navigate to the project directory
cd $PROJECT_ROOT

rm -rf "build"
npm run build
node "generateHTML.js"
cd "build"