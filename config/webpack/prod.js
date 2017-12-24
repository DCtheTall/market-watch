const webpackMerge = require('webpack-merge');
const common = require('./common');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = webpackMerge(common, {
  devtool: 'source-map',
  output: {
    path: `${__dirname}/../../public`,
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js',
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true,
      },
    }),
    new ExtractTextWebpackPlugin('[name].[hash].css'),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false, // workaround for ng2
      },
    }),
  ],
});
