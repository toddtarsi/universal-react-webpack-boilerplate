/* eslint-disable no-undefined, object-shorthand */

const path = require('path')
const webpack = require('webpack')
const config = require('../config/config')
const merge = require('lodash.merge')
const paths = require('../config/paths')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpackConfig = require('./webpack.config.js')
const DEBUG = config.DEBUG

const extractCSS = new ExtractTextPlugin({ filename: paths.styleSheet, disable: false, allChunks: true })

//
// Server Config
// -----------------------------------------------------------------------------
const webpackServerConfig = merge({}, webpackConfig, {
  name: 'server',
  target: 'node',
  entry: './src/server',
  output: {
    filename: 'server.js',
    libraryTarget: 'commonjs2',
    path: paths.buildDir
  },
  module: {
    loaders: webpackConfig.module.loaders.concat([
      {
        test: /\.css$/,
        loader: extractCSS.extract({ fallbackLoader: 'style', loader: `css?modules${DEBUG ? '&localIdentName=[name]_[local]_[hash:base64:3]' : '&minimize'}!postcss` }),
        exclude: /node_modules/,
        include: path.resolve('.')
      }
    ])
  },
  plugins: webpackConfig.plugins.concat(
    new webpack.DefinePlugin({ __BROWSER__: false }),
    extractCSS
  ).concat(DEBUG ? [] : [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      output: {
        comments: false
      },
      compress: {
        screw_ie8: true, // eslint-disable-line camelcase
        warnings: false
      }
    }),
  ]),
  node: {
    __dirname: false,
    __filename: false,
    Buffer: false,
    console: false,
    global: false,
    process: false
  },
  externals: /^[a-z][a-z\.\-0-9]*$/
})

module.exports = webpackServerConfig
