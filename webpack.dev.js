var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var path = require('path');

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: (path.join(__dirname, 'static/js')),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  watch: true

});