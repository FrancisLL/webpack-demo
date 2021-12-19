
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const webpack = require('webpack')

const devConfig = {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin()
  ],
  devServer: {
    static: "./dist",
    hot: true
  },
  stats: 'errors-only',
  devtool: 'source-map'
}

module.exports = merge(baseConfig, devConfig)