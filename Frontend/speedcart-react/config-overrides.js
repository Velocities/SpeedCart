const path = require('path');

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@constants': path.resolve(__dirname, 'src/constants'),
    '@customHooks': path.resolve(__dirname, 'src/customHooks'),
    '@modularStyles': path.resolve(__dirname, 'src/modularStyles'),
    '@pages': path.resolve(__dirname, 'src/pages'),
  };
  return config;
};
