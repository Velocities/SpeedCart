rm -rf "${PROJECT_ROOT}/shopfast-react/build"
npm run build
cd "${PROJECT_ROOT}/shopfast-react/build"
mkdir api && cd api
ln -s /var/www/ShopFast/src/ShopFastDataManager.php ShopFastDataManager.php