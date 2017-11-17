const webpackMerge = require('webpack-merge');
const common = require('./common');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

// Paths are relative to the root of the project
module.exports = webpackMerge(common, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: `${__dirname}/../../public`,
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextWebpackPlugin('[name].css')
  ],
});
