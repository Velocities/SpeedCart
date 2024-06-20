# Remove old build contents
rm -rf "${PROJECT_ROOT}/speedcart-react/build"
# Rebuild React app
npm run build
# Rebuild HTML for ToS and Privacy Policy files
node "${PROJECT_ROOT}/speedcart-react/generateHTML.js"
cd "${PROJECT_ROOT}/speedcart-react/build"