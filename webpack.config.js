const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'zpl-image-convert.bundle.js',
    libraryTarget: 'umd'
  },
  resolve: {
    alias: {
      "jimp": "jimp/browser/lib/jimp",
    },
    fallback: {
      "zlib": require.resolve("browserify-zlib"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "url": false,
      "path": false,//require.resolve("path-browserify")
      "fs": false,
      "http": false,
      "https": false,
      "querystring": false,
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};