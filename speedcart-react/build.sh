rm -rf "${PROJECT_ROOT}/speedcart-react/build"
npm run build
node "${PROJECT_ROOT}/speedcart-react/generateHTML.js"
cd "${PROJECT_ROOT}/speedcart-react/build"