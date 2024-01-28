rm -rf "${PROJECT_ROOT}/speedcart-react/build"
npm run build
node "${PROJECT_ROOT}/speedcart-react/generateHTML.js"
cd "${PROJECT_ROOT}/speedcart-react/build"
mkdir api && cd api
ln -s /var/www/SpeedCart/src/DataManager.php DataManager.php
ln -s /var/www/SpeedCart/src/authenticate.php authenticate.php