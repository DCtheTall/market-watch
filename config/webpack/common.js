const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Paths are relative to the root of the project
module.exports = {
  entry: {
    bundle: `${__dirname}/../../src/main.ts`,
    vendor: `${__dirname}/../../src/vendor.ts`,
    polyfills: `${__dirname}/../../src/polyfills.ts`,
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  module: {
    rules: [
      {
        test: /.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: `${__dirname}/../../src/tsconfig.json`,
            },
          },
          'angular2-template-loader',
        ],
      },
      {
        test: /.html$/,
        loader: 'html-loader',
      },
      {
        test: /.scss$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' }),
      },
      {
        test: /.css$/,
        include: `${__dirname}/../../src`,
        loader: 'raw-loader'
      },
    ],
  },

  plugins: [
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      `${__dirname}/../../src`, // location of your src
      {} // a map of your routes
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: `${__dirname}/../../public/index.html`,
    })
  ],
};
