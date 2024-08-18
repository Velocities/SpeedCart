const path = require('path');
const webpack = require('webpack');

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
  
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "path": require.resolve("path-browserify"),
    "fs": false,
    "crypto": false,
    "os": require.resolve('os-browserify/browser'),
    "process": require.resolve("process/browser"), // Add this line
  };

  // Add the ProvidePlugin for process polyfill
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser', // Add this line
    }),
  ]);

  return config;
};
