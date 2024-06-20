# Remove old build contents
rm -rf "${PROJECT_ROOT}/speedcart-react/build"
# Rebuild React app
npm run build
# Rebuild HTML for ToS and Privacy Policy files
node "${PROJECT_ROOT}/speedcart-react/generateHTML.js"
# Go to build directory for any user needs (e.g. check on build files, permissions, etc.)
cd "${PROJECT_ROOT}/speedcart-react/build"